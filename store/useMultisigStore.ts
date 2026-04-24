import { create } from 'zustand';
import {
  multisigApi,
  type AssetOut,
  type TradeOut,
  type EscrowOut,
  type UserOut,
} from '@/lib/api/multisigApiClient';
import { connectUnisat, signEscrowPSBT } from '@/lib/wallets/unisatProvider';

// ─── Types ───

export type MultisigStep = 'setup' | 'escrow' | 'dashboard' | 'dispute';

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  network: 'mainnet' | 'testnet' | 'signet' | null;
  role: 'buyer' | 'seller' | 'arbitrator' | null;
}

export interface MultisigStore {
  // State
  user: UserOut | null;
  trades: TradeOut[];
  activeEscrow: EscrowOut | null;
  step: MultisigStep;
  wallet: WalletState;
  isLoading: boolean;
  error: string | null;

  // Actions
  setStep: (step: MultisigStep) => void;
  login: (email: string, password: string) => Promise<void>;
  connectWallet: (role: 'buyer' | 'seller') => Promise<void>;
  placeMarketOrder: (tokenId: string, quantity: number, priceSat: number) => Promise<string>; // returns tradeId
  fetchTrades: () => Promise<void>;
  fetchEscrow: (tradeId: string) => Promise<void>;
  signPSET: (tradeId: string, psetBase64: string) => Promise<void>;
  resetStore: () => void;
}

// ─── Initial State ───

const initialState = {
  user: null,
  trades: [],
  activeEscrow: null,
  step: 'setup' as MultisigStep,
  wallet: {
    isConnected: false,
    address: null,
    network: null,
    role: null,
  },
  isLoading: false,
  error: null,
};

// ─── Store ───

export const useMultisigStore = create<MultisigStore>((set, get) => ({
  ...initialState,

  setStep: (step) => set({ step }),

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await multisigApi.login(email, password);
      set({ user: response.user, isLoading: false });

      // Auto-connect mock wallet for demo users to enable UI buttons without extension
      if (['demo@example.com', 'seller@example.com', 'admin@example.com'].includes(email)) {
        set((state) => ({
          wallet: {
            ...state.wallet,
            isConnected: true,
            address: 'lq1qq2pzezw2h8f4t9k5n5k5k5k5k5k5k5k5k5k5k5', // Mock Liquid Address
            network: 'testnet',
            role: email === 'seller@example.com' ? 'seller' : 'buyer',
          }
        }));
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  connectWallet: async (role) => {
    set({ isLoading: true, error: null });
    try {
      const connection = await connectUnisat();
      set((state) => ({
        wallet: {
          ...state.wallet,
          isConnected: true,
          address: connection.address,
          network: (connection.network as any) === 'mainnet' ? 'mainnet' : 'testnet',
          role,
        },
        isLoading: false,
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Wallet connection failed';
      set({ error: message, isLoading: false });
    }
  },

  placeMarketOrder: async (tokenId, quantity, priceSat) => {
    set({ isLoading: true, error: null });
    try {
      // In Liquid platform, a 'market' or immediate 'limit' order creates a trade
      const response = await multisigApi.placeOrder({
        token_id: tokenId,
        side: 'buy',
        quantity,
        price_sat: priceSat,
        order_type: 'limit',
      });
      
      // The response.id here is the order ID, but for the escrow dashboard
      // we usually want the resulting Trade ID. 
      // For simplicity in this mock integration, we assume a trade is created.
      await get().fetchTrades();
      set({ isLoading: false });
      return response.id; 
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Order placement failed';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  fetchTrades: async () => {
    set({ isLoading: true });
    try {
      const trades = await multisigApi.getTrades();
      set({ trades: trades || [], isLoading: false });
    } catch (err: unknown) {
      set({ isLoading: false });
    }
  },

  fetchEscrow: async (tradeId) => {
    set({ isLoading: true, error: null });
    try {
      const escrow = await multisigApi.getEscrowByTrade(tradeId);
      
      // Demo Mode: Overlay mocked signatures if they exist
      const userEmail = get().user?.email;
      if (userEmail && ['demo@example.com', 'seller@example.com', 'admin@example.com'].includes(userEmail)) {
        const mockedEscrows = JSON.parse(localStorage.getItem('mocked_escrows') || '{}');
        if (mockedEscrows[tradeId]) {
          Object.assign(escrow, mockedEscrows[tradeId]);
        }
      }

      set({ activeEscrow: escrow, isLoading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Escrow fetch failed';
      set({ error: message, isLoading: false });
    }
  },

  signPSET: async (tradeId, psetBase64) => {
    set({ isLoading: true, error: null });
    try {
      // Demo Mode: Mock the entire signing flow since we don't have real Liquid funds
      const userEmail = get().user?.email;
      if (userEmail && ['demo@example.com', 'seller@example.com', 'admin@example.com'].includes(userEmail)) {
        console.log('Demo Mode: Simulating PSET signature and backend release');
        
        const mockedEscrows = JSON.parse(localStorage.getItem('mocked_escrows') || '{}');
        mockedEscrows[tradeId] = {
            buyer_signed: true,
            seller_signed: true, // Auto-sign seller for the demo
            status: 'released'
        };
        localStorage.setItem('mocked_escrows', JSON.stringify(mockedEscrows));
        
        set((state) => ({
            activeEscrow: state.activeEscrow ? {
                ...state.activeEscrow,
                ...mockedEscrows[tradeId]
            } : null,
            isLoading: false
        }));
        
        // Also update the trade status to settled in the local trades list
        set((state) => ({
           trades: state.trades.map(t => t.id === tradeId ? { ...t, status: 'settled' } : t)
        }));
        return;
      }
      
      const signedPsetBase64 = await signEscrowPSBT(psetBase64);
      
      // 2. Push to backend
      await multisigApi.signEscrow(tradeId, signedPsetBase64);
      
      // 3. Refresh status
      await get().fetchEscrow(tradeId);
      set({ isLoading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'PSET signing failed';
      set({ error: message, isLoading: false });
    }
  },

  resetStore: () => set(initialState),
}));

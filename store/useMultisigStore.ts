import { create } from 'zustand';
import {
  multisigApi,
  type EscrowResponse,
  type EscrowStatusResponse,
} from '@/lib/api/multisigApiClient';
import { connectUnisat, signEscrowPSBT } from '@/lib/wallets/unisatProvider';
import type { LiquidAsset, LiquidAddress } from '@/types/liquid';

// ─── Types ───

export type MultisigStep = 'setup' | 'escrow' | 'dispute';

export interface ContractParams {
  id: string | null;
  buyerPubkey: string;
  sellerPubkey: string;
  arbiterPubkey: string;
  amount: number;
  timelockBlocks: number;
  multisigAddress: string | null;
  redeemScript: string | null;
  // Liquid L2 placeholders
  liquidAsset?: LiquidAsset;
  liquidAddress?: LiquidAddress;
}

export interface EscrowBalance {
  confirmedSats: number;
  unconfirmedSats: number;
  totalSats: number;
}

export interface EscrowState {
  balance: EscrowBalance;
  isFunded: boolean;
  amountExpected: number;
  signaturesRequired: number;
  signaturesAcquired: number;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  network: 'mainnet' | 'testnet' | 'signet' | null;
  role: 'buyer' | 'seller' | 'arbitrator' | null;
}

export interface MultisigStore {
  // State
  step: MultisigStep;
  contractParams: ContractParams;
  escrowState: EscrowState;
  wallet: WalletState;
  isLoading: boolean;
  error: string | null;

  // Actions
  setStep: (step: MultisigStep) => void;
  connectWallet: (role: 'buyer' | 'seller') => Promise<void>;
  generateContract: (buyerPubkey: string, sellerPubkey: string, amount: number, timelockBlocks: number) => Promise<void>;
  signPSBT: (psbtBase64: string) => Promise<void>;
  fetchStatus: () => Promise<void>;
  resetStore: () => void;
}

// ─── Initial State ───

const initialState = {
  step: 'setup' as MultisigStep,
  contractParams: {
    id: null,
    buyerPubkey: '',
    sellerPubkey: '',
    arbiterPubkey: '',
    amount: 0,
    timelockBlocks: 144,
    multisigAddress: null,
    redeemScript: null,
  },
  escrowState: {
    balance: { confirmedSats: 0, unconfirmedSats: 0, totalSats: 0 },
    isFunded: false,
    amountExpected: 0,
    signaturesRequired: 2,
    signaturesAcquired: 0,
  },
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

  connectWallet: async (role) => {
    set({ isLoading: true, error: null });
    try {
      // Real UniSat connection
      const connection = await connectUnisat();
      
      set((state) => ({
        wallet: {
          ...state.wallet,
          isConnected: true,
          address: connection.address,
          network: connection.network === 'mainnet' ? 'mainnet' : 'testnet',
          role,
        },
        contractParams: {
          ...state.contractParams,
          // Inject the real public key into the correct role slot
          [role === 'buyer' ? 'buyerPubkey' : 'sellerPubkey']: connection.publicKey,
        },
        isLoading: false,
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Wallet connection failed';
      set({ error: message, isLoading: false });
    }
  },

  generateContract: async (buyerPubkey, sellerPubkey, amount, timelockBlocks) => {
    set({ isLoading: true, error: null });
    try {
      const arbiterPubkey =
        process.env.NEXT_PUBLIC_ARBITER_PUBKEY ||
        '0295843b67975878415d862f1c8418f4adeee155d140e4f8abb7ec86e885d56220';

      const response: EscrowResponse = await multisigApi.createEscrow({
        buyer_pubkey: buyerPubkey,
        seller_pubkey: sellerPubkey,
        arbiter_pubkey: arbiterPubkey,
        amount,
        timelock_blocks: timelockBlocks,
      });

      set({
        step: 'escrow',
        contractParams: {
          id: response.id,
          buyerPubkey,
          sellerPubkey,
          arbiterPubkey,
          amount: response.amount,
          timelockBlocks: response.timelock_blocks,
          multisigAddress: response.p2wsh_address,
          redeemScript: response.redeem_script,
          liquidAsset: response.liquid_asset,
          liquidAddress: response.liquid_address,
        },
        escrowState: {
          balance: { confirmedSats: 0, unconfirmedSats: 0, totalSats: 0 },
          isFunded: false,
          amountExpected: response.amount,
          signaturesRequired: 2,
          signaturesAcquired: 0,
        },
        isLoading: false,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Contract generation failed';
      set({ error: message, isLoading: false });
    }
  },

  signPSBT: async (psbtBase64OrHex) => {
    const { contractParams, wallet } = get();
    if (!contractParams.id) {
      set({ error: 'No active contract' });
      return;
    }

    const signerRole = wallet.role === 'buyer' ? 'buyer' : wallet.role === 'seller' ? 'seller' : 'arbiter';

    set({ isLoading: true, error: null });
    try {
      // 1. Real signing via UniSat
      // Note: signPsbt typically expects hex, but backend might produce base64
      // We assume the component passes the format expected by the provider
      const signedPsbtHex = await signEscrowPSBT(psbtBase64OrHex);

      // 2. Upload the partially signed PSBT to backend
      await multisigApi.uploadPSBT(contractParams.id, {
        psbt_base64: signedPsbtHex, // Backend handles hex/base64 detection or conversion if needed
        signer_role: signerRole as 'buyer' | 'seller' | 'arbiter',
      });

      // 3. Increment local signature count
      set((state) => ({
        escrowState: {
          ...state.escrowState,
          signaturesAcquired: Math.min(
            state.escrowState.signaturesAcquired + 1,
            state.escrowState.signaturesRequired
          ),
        },
      }));

      // 4. Attempt to combine if quorum is met
      const updated = get();
      if (updated.escrowState.signaturesAcquired >= updated.escrowState.signaturesRequired) {
        await multisigApi.combinePSBTs(contractParams.id);
      }

      set({ isLoading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'PSBT signing failed';
      set({ error: message, isLoading: false });
    }
  },

  fetchStatus: async () => {
    const { contractParams } = get();
    if (!contractParams.id) {
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const status: EscrowStatusResponse = await multisigApi.getEscrowStatus(contractParams.id);

      set((state) => ({
        escrowState: {
          ...state.escrowState,
          balance: {
            confirmedSats: status.balance.confirmed_sats,
            unconfirmedSats: status.balance.unconfirmed_sats,
            totalSats: status.balance.total_sats,
          },
          isFunded: status.is_funded,
          amountExpected: status.amount_expected,
        },
        isLoading: false,
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Status fetch failed';
      set({ error: message, isLoading: false });
    }
  },

  resetStore: () => set(initialState),
}));

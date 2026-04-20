import type { LiquidAsset, LiquidAddress } from '@/types/liquid';

// ─── Platform Schemas (Aligning with tokenization services) ───

export interface AssetOut {
  id: string;
  name: string;
  description: string;
  category: string;
  valuation_sat: number;
  status: string;
}

export interface TradeOut {
  id: string;
  token_id: string;
  buyer_id: string;
  seller_id: string;
  price_sat: number;
  quantity: number;
  status: 'pending' | 'settled' | 'cancelled' | 'disputed';
  created_at: string;
}

export interface EscrowOut {
  id: string;
  trade_id: string;
  multisig_address: string;
  pset_base64: string;
  status: 'pending' | 'funded' | 'shipped' | 'released' | 'disputed' | 'refunded';
  buyer_signed: boolean;
  seller_signed: boolean;
  arbiter_signed: boolean;
}

export interface OrderCreateRequest {
  token_id: string;
  side: 'buy' | 'sell';
  quantity: number;
  price_sat: number;
  order_type?: 'market' | 'limit';
}

export interface SignEscrowRequest {
  pset: string;
}

// ─── Auth Types ───

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface UserOut {
  id: string;
  email: string;
  display_name: string;
  role: string;
}

export interface AuthResponse {
  user: UserOut;
  tokens: AuthTokens;
}

// ─── API Client ───

class MultisigApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8000/v1';
  }

  setToken(token: string) {
    this.token = token;
  }

  private sanitizeError(detail: string): string {
    const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
    const fileRegex = /(\/|\\|[a-zA-Z]:\\).+\.(py|go|ts|js|sh|log)/;
    const dbRegex = /postgres|sql|database|db|query/i;
    const tracebackRegex = /traceback|line \d+|at 0x/i;

    if (ipRegex.test(detail) || fileRegex.test(detail) || dbRegex.test(detail) || tracebackRegex.test(detail)) {
      return 'Error interno del servidor. Por favor, contacte al soporte.';
    }
    return detail;
  }

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options?.headers as Record<string, string>,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
      const detail = errorData.error?.message || errorData.detail || `Request failed with status ${response.status}`;
      throw new Error(this.sanitizeError(detail));
    }

    return response.json();
  }

  // ─── Marketplace & Trades ───

  async listAssets(): Promise<{ assets: AssetOut[] }> {
    return this.request('/tokenization/assets');
  }

  async placeOrder(payload: OrderCreateRequest): Promise<{ id: string }> {
    return this.request('/marketplace/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getTrades(): Promise<TradeOut[]> {
    return this.request('/marketplace/trades');
  }

  async getEscrowByTrade(tradeId: string): Promise<EscrowOut> {
    return this.request(`/marketplace/escrows/${tradeId}`);
  }

  async signEscrow(tradeId: string, pset: string): Promise<{ message: string }> {
    return this.request(`/marketplace/escrows/${tradeId}/sign`, {
      method: 'POST',
      body: JSON.stringify({ pset }),
    });
  }

  // ─── Auth (For integration purposes) ───

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(response.tokens.access_token);
    return response;
  }
}

export const multisigApi = new MultisigApiClient();

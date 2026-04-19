import type { LiquidAsset, LiquidAddress } from '@/types/liquid';

// ─── Request Types (snake_case to match FastAPI Pydantic models) ───

export interface EscrowCreateRequest {
  buyer_pubkey: string;
  seller_pubkey: string;
  arbiter_pubkey: string;
  amount: number;
  timelock_blocks: number;
}

export interface PSBTUploadRequest {
  psbt_base64: string;
  signer_role: 'buyer' | 'seller' | 'arbiter';
}

export interface DocumentUploadRequest {
  document_url: string;
  document_type: string;
  uploaded_by: string;
}

// ─── Response Types ───

export interface EscrowResponse {
  id: string;
  buyer_pubkey: string;
  seller_pubkey: string;
  arbiter_pubkey: string;
  amount: number;
  p2wsh_address: string;
  redeem_script: string;
  timelock_blocks: number;
  status: 'pending' | 'funded' | 'shipped' | 'disputed' | 'completed' | 'refunded';
  // Liquid L2 placeholders (will be populated when backend migrates)
  liquid_asset?: LiquidAsset;
  liquid_address?: LiquidAddress;
}

export interface BalanceInfo {
  address: string;
  confirmed_sats: number;
  unconfirmed_sats: number;
  total_sats: number;
  error?: string;
}

export interface EscrowStatusResponse {
  contract_id: string;
  p2wsh_address: string;
  balance: BalanceInfo;
  amount_expected: number;
  is_funded: boolean;
  // Liquid L2 placeholder
  liquid_asset?: LiquidAsset;
}

export interface PSBTUploadResponse {
  message: string;
  id: string;
}

export interface PSBTCombineResponse {
  combined_psbt: string;
}

// ─── API Client ───

class MultisigApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_MULTISIG_API_URL || 'http://localhost:8000';
  }

  private sanitizeError(detail: string): string {
    // Regex to detect sensitive info: IPs, Database paths, Tracebacks/File paths
    const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
    const fileRegex = /(\/|\\|[a-zA-Z]:\\).+\.(py|go|ts|js|sh|log)/;
    const dbRegex = /postgres|sql|database|db|query/i;
    const tracebackRegex = /traceback|line \d+|at 0x/i;

    if (ipRegex.test(detail) || fileRegex.test(detail) || dbRegex.test(detail) || tracebackRegex.test(detail)) {
      console.warn('[Security] Sensitive error info detected and sanitized:', detail);
      return 'Error interno del servidor. Por favor, contacte al soporte.';
    }

    return detail;
  }

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      const errorMessage = this.sanitizeError(errorData.detail || `Request failed with status ${response.status}`);
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * POST /api/escrow/create
   * Creates a 2-of-3 P2WSH escrow contract.
   */
  async createEscrow(payload: EscrowCreateRequest): Promise<EscrowResponse> {
    return this.request<EscrowResponse>('/api/escrow/create', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /**
   * GET /api/escrow/{contract_id}/status
   * Returns on-chain balance and funding status.
   */
  async getEscrowStatus(contractId: string): Promise<EscrowStatusResponse> {
    return this.request<EscrowStatusResponse>(`/api/escrow/${contractId}/status`);
  }

  /**
   * POST /api/psbt/{contract_id}/upload
   * Uploads a partially signed PSBT for a specific signer role.
   */
  async uploadPSBT(contractId: string, payload: PSBTUploadRequest): Promise<PSBTUploadResponse> {
    return this.request<PSBTUploadResponse>(`/api/psbt/${contractId}/upload`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /**
   * POST /api/psbt/{contract_id}/combine
   * Combines all uploaded PSBTs into a finalized transaction.
   */
  async combinePSBTs(contractId: string): Promise<PSBTCombineResponse> {
    return this.request<PSBTCombineResponse>(`/api/psbt/${contractId}/combine`, {
      method: 'POST',
    });
  }

  /**
   * POST /api/documents/{contract_id}/upload
   * Uploads logistics/shipping proof documents.
   */
  async uploadDocument(contractId: string, payload: DocumentUploadRequest): Promise<{ message: string; id: string }> {
    return this.request<{ message: string; id: string }>(`/api/documents/${contractId}/upload`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}

export const multisigApi = new MultisigApiClient();

/**
 * Liquid Network placeholder types.
 * These are forward-looking interfaces for Liquid L2 migration.
 * All fields are used as optional extensions on L1 response types.
 */

export interface LiquidAsset {
  asset_id: string;
  is_confidential: boolean;
}

export interface LiquidAddress {
  /** Standard on-chain address (P2WSH, bech32, etc.) */
  address: string;
  /** Liquid confidential address (blinded) */
  confidential_address: string;
  /** Public blinding key for unblinding outputs */
  blinding_key: string;
}

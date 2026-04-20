/**
 * This map links the UI product IDs (used in URLs and the frontend catalog)
 * to the real Asset/Token IDs in the tokenization platform backend.
 * 
 * In a production environment, these would be fetched from the /tokenization/assets endpoint.
 */
export const PRODUCT_TOKEN_MAP: Record<string, { tokenId: string; assetId: string }> = {
  'trezor-safe-3': {
    tokenId: '936b0948-aec1-4888-b30d-ee509333d97e',
    assetId: '8d9b2940-a1c9-4c85-9e59-115fe0da9f0c',
  },
  'bitbox-02': {
    tokenId: '9fbfe864-013b-469b-9130-0bdcce10a9aa',
    assetId: '5557c899-86b7-40d4-af4a-6d462b191533',
  },
  'titanium-seed-plate': {
    tokenId: '5b2de039-2c58-4a5a-acd2-ef41c091bdc1',
    assetId: '854eff49-b43f-45b2-a974-902cc07f6848',
  },
};

export const getPlatformTokenId = (uiId: string): string | undefined => {
  return PRODUCT_TOKEN_MAP[uiId]?.tokenId;
};

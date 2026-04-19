/**
 * UniSat Wallet Mock Utility for Playwright
 * This script is injected into the browser context to simulate the window.unisat object.
 */

export const mockUnisatWallet = () => {
  const mockAddress = 'tb1q9vav37609uayygawh9vavkdg5v59f0f97p9v';
  const mockPublicKey = '023186835a60e65301886566060c5035f3dfa2f60241b12b23a96860db35368a5c';
  const mockSignedPsbtHex = '70736274ff0100740200000001mock_signed_hex';

  (window as any).unisat = {
    requestAccounts: async () => [mockAddress],
    getAccounts: async () => [mockAddress],
    getNetwork: async () => 'testnet',
    getPublicKey: async () => mockPublicKey,
    signPsbt: async (psbtHex: string) => {
      console.log('[MockUnisat] signPsbt called with:', psbtHex);
      return mockSignedPsbtHex;
    },
    on: (event: string, handler: Function) => {
      console.log(`[MockUnisat] Registered listener for ${event}`);
    },
    removeListener: (event: string, handler: Function) => {
      console.log(`[MockUnisat] Removed listener for ${event}`);
    }
  };
  
  console.log('[MockUnisat] window.unisat has been injected.');
};

/**
 * Stringified version of the mock function for page.addInitScript
 */
export const unisatInitScript = `
  (${mockUnisatWallet.toString()})();
`;

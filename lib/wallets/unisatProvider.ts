/**
 * UniSat Wallet Provider
 * Encapsulates all browser-side interactions with the UniSat extension.
 */

export interface UniSatConnection {
  address: string;
  publicKey: string;
  network: 'mainnet' | 'testnet';
}

// We capture the original reference at load time to prevent runtime hijacking
const getOriginalUnisat = () => {
  if (typeof window === 'undefined') return null;
  return (window as any).unisat;
};

const originalUnisat = getOriginalUnisat();

/**
 * Check if UniSat is installed in the current browser.
 */
export const isUniSatInstalled = (): boolean => {
  return !!originalUnisat && typeof originalUnisat.signPsbt === 'function';
};

/**
 * Request account connection to UniSat.
 * @returns {Promise<UniSatConnection>} The connection details.
 * @throws Error if extension not found or user rejects request.
 */
export const connectUnisat = async (): Promise<UniSatConnection> => {
  if (!isUniSatInstalled()) {
    throw new Error('UniSat extension not found. Please install it from unisat.io');
  }

  try {
    // Request accounts from the user
    const [address] = await originalUnisat.requestAccounts();
    if (!address) {
      throw new Error('No accounts authorized');
    }

    // Capture critical data for our backend (Compressed Pubkey)
    const publicKey = await originalUnisat.getPublicKey();
    const network = await originalUnisat.getNetwork();

    return {
      address,
      publicKey,
      network: network as 'mainnet' | 'testnet'
    };
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error('Connection rejected by user');
    }
    throw error;
  }
};

/**
 * Sign a PSBT using UniSat as a non-finalizing signer.
 * @param psbtHex The PSBT in hexadecimal format.
 * @returns {Promise<string>} The signed PSBT in hexadecimal.
 */
export const signEscrowPSBT = async (psbtHex: string): Promise<string> => {
  if (!isUniSatInstalled()) {
    throw new Error('UniSat extension not found');
  }

  try {
    // We sign WITHOUT auto-finalizing to allow the backend to combine signatures
    const signedPsbtHex = await originalUnisat.signPsbt(psbtHex, {
      autoFinalized: false
    });
    
    return signedPsbtHex;
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error('Signing rejected by user');
    }
    throw error;
  }
};

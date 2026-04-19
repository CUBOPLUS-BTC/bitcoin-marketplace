export {};

declare global {
  interface Window {
    unisat: {
      requestAccounts: () => Promise<string[]>;
      getAccounts: () => Promise<string[]>;
      getNetwork: () => Promise<'mainnet' | 'testnet'>;
      getPublicKey: () => Promise<string>;
      signPsbt: (
        psbtHex: string,
        options?: {
          autoFinalized?: boolean;
          toSignInputs?: Array<{
            index: number;
            address?: string;
            publicKey?: string;
            sighashTypes?: number[];
            disableTweak?: boolean;
          }>;
        }
      ) => Promise<string>;
      on: (event: string, handler: (data: any) => void) => void;
      removeListener: (event: string, handler: (data: any) => void) => void;
    };
  }
}

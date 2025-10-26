import { createContext, useContext, useMemo, ReactNode } from 'react';
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
  useWallet
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter
} from '@solana/wallet-adapter-wallets';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletContextValue {
  publicKey: string | null;
  connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signTransaction?: any;
  signMessage?: any;
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

export const useWalletContext = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWalletContext must be used within WalletProvider');
  return ctx;
};

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter({ network }), new TorusWalletAdapter()],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletContextInner>{children}</WalletContextInner>
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
};

// ✅ Inner provider để gói useWallet()
const WalletContextInner = ({ children }: { children: ReactNode }) => {
  const { publicKey, connected, connect, disconnect, signTransaction, signMessage } = useWallet();

  const value = useMemo(
    () => ({
      publicKey: publicKey ? publicKey.toBase58() : null,
      connected,
      connect,
      disconnect,
      signTransaction,
      signMessage,
    }),
    [publicKey, connected]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

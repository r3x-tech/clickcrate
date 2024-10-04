"use client";

import dynamic from "next/dynamic";
import { AnchorProvider } from "@coral-xyz/anchor";
import { WalletError } from "@solana/wallet-adapter-base";
import {
  AnchorWallet,
  useConnection,
  useWallet,
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { TipLinkWalletAdapter } from "@tiplink/wallet-adapter";
import { TipLinkWalletAutoConnectV2 } from "@tiplink/wallet-adapter-react-ui";
import { ReactNode, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useCluster } from "@/features/cluster/hooks/useCluster";
import "@solana/wallet-adapter-react-ui/styles.css";

export const WalletButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export function SolanaProvider({ children }: { children: ReactNode }) {
  const { cluster } = useCluster();
  const endpoint = useMemo(() => cluster.endpoint, [cluster]);
  const onError = useCallback((error: WalletError) => {
    console.error(error);
  }, []);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TipLinkWalletAdapter({
        title: "ClickCrate Dashboard",
        clientId: process.env.NEXT_PUBLIC_TIPLINK_API_KEY!,
        theme: "dark", // pick between "dark"/"light"/"system"
      }),
    ],
    []
  );

  const searchParams = useSearchParams();

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect={true}>
        <WalletModalProvider>
          <TipLinkWalletAutoConnectV2 isReady query={searchParams}>
            {children}
          </TipLinkWalletAutoConnectV2>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export function useAnchorProvider() {
  const { connection } = useConnection();
  const wallet = useWallet();

  return new AnchorProvider(connection, wallet as AnchorWallet, {
    commitment: "confirmed",
  });
}

export { useWallet, useConnection } from "@solana/wallet-adapter-react";

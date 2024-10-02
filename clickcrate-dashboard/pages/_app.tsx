import "@/styles/global.css";
import "@/styles/blinks.css";
import type { AppProps } from "next/app";
import { ReactQueryProvider } from "@/components/ReactQueryProvider";
import Layout from "../components/Layout";
import { UnifiedWalletProvider, WalletName } from "@jup-ag/wallet-adapter";
import React, { useMemo } from "react";
import { ClusterProvider } from "../features/cluster/hooks/useCluster";
import { QueryClient } from "@tanstack/react-query";
import { TipLinkWalletAdapter } from "@tiplink/wallet-adapter";

export default function App({ Component, pageProps }: AppProps) {
  const wallets = useMemo(
    () => [
      /**
       * Use TipLinkWalletAdapter here
       * Include the name of the dApp in the constructor
       * Pass the client id that the TipLink team provides
       * Choose from "dark", "light", "system" for the theme
       */
      // new ParticleAdapter({
      //   config: {
      //     projectId: process.env.NEXT_PUBLIC_PROJECT_ID || '',
      //     clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY || '',
      //     appId: process.env.NEXT_PUBLIC_APP_ID || '',
      //   },
      // }),
      new TipLinkWalletAdapter({
        title: "ClickCrate Dashboard",
        clientId: process.env.TIPLINK_API_KEY!,
        theme: "dark", // pick between "dark"/"light"/"system"
      }),
    ],
    []
  );
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <ReactQueryProvider
      client={queryClient}
      dehydratedState={pageProps.dehydratedState}
    >
      <ClusterProvider>
        <UnifiedWalletProvider
          wallets={wallets}
          config={{
            autoConnect: false,
            env: "mainnet-beta",
            metadata: {
              name: "ClickCrate Dashboard",
              description: "ClickCrate Dashboard",
              url: "https://dashboard.clickcrate.xyz/",
              iconUrls: ["https://dashboard.clickcrate.xyz/favicon.ico"],
            },
            walletlistExplanation: {
              href: "https://station.jup.ag/docs/additional-topics/wallet-list",
            },
            theme: "jupiter",
            lang: "en",
          }}
        >
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </UnifiedWalletProvider>
      </ClusterProvider>
    </ReactQueryProvider>
  );
}

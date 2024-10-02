// pages/_app.tsx
import "@/styles/globals.css";
import "@/styles/blinks.css";
import type { AppProps } from "next/app";
import { ReactQueryProvider } from "@/components/ReactQueryProvider";
import Layout from "../components/Layout";
import { UnifiedWalletProvider } from "@jup-ag/wallet-adapter";
import { useMemo } from "react";
import { ClusterProvider } from "../features/cluster/hooks/useCluster";
import { UiLayout } from "../components/UiLayout";

const links = [
  { label: "Home", path: "/" },
  { label: "Product Listings", path: "/product-listings" },
  // Add more links as needed
];

export default function App({ Component, pageProps }: AppProps) {
  const wallets = useMemo(() => [], []);

  return (
    <ReactQueryProvider>
      <ClusterProvider>
        <UnifiedWalletProvider
          wallets={wallets}
          config={{
            autoConnect: false,
            env: "mainnet-beta",
            metadata: {
              name: "ClickCrate Dashboard",
              description: "ClickCrate Dashboard",
              url: "https://your-dashboard-url.com",
              iconUrls: ["https://your-dashboard-url.com/favicon.ico"],
            },
            walletlistExplanation: {
              href: "https://station.jup.ag/docs/additional-topics/wallet-list",
            },
            theme: "dark",
            lang: "en",
          }}
        >
          <Layout>
            <UiLayout links={links}>
              <Component {...pageProps} />
            </UiLayout>
          </Layout>
        </UnifiedWalletProvider>
      </ClusterProvider>
    </ReactQueryProvider>
  );
}

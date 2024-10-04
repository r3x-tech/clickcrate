import "@/styles/global.css";
import "@/styles/blinks.css";
import type { AppProps } from "next/app";
import { ReactQueryProvider } from "@/components/ReactQueryProvider";
import Layout from "../components/Layout";
import React, { useState } from "react";
import { ClusterProvider } from "../features/cluster/hooks/useCluster";
import { SolanaProvider } from "../solana/solana-provider";
import { QueryClient } from "@tanstack/react-query";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ReactQueryProvider
      client={queryClient}
      dehydratedState={pageProps.dehydratedState}
    >
      <ClusterProvider>
        <SolanaProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SolanaProvider>
      </ClusterProvider>
    </ReactQueryProvider>
  );
}

// features/cluster/components/ClusterChecker.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { ReactNode } from "react";
import { useCluster } from "../hooks/useCluster";
import { useConnection } from "@solana/wallet-adapter-react";

export function ClusterChecker({ children }: { children: ReactNode }) {
  const { cluster } = useCluster();
  const { connection } = useConnection();

  const query = useQuery({
    queryKey: ["version", { cluster, endpoint: connection?.rpcEndpoint }],
    queryFn: () => connection?.getVersion(),
    retry: 1,
    enabled: !!connection,
  });

  if (!connection || query.isLoading) {
    return null;
  }

  if (query.isError || !query.data) {
    return (
      <div className="alert alert-warning text-warning-content/80 rounded-none flex justify-center">
        <span>
          Error connecting to cluster <strong>{cluster.name}</strong>
        </span>
        <button
          className="btn btn-xs btn-neutral"
          onClick={() => query.refetch()}
        >
          Refresh
        </button>
      </div>
    );
  }

  return <div>{children}</div>;
}

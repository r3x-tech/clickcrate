// features/account/components/AccountTransactions.tsx
"use client";

import { PublicKey } from "@solana/web3.js";
import { useState, useMemo } from "react";
import { IconRefresh } from "@tabler/icons-react";
import { ExplorerLink } from "@/components/ExplorerLink";
import { ellipsify } from "@/components/Layout";
import { useGetSignatures } from "../hooks/useGetSignatures";

export function AccountTransactions({ address }: { address: PublicKey }) {
  const query = useGetSignatures({ address });
  const [showAll, setShowAll] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);

  const items = useMemo(() => {
    if (showAll) return query.data;
    return query.data?.slice(0, 5);
  }, [query.data, showAll]);

  const handleRefetch = async () => {
    setIsRefetching(true);
    await query.refetch();
    setIsRefetching(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <h2 className="font-bold text-xl tracking-wide">Transaction History</h2>
        <div className="space-x-2">
          {query.isLoading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <button
              className="btn btn-sm btn-ghost border-none bg-transparent hover:bg-transparent text-white hover:text-white"
              onClick={handleRefetch}
              disabled={isRefetching}
            >
              <IconRefresh
                size={21}
                className={`refresh-icon ${
                  isRefetching ? "animate-spin-counterclockwise" : ""
                }`}
              />
            </button>
          )}
        </div>
      </div>
      {query.isError && (
        <pre className="alert alert-error">
          Error: {query.error?.message.toString()}
        </pre>
      )}
      {query.isSuccess && (
        <div>
          {query.data.length === 0 ? (
            <div>No transactions found.</div>
          ) : (
            <table className="table border-2 rounded-lg border-separate border-white bg-background">
              <thead>
                <tr className="text-white">
                  <th>Signature</th>
                  <th className="text-right">Slot</th>
                  <th>Block Time</th>
                  <th className="text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {items?.map((item) => (
                  <tr key={item.signature}>
                    <th className="font-mono">
                      <ExplorerLink
                        path={`tx/${item.signature}`}
                        label={ellipsify(item.signature, 8)}
                      />
                    </th>
                    <td className="font-mono text-right">
                      <ExplorerLink
                        path={`block/${item.slot}`}
                        label={item.slot.toString()}
                      />
                    </td>
                    <td>
                      {new Date((item.blockTime ?? 0) * 1000).toISOString()}
                    </td>
                    <td className="text-right">
                      {item.err ? (
                        <div
                          className="badge badge-error"
                          title={JSON.stringify(item.err)}
                        >
                          Failed
                        </div>
                      ) : (
                        <div className="badge badge-success">Success</div>
                      )}
                    </td>
                  </tr>
                ))}
                {(query.data?.length ?? 0) > 5 && (
                  <tr>
                    <td colSpan={4} className="text-center">
                      <button
                        className="btn btn-xs btn-solid border-none bg-tertiary text-white hover:bg-tertiary"
                        onClick={() => setShowAll(!showAll)}
                      >
                        {showAll ? "Show Less" : "Show All"}
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

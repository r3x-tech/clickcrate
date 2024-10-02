// features/account/components/AccountBalance.tsx
"use client";

import { PublicKey } from "@solana/web3.js";
import { useGetBalance } from "../hooks/useGetBalance";
import { BalanceSol } from "./BalanceSol";

export function AccountBalance({ address }: { address: PublicKey }) {
  const query = useGetBalance({ address });

  return (
    <div>
      <h1
        className="text-5xl font-bold cursor-pointer pt-24"
        onClick={() => query.refetch()}
      >
        {query.data ? <BalanceSol balance={query.data} /> : "..."} SOL
      </h1>
    </div>
  );
}

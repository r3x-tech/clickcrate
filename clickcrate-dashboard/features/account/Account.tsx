// features/account/components/AccountDetailFeature.tsx
"use client";

import { PublicKey } from "@solana/web3.js";
import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { AccountBalance } from "./components/AccountBalance";
import { AppHero, ellipsify } from "@/components/Layout";
import { ExplorerLink } from "@/components/ExplorerLink";
import { AccountButtons } from "./components/AccountButtons";
import { AccountTokens } from "./components/AccountTokens";
import { AccountTransactions } from "./components/AccountTransactions";

export default function AccountFeature() {
  const params = useParams();
  const address = useMemo(() => {
    if (!params.address) {
      return;
    }
    try {
      return new PublicKey(params.address as string);
    } catch (e) {
      console.log(`Invalid public key`, e);
    }
  }, [params]);

  if (!address) {
    return <div>Error loading account</div>;
  }

  return (
    <div>
      <AppHero
        title={<AccountBalance address={address} />}
        subtitle={
          <div className="my-4">
            Solana Wallet Address:{" "}
            <ExplorerLink
              path={`account/${address}`}
              label={ellipsify(address.toString())}
            />
          </div>
        }
      >
        <div className="my-4">
          <AccountButtons address={address} />
        </div>
      </AppHero>
      <div className="space-y-8 pb-10">
        <AccountTokens address={address} />
        <AccountTransactions address={address} />
      </div>
    </div>
  );
}

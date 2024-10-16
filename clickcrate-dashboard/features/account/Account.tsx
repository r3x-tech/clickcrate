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
import { useWallet } from "@solana/wallet-adapter-react";

export default function AccountFeature() {
  const params = useParams();

  const { publicKey } = useWallet();
  // const address = useMemo(() => {
  //   if (!params.address) {
  //     return;
  //   }
  //   try {
  //     return new PublicKey(params.address as string);
  //   } catch (e) {
  //     console.log(`Invalid public key`, e);
  //   }
  // }, [params]);

  if (!publicKey) {
    return (
      <div className="flex items-center justify-start w-[100vw]">
        {" "}
        <p className="text-sm font-normal "> Failed to load account info</p>
      </div>
    );
  }

  return (
    <div>
      <AppHero
        title={<AccountBalance address={publicKey} />}
        subtitle={
          <div className="my-4">
            Solana Wallet Address:{" "}
            <ExplorerLink
              path={`account/${publicKey}`}
              label={ellipsify(publicKey.toString())}
            />
          </div>
        }
      >
        <div className="my-4">
          <AccountButtons address={publicKey} />
        </div>
      </AppHero>
      <div className="space-y-8 pb-10">
        <AccountTokens address={publicKey} />
        <AccountTransactions address={publicKey} />
      </div>
    </div>
  );
}

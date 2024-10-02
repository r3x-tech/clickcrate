// hooks/useOwnedProductListings.ts
import { useQuery } from "@tanstack/react-query";
import { clickcrateApi } from "@/services/clickcrateApi";
import { PublicKey } from "@solana/web3.js";

export function useOwnedClickcrates(owner: PublicKey) {
  return useQuery({
    queryKey: ["ownedClickcrates", owner.toString()],
    queryFn: () => clickcrateApi.fetchOwnedClickCrates(owner),
  });
}

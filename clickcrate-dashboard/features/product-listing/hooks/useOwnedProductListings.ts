import { useQuery } from "@tanstack/react-query";
import { clickcrateApi } from "@/services/clickcrateApi";
import { PublicKey } from "@solana/web3.js";

export function useOwnedProductListings(owner: PublicKey) {
  return useQuery(["ownedProductListings", owner.toString()], () =>
    clickcrateApi.fetchOwnedProductListings(owner)
  );
}

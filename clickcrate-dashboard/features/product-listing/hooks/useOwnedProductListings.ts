import { useQuery } from "@tanstack/react-query";
import { clickcrateApi } from "@/services/clickcrateApi";
import { PublicKey } from "@solana/web3.js";
import { ProductListing, ProductListingResponse } from "@/types";

export function useOwnedProductListings(owner: PublicKey | null) {
  return useQuery<ProductListing[], Error>({
    queryKey: ["ownedProductListings", owner?.toString()],
    queryFn: async () => {
      if (!owner) {
        return [];
      }
      const response = await clickcrateApi.fetchOwnedProductListings(owner);
      const data = response.data as ProductListingResponse;
      return data.productListings;
    },
    enabled: !!owner,
  });
}

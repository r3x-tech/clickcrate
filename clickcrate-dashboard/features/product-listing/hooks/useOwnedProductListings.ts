import { useQuery } from "@tanstack/react-query";
import { clickcrateApi } from "@/services/clickcrateApi";
import { ProductListing, ProductListingResponse } from "@/types";
import axios from "axios";

export function useOwnedProductListings(
  owner: string | null,
  walletAddress: string | null
) {
  return useQuery<ProductListing[], Error>({
    queryKey: ["ownedProductListings", owner, walletAddress],
    queryFn: async () => {
      if (!owner) {
        console.error("Owner is null");
        return [];
      }
      if (!walletAddress) {
        console.error("Wallet not connected");
        return [];
      }
      try {
        const response = await clickcrateApi.fetchOwnedProductListings(
          owner,
          walletAddress
        );
        const data = response.data as ProductListingResponse;
        return data.productListings;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          console.error("Unauthorized request");
        } else {
          console.error("Error fetching owned product listings:", error);
        }
        return [];
      }
    },
    enabled: !!owner && !!walletAddress,
  });
}

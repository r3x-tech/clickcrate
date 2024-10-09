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
        console.log("Fetching owned product listings for:", owner);
        const response = await clickcrateApi.fetchOwnedProductListings(
          owner,
          walletAddress
        );
        console.log("Response received:", response);
        const data = response.data as ProductListingResponse;
        return data.productListings;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Axios error:", error.message);
          console.error("Error response:", error.response?.data);
          if (error.response?.status === 401) {
            console.error("Unauthorized request");
          } else if (error.response?.status === 400) {
            console.error("Bad request:", error.response.data);
          }
        } else {
          console.error("Error fetching owned product listings:", error);
        }
        throw error;
      }
    },
    enabled: !!owner && !!walletAddress,
  });
}

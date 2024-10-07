import { useQuery } from "@tanstack/react-query";
import { clickcrateApi } from "@/services/clickcrateApi";

export const useProductListingDetails = (
  productListingId: string,
  walletAddress: string | null
) => {
  return useQuery({
    queryKey: ["productListingDetails", productListingId],
    queryFn: async () => {
      if (!walletAddress) {
        throw new Error("Wallet not connected");
      }
      const response = await clickcrateApi.fetchProductListingDetails(
        productListingId,
        walletAddress
      );
      return response.data;
    },
    enabled: !!walletAddress && !!productListingId,
  });
};

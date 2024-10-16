import { useQuery } from "@tanstack/react-query";
import { clickcrateApi } from "@/services/clickcrateApi";
import { useCluster } from "@/features/cluster/hooks/useCluster";
import { getNetwork } from "@/utils/conversions";

export const useProductListingDetails = (
  productListingId: string,
  walletAddress: string | null
) => {
  const { cluster } = useCluster();
  const network = getNetwork(cluster);

  return useQuery({
    queryKey: ["productListingDetails", productListingId],
    queryFn: async () => {
      if (!walletAddress) {
        throw new Error("Wallet not connected");
      }
      const response = await clickcrateApi.fetchProductListingDetails(
        productListingId,
        walletAddress,
        network
      );
      return response.data;
    },
    enabled: !!walletAddress && !!productListingId,
  });
};

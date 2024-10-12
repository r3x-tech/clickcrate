import { useQuery } from "@tanstack/react-query";
import { clickcrateApi } from "@/services/clickcrateApi";
import { getNetwork } from "@/utils/conversions";
import { useCluster } from "@/features/cluster/hooks/useCluster";

export const useProductDetails = (
  productId: string,
  walletAddress: string | null
) => {
  const { cluster } = useCluster();
  const network = getNetwork(cluster);

  return useQuery({
    queryKey: ["productDetails", productId],
    queryFn: async () => {
      if (!walletAddress) {
        throw new Error("Wallet not connected");
      }
      const response = await clickcrateApi.fetchProductDetails(
        productId,
        walletAddress,
        network
      );
      return response.data;
    },
    enabled: !!walletAddress && !!productId,
  });
};

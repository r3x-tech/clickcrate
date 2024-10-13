import { useQuery } from "@tanstack/react-query";
import { clickcrateApi } from "@/services/clickcrateApi";
import { PublicKey } from "@solana/web3.js";
import { DetailedClickCrateState } from "@/types";
import { useCluster } from "@/features/cluster/hooks/useCluster";
import { getNetwork } from "@/utils/conversions";

export const useClickcrateDetails = (
  clickcrateId: PublicKey,
  walletAddress: string | null
) => {
  const { cluster } = useCluster();
  const network = getNetwork(cluster);

  return useQuery<DetailedClickCrateState, Error>({
    queryKey: ["clickcrateDetails", clickcrateId.toString()],
    queryFn: async () => {
      if (!walletAddress) {
        throw new Error("Wallet not connected");
      }
      const response = await clickcrateApi.fetchClickCrateDetails(
        clickcrateId.toString(),
        walletAddress,
        network
      );
      return response.data;
    },
    enabled: !!walletAddress && !!clickcrateId,
  });
};

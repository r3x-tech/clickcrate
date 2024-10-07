import { useQuery } from "@tanstack/react-query";
import { clickcrateApi } from "@/services/clickcrateApi";
import { PublicKey } from "@solana/web3.js";
import { DetailedClickCrateState } from "@/types";

export const useClickcrateDetails = (
  clickcrateId: PublicKey,
  walletAddress: string | null
) => {
  return useQuery<DetailedClickCrateState, Error>({
    queryKey: ["clickcrateDetails", clickcrateId.toString()],
    queryFn: async () => {
      if (!walletAddress) {
        throw new Error("Wallet not connected");
      }
      const response = await clickcrateApi.fetchClickCrateDetails(
        clickcrateId.toString(),
        walletAddress
      );
      return response.data;
    },
    enabled: !!walletAddress && !!clickcrateId,
  });
};

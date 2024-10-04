import { clickcrateApi } from "@/services/clickcrateApi";
import { Order } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useClickcrateOrders(
  creatorId: string | null,
  walletAddress: string | null
) {
  return useQuery<Order[], Error>({
    queryKey: ["clickcrate-orders", creatorId, walletAddress],
    queryFn: async () => {
      if (!creatorId) {
        throw new Error("Creator id is null");
      }
      if (!walletAddress) {
        throw new Error("Wallet not connected");
      }
      try {
        const response = await clickcrateApi.getAllNativeOrders(
          creatorId,
          walletAddress
        );
        return response.data.orders;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          console.error("Unauthorized request");
        } else {
          console.error("Error fetching ClickCrate orders:", error);
        }
        throw error;
      }
    },
    enabled: !!creatorId && !!walletAddress,
  });
}

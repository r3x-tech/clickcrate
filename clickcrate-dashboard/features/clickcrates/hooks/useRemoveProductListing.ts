import { useMutation } from "@tanstack/react-query";
import { clickcrateApi } from "@/services/clickcrateApi";
import axios from "axios";

export type RemoveProductListingData = {
  productListingId: string;
  clickcrateId: string;
};

export const useRemoveProductListing = (walletAddress: string | null) => {
  return useMutation({
    mutationFn: async (data: RemoveProductListingData) => {
      if (!walletAddress) {
        throw new Error("Wallet not connected");
      }
      try {
        const response = await clickcrateApi.removeProductListing(
          data,
          walletAddress
        );
        if (response.data && response.data.transaction) {
          // Handle transaction if needed
          return response.data.message;
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          console.error("Unauthorized request");
        } else {
          console.error("Error removing product listing:", error);
        }
        throw error;
      }
    },
  });
};

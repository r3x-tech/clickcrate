import { useMutation } from "@tanstack/react-query";
import { clickcrateApi } from "@/services/clickcrateApi";
import {
  ClickcrateCreationData,
  CreateClickcrateData,
  PlacementType,
  ProductCategory,
} from "@/types";
import { PublicKey } from "@solana/web3.js";
import axios from "axios";

export const useCreateClickcrate = (walletAddress: string | null) => {
  return useMutation({
    mutationFn: async (data: CreateClickcrateData) => {
      if (!walletAddress) {
        throw new Error("Wallet not connected");
      }
      try {
        const response = await clickcrateApi.createClickcrate(
          data,
          walletAddress
        );
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          throw new Error("Unauthorized request");
        } else {
          console.error("Error creating clickcrate:", error);
          throw new Error("Failed to create clickcrate");
        }
      }
    },
  });
};

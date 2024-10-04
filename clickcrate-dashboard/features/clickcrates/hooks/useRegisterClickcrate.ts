import { useMutation } from "@tanstack/react-query";
import { clickcrateApi } from "@/services/clickcrateApi";
import { PlacementType, ProductCategory } from "@/types";
import { PublicKey, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";

export type ClickcrateRegistrationData = {
  clickcrateId: string;
  eligiblePlacementType: PlacementType;
  eligibleProductCategory: ProductCategory;
  manager: string;
};

export const useRegisterClickcrate = (walletAddress: string | null) => {
  return useMutation({
    mutationFn: async (data: ClickcrateRegistrationData) => {
      if (!walletAddress) {
        throw new Error("Wallet not connected");
      }
      try {
        const response = await clickcrateApi.registerClickcrate(
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
          console.error("Error registering ClickCrate:", error);
        }
        throw error;
      }
    },
  });
};

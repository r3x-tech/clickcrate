import { useMutation } from "@tanstack/react-query";
import { clickcrateApi } from "@/services/clickcrateApi";
import { PlacementType, ProductCategory } from "@/types";
import { Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { signAndSendTransaction } from "@/services/solanaService";

export type ClickcrateUpdateData = {
  clickcrateId: string;
  eligiblePlacementType: PlacementType;
  eligibleProductCategory: ProductCategory;
  manager: string;
};

export const useUpdateClickcrate = () => {
  const { connection } = useConnection();
  const wallet = useWallet();

  return useMutation({
    mutationFn: async (data: ClickcrateUpdateData) => {
      if (!wallet.publicKey) {
        throw new Error("Wallet not connected");
      }
      try {
        const response = await clickcrateApi.updateClickcrate(
          data,
          wallet.publicKey.toString()
        );
        if (response.data && response.data.transaction) {
          const transaction = Transaction.from(
            Buffer.from(response.data.transaction, "base64")
          );
          const signature = await signAndSendTransaction(
            transaction,
            connection,
            wallet
          );
          return { message: response.data.message, signature };
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          console.error("Unauthorized request");
        } else {
          console.error("Error updating ClickCrate:", error);
        }
        throw error;
      }
    },
  });
};

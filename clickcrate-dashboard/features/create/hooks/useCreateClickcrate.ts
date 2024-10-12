import { useMutation } from "@tanstack/react-query";
import { clickcrateApi } from "@/services/clickcrateApi";
import { CreateClickcrateData } from "@/types";
import { VersionedTransaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { signAndSendVersionedTransaction } from "@/services/solanaService";
import axios from "axios";

export const useCreateClickcrate = () => {
  const { connection } = useConnection();
  const wallet = useWallet();

  const mutation = useMutation({
    mutationFn: async (data: CreateClickcrateData) => {
      if (!wallet.publicKey) {
        throw new Error("Wallet not connected");
      }
      try {
        const response = await clickcrateApi.createClickcrate(
          data,
          wallet.publicKey.toString()
        );
        if (response.data && response.data.transaction) {
          const transactionBuffer = Buffer.from(
            response.data.transaction,
            "base64"
          );
          const deserializedTx =
            VersionedTransaction.deserialize(transactionBuffer);
          const signature = await signAndSendVersionedTransaction(
            deserializedTx,
            connection,
            wallet
          );
          return {
            message: response.data.message,
            clickcrateId: response.data.clickcrateId,
            signature,
          };
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (error) {
        console.error("Error creating ClickCrate:", error);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            throw new Error("Unauthorized request");
          } else {
            throw new Error(`Error creating ClickCrate: ${error.message}`);
          }
        } else {
          throw new Error(
            "An unexpected error occurred while creating ClickCrate"
          );
        }
      }
    },
  });

  return {
    createClickcrate: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};

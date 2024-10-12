import { useMutation } from "@tanstack/react-query";
import { clickcrateApi } from "@/services/clickcrateApi";
import { CreateProductData } from "@/types";
import { VersionedTransaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { signAndSendVersionedTransaction } from "@/services/solanaService";
import axios from "axios";

export const useCreateProduct = () => {
  const { connection } = useConnection();
  const wallet = useWallet();

  const mutation = useMutation({
    mutationFn: async (data: CreateProductData) => {
      if (!wallet.publicKey) {
        throw new Error("Wallet not connected");
      }
      try {
        const response = await clickcrateApi.createProduct(
          data,
          wallet.publicKey.toString()
        );
        if (response.data && response.data.transactions) {
          const signatures = [];
          for (const transactionBase64 of response.data.transactions) {
            const transactionBuffer = Buffer.from(transactionBase64, "base64");
            const deserializedTx =
              VersionedTransaction.deserialize(transactionBuffer);
            const signature = await signAndSendVersionedTransaction(
              deserializedTx,
              connection,
              wallet
            );
            signatures.push(signature);
          }
          return {
            message: response.data.message,
            listingId: response.data.listingId,
            productIds: response.data.productIds,
            signatures,
          };
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (error) {
        console.error("Error creating product:", error);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            throw new Error("Unauthorized request");
          } else {
            throw new Error(`Error creating product: ${error.message}`);
          }
        } else {
          throw new Error(
            "An unexpected error occurred while creating product"
          );
        }
      }
    },
  });

  return {
    createProduct: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};

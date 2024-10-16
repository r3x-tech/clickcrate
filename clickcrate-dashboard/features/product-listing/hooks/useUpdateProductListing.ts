import { useMutation } from "@tanstack/react-query";
import { clickcrateApi } from "@/services/clickcrateApi";
import { PlacementType, ProductCategory } from "@/types";
import { VersionedTransaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { signAndSendVersionedTransaction } from "@/services/solanaService";

export type ProductListingUpdateData = {
  productListingId: string;
  placementType: PlacementType;
  productCategory: ProductCategory;
  manager: string;
  price: number;
};

export const useUpdateProductListing = () => {
  const { connection } = useConnection();
  const wallet = useWallet();

  return useMutation({
    mutationFn: async (data: ProductListingUpdateData) => {
      if (!wallet.publicKey) {
        throw new Error("Wallet not connected");
      }
      try {
        const response = await clickcrateApi.updateProductListing(
          {
            ...data,
            price: Math.floor(data.price),
          },
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
          return { message: response.data.message, signature };
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (error) {
        console.error("Error updating Product Listing:", error);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            console.error(
              "Unauthorized request. Please check your credentials."
            );
          } else if (error.response?.status === 404) {
            console.error(
              "API endpoint not found. Please check the API configuration."
            );
          } else {
            console.error(`Error updating Product Listing: ${error.message}`);
          }
        } else {
          console.error(
            "An unexpected error occurred while updating Product Listing"
          );
        }
        throw error;
      }
    },
  });
};

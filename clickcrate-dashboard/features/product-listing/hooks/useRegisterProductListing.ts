import { useMutation } from "@tanstack/react-query";
import { clickcrateApi } from "@/services/clickcrateApi";
import { Origin, PlacementType, ProductCategory } from "@/types";
import { VersionedTransaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { signAndSendVersionedTransaction } from "@/services/solanaService";

export type ProductListingRegistrationData = {
  productListingId: string;
  origin: Origin;
  placementType: PlacementType;
  productCategory: ProductCategory;
  manager: string;
  price: number;
  orderManager: Origin;
};

export const useRegisterProductListing = () => {
  const { connection } = useConnection();
  const wallet = useWallet();

  return useMutation({
    mutationFn: async (data: ProductListingRegistrationData) => {
      if (!wallet.publicKey) {
        throw new Error("Wallet not connected");
      }
      try {
        const response = await clickcrateApi.registerProductListing(
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

          // Log deserialized transaction details
          console.log("Deserialized transaction:", {
            version: deserializedTx.version,
            numSignatures: deserializedTx.signatures.length,
            messageSize: deserializedTx.message.serialize().length,
          });

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
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            console.error("Unauthorized request");
          } else {
            console.error(
              `Error registering Product Listing: ${error.message}`
            );
          }
        } else {
          console.error(
            "An unexpected error occurred while registering Product Listing:",
            error
          );
        }
        throw error;
      }
    },
  });
};

// export const useRegisterProductListing = () => {
//   const { connection } = useConnection();
//   const wallet = useWallet();

//   return useMutation({
//     mutationFn: async (data: ProductListingRegistrationData) => {
//       if (!wallet.publicKey) {
//         throw new Error("Wallet not connected");
//       }
//       try {
//         const response = await clickcrateApi.registerProductListing(
//           data,
//           wallet.publicKey.toString()
//         );
//         if (response.data && response.data.transaction) {
//           const transactionBuffer = Buffer.from(
//             response.data.transaction,
//             "base64"
//           );
//           const deserializedTx =
//             VersionedTransaction.deserialize(transactionBuffer);
//           const signature = await signAndSendVersionedTransaction(
//             deserializedTx,
//             connection,
//             wallet
//           );
//           return { message: response.data.message, signature };
//         } else {
//           throw new Error("Invalid response from server");
//         }
//       } catch (error) {
//         if (axios.isAxiosError(error)) {
//           if (error.response?.status === 401) {
//             console.error("Unauthorized request");
//           } else {
//             console.error(
//               `Error registering Product Listing: ${error.message}`
//             );
//           }
//         } else {
//           console.error(
//             "An unexpected error occurred while registering Product Listing"
//           );
//         }
//         throw error;
//       }
//     },
//   });
// };

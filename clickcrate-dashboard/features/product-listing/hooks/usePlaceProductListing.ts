import { useMutation } from "@tanstack/react-query";
import { clickcrateApi } from "@/services/clickcrateApi";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { signAndSendVersionedTransaction } from "@/services/solanaService";
import { VersionedTransaction } from "@solana/web3.js";

export type ProductListingPlaceData = {
  productListingId: string;
  clickcrateId: string;
  price: number;
};

export const usePlaceProductListing = () => {
  const { connection } = useConnection();
  const wallet = useWallet();

  return useMutation({
    mutationFn: async (data: ProductListingPlaceData) => {
      if (!wallet.publicKey) {
        throw new Error("Wallet not connected");
      }
      try {
        console.log("Initializing oracles...");
        const initializeOraclesResponse = await clickcrateApi.initializeOracles(
          data.productListingId,
          wallet.publicKey.toString()
        );
        console.log(
          "Oracle initialization response received: ",
          initializeOraclesResponse
        );

        if (
          initializeOraclesResponse.data &&
          initializeOraclesResponse.data.transactions
        ) {
          console.log(
            `Received ${initializeOraclesResponse.data.transactions.length} oracle transactions`
          );
          for (
            let i = 0;
            i < initializeOraclesResponse.data.transactions.length;
            i++
          ) {
            const transactionBase64 =
              initializeOraclesResponse.data.transactions[i];
            console.log(`Processing oracle transaction ${i + 1}...`);
            try {
              const transactionBuffer = Buffer.from(
                transactionBase64,
                "base64"
              );
              const deserializedTx =
                VersionedTransaction.deserialize(transactionBuffer);
              console.log("deserializedTx details:", {
                version: deserializedTx.version,
                message: deserializedTx.message,
                signatures: deserializedTx.signatures,
              });
              try {
                const signature = await signAndSendVersionedTransaction(
                  deserializedTx,
                  connection,
                  wallet
                );
                console.log(`Oracle tx ${i + 1} signed and sent: ${signature}`);
              } catch (txError) {
                console.error(
                  `Error processing oracle transaction ${i + 1}:`,
                  txError
                );
                continue;
              }
              await new Promise((resolve) => setTimeout(resolve, 1000));
            } catch (txError) {
              console.error(
                `Error processing oracle transaction ${i + 1}:`,
                txError
              );
              throw txError;
            }
          }
        } else {
          console.warn("No transactions received from initializeOracles");
        }

        console.log("All oracle txs processed");
        console.log("Waiting 20 seconds...");
        await new Promise((resolve) => setTimeout(resolve, 20000));
        console.log("Wait complete");

        console.log("Placing product listing...");
        const placeProductListingResponse =
          await clickcrateApi.placeProductListing(
            {
              ...data,
              price: Math.floor(data.price),
            },
            wallet.publicKey.toString()
          );
        console.log("Product listing placement response received");

        if (
          placeProductListingResponse.data &&
          placeProductListingResponse.data.transactions
        ) {
          console.log(
            `Received ${placeProductListingResponse.data.transactions.length} placement transactions`
          );
          let firstSignature = null;
          for (
            let i = 0;
            i < placeProductListingResponse.data.transactions.length;
            i++
          ) {
            const transactionBase64 =
              placeProductListingResponse.data.transactions[i];
            console.log(`Processing placement transaction ${i + 1}...`);
            try {
              const transactionBuffer = Buffer.from(
                transactionBase64,
                "base64"
              );

              const deserializedTx =
                VersionedTransaction.deserialize(transactionBuffer);
              console.log("Placement transaction deserialized details:", {
                version: deserializedTx.version,
                message: deserializedTx.message,
                signatures: deserializedTx.signatures,
              });
              const signature = await signAndSendVersionedTransaction(
                deserializedTx,
                connection,
                wallet
              );
              if (i === 0) firstSignature = signature;
              console.log(
                `Placement tx ${i + 1} signed and sent: ${signature}`
              );
            } catch (txError) {
              console.error(
                `Error processing placement transaction ${i + 1}:`,
                txError
              );

              throw txError;
            }
          }
          return {
            message: placeProductListingResponse.data.message,
            placementSignature: firstSignature,
          };
        } else {
          throw new Error(
            "Invalid response from server for product listing placement"
          );
        }
      } catch (error) {
        console.error("Error in usePlaceProductListing:", error);
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
            console.error(`Error placing Product Listing: ${error.message}`);
            console.error("Full error object:", error);
          }
        } else {
          console.error(
            "An unexpected error occurred while placing Product Listing"
          );
          console.error("Full error object:", error);
        }
        throw error;
      }
    },
  });
};

import { useMutation } from "@tanstack/react-query";
import { clickcrateApi } from "@/services/clickcrateApi";
import { PlacementType, ProductCategory } from "@/types";
import { PublicKey, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

export type ClickcrateRegistrationData = {
  clickcrateId: PublicKey;
  eligiblePlacementType: PlacementType;
  eligibleProductCategory: ProductCategory;
  manager: PublicKey;
};

export const useRegisterClickcrate = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  return useMutation({
    mutationFn: async (data: ClickcrateRegistrationData) => {
      if (!publicKey) {
        throw new Error("Wallet not connected");
      }

      const response = await clickcrateApi.registerClickcrate(data);

      if (response.data && response.data.transaction) {
        const transaction = Transaction.from(
          Buffer.from(response.data.transaction, "base64")
        );
        const signature = await sendTransaction(transaction, connection);
        await connection.confirmTransaction(signature, "confirmed");
        return response.data.message;
      } else {
        throw new Error("Invalid response from server");
      }
    },
    onError: (error) => {
      console.error("Error registering ClickCrate:", error);
    },
  });
};

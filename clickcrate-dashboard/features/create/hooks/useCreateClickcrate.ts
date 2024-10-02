import { useMutation } from "@tanstack/react-query";
import { clickcrateApi } from "@/services/clickcrateApi";
import { PlacementType, ProductCategory } from "@/types";
import { PublicKey } from "@solana/web3.js";

export type ClickcrateCreationData = {
  name: string;
  description: string;
  eligiblePlacementType: PlacementType;
  eligibleProductCategory: ProductCategory;
  manager: PublicKey;
};

export const useCreateClickcrate = () => {
  return useMutation({
    mutationFn: (data: ClickcrateCreationData) =>
      clickcrateApi.createClickcrate(data),
    onError: (error) => {
      console.error("Error creating clickcrate:", error);
    },
  });
};

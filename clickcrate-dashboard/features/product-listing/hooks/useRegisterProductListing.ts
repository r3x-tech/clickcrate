import { useMutation } from "@tanstack/react-query";
import { clickcrateApi } from "@/services/clickcrateApi";
import { Origin, PlacementType, ProductCategory } from "@/types";
import { PublicKey } from "@solana/web3.js";

export type ProductListingRegistrationData = {
  productListingId: PublicKey;
  origin: Origin;
  eligiblePlacementType: PlacementType;
  eligibleProductCategory: ProductCategory;
  manager: PublicKey;
  price: number;
  orderManager: Origin;
};

export const useRegisterProductListing = () => {
  return useMutation({
    mutationFn: (data: ProductListingRegistrationData) =>
      clickcrateApi.registerProductListing(data),
    onError: (error) => {
      console.error("Error registering Product Listing:", error);
    },
  });
};

import { useMutation } from "@tanstack/react-query";
import { clickcrateApi } from "@/services/clickcrateApi";
import { Origin, PlacementType, ProductCategory } from "@/types";
import axios from "axios";

export type ProductListingRegistrationData = {
  productListingId: string;
  origin: Origin;
  eligiblePlacementType: PlacementType;
  eligibleProductCategory: ProductCategory;
  manager: string;
  price: number;
  orderManager: Origin;
};

export const useRegisterProductListing = (walletAddress: string | null) => {
  return useMutation({
    mutationFn: async (data: ProductListingRegistrationData) => {
      if (!walletAddress) {
        throw new Error("Wallet not connected");
      }
      try {
        const response = await clickcrateApi.registerProductListing(
          data,
          walletAddress
        );
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          console.error("Unauthorized request");
        } else {
          console.error("Error registering Product Listing:", error);
        }
        throw error;
      }
    },
  });
};

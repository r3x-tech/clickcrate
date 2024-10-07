import { useMutation } from "@tanstack/react-query";
import { clickcrateApi } from "@/services/clickcrateApi";
import {
  OrderManager,
  PlacementType,
  ProductCategory,
  ProductCreationData,
} from "@/types";
import axios from "axios";

export const useCreateProduct = (walletAddress: string | null) => {
  return useMutation({
    mutationFn: async (data: ProductCreationData) => {
      if (!walletAddress) {
        throw new Error("Wallet not connected");
      }
      try {
        const response = await clickcrateApi.createProduct(data, walletAddress);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          throw new Error("Unauthorized request");
        } else {
          console.error("Error creating product:", error);
          throw new Error("Failed to create product");
        }
      }
    },
  });
};

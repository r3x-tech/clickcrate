import { useMutation } from "@tanstack/react-query";
import { clickcrateApi } from "@/services/clickcrateApi";
import { PlacementType, ProductCategory } from "@/types";
import { PublicKey } from "@solana/web3.js";

export type ProductCreationData = {
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  currency: "SOL" | "USDC";
  orderManager: OrderManager;
  email: string;
  placementType: PlacementType;
  productCategory: ProductCategory;
};

export type OrderManager = "ClickCrate" | "Shopify" | "Square";

export const useCreateProduct = () => {
  return useMutation({
    mutationFn: (data: ProductCreationData) =>
      clickcrateApi.createProduct(data),
    onError: (error) => {
      console.error("Error creating product:", error);
    },
  });
};

import { useMutation } from "@tanstack/react-query";
import { clickcrateApi } from "@/services/clickcrateApi";
import { OrderManager, PlacementType, ProductCategory } from "@/types";

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

export const useCreateProduct = () => {
  return useMutation({
    mutationFn: (data: ProductCreationData) =>
      clickcrateApi.createProduct(data),
    onError: (error) => {
      console.error("Error creating product:", error);
    },
  });
};

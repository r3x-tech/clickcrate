import { clickcrateApi } from "./clickcrateApi";
import { metaplexService } from "./metaplexService";
import { ProductCreationData } from "@/hooks/useCreateProduct";

export const createService = {
  async createProduct(data: ProductCreationData) {
    // Depending on the data, you might want to call different services
    // For now, we'll just call the clickcrateApi
    return await clickcrateApi.createProduct(data);
  },

  async createClickcrate(data: ClickcrateCreationData) {
    // Depending on the data, you might want to call different services
    // For now, we'll just call the clickcrateApi
    return await clickcrateApi.createClickcrate(data);
  },
};

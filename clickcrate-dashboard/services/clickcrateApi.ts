import axios from "axios";
import { PublicKey } from "@solana/web3.js";
import {
  PlacementType,
  ProductCategory,
  Origin,
  OrderManager,
  ShopifyCredentials,
  SquareCredentials,
} from "../types";
const API_BASE_URL = process.env.NEXT_PUBLIC_CLICKCRATE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Helper function to set the Authorization header
const setAuthHeader = (apiKey: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${apiKey}`;
};

export const clickcrateApi = {
  // ClickCrate endpoints
  fetchOwnedClickCrates: (owner: PublicKey) =>
    api.post("/v1/clickcrate/owned-clickrates", { owner: owner.toString() }),

  fetchRegisteredClickcrate: (clickcrateId: PublicKey) =>
    api.post("/v1/clickcrate/registered", {
      clickcrateId: clickcrateId.toString(),
    }),

  fetchClickCrateDetails: (clickcrateId: PublicKey) =>
    api.post("/v1/clickcrate/details", {
      clickcrateId: clickcrateId.toString(),
    }),

  registerClickcrate: (data: {
    clickcrateId: PublicKey;
    eligiblePlacementType: PlacementType;
    eligibleProductCategory: ProductCategory;
    manager: PublicKey;
  }) =>
    api.post("/v1/clickcrate/register", {
      ...data,
      clickcrateId: data.clickcrateId.toString(),
      manager: data.manager.toString(),
    }),

  updateClickcrate: (data: {
    clickcrateId: PublicKey;
    eligiblePlacementType: PlacementType;
    eligibleProductCategory: ProductCategory;
    manager: PublicKey;
  }) =>
    api.put("/v1/clickcrate/update", {
      ...data,
      clickcrateId: data.clickcrateId.toString(),
      manager: data.manager.toString(),
    }),

  activateClickcrate: (clickcrateId: PublicKey) =>
    api.post("/v1/clickcrate/activate", {
      clickcrateId: clickcrateId.toString(),
    }),

  deactivateClickcrate: (clickcrateId: PublicKey) =>
    api.post("/v1/clickcrate/deactivate", {
      clickcrateId: clickcrateId.toString(),
    }),

  // Product Listing endpoints
  fetchOwnedProductListings: (owner: PublicKey) =>
    api.post("/v1/product-listing/owned-listings", { owner: owner.toString() }),

  fetchRegisteredProductListing: (productListingId: PublicKey) =>
    api.post("/v1/product-listing/registered", {
      productListingId: productListingId.toString(),
    }),

  fetchProductListingDetails: (productListingId: PublicKey) =>
    api.post("/v1/product-listing/details", {
      productListingId: productListingId.toString(),
    }),

  registerProductListing: (data: {
    productListingId: PublicKey;
    origin: Origin;
    eligiblePlacementType: PlacementType;
    eligibleProductCategory: ProductCategory;
    manager: PublicKey;
    price: number;
    orderManager: OrderManager;
  }) =>
    api.post("/v1/product-listing/register", {
      ...data,
      productListingId: data.productListingId.toString(),
      manager: data.manager.toString(),
    }),

  updateProductListing: (data: {
    productListingId: PublicKey;
    eligiblePlacementType: PlacementType;
    eligibleProductCategory: ProductCategory;
    manager: PublicKey;
    price: number;
  }) =>
    api.put("/v1/product-listing/update", {
      ...data,
      productListingId: data.productListingId.toString(),
      manager: data.manager.toString(),
    }),

  activateProductListing: (productListingId: PublicKey) =>
    api.post("/v1/product-listing/activate", {
      productListingId: productListingId.toString(),
    }),

  deactivateProductListing: (productListingId: PublicKey) =>
    api.post("/v1/product-listing/deactivate", {
      productListingId: productListingId.toString(),
    }),

  placeProductListing: (data: {
    productListingId: PublicKey;
    clickcrateId: PublicKey;
    price: number;
  }) =>
    api.post("/v1/product-listing/place", {
      ...data,
      productListingId: data.productListingId.toString(),
      clickcrateId: data.clickcrateId.toString(),
    }),

  removeProductListing: (data: {
    productListingId: PublicKey;
    clickcrateId: PublicKey;
  }) =>
    api.post("/v1/product-listing/remove", {
      productListingId: data.productListingId.toString(),
      clickcrateId: data.clickcrateId.toString(),
    }),

  // Purchase endpoints
  initiatePurchase: (data: {
    productListingId: PublicKey;
    productId: PublicKey;
    clickcrateId: PublicKey;
    quantity: number;
    buyer: PublicKey;
  }) =>
    api.post("/v1/clickcrate/purchase", {
      ...data,
      productListingId: data.productListingId.toString(),
      productId: data.productId.toString(),
      clickcrateId: data.clickcrateId.toString(),
      buyer: data.buyer.toString(),
    }),

  completePurchase: (data: {
    productListingId: PublicKey;
    productId: PublicKey;
    clickcrateId: PublicKey;
    quantity: number;
    buyer: PublicKey;
    payer: PublicKey;
    paymentProcessor: string;
  }) =>
    api.post("/v1/clickcrate/purchase", {
      ...data,
      productListingId: data.productListingId.toString(),
      productId: data.productId.toString(),
      clickcrateId: data.clickcrateId.toString(),
      buyer: data.buyer.toString(),
      payer: data.payer.toString(),
    }),

  // Order endpoints
  getSquareOrder: (orderId: string) => api.get(`/v1/square/order/${orderId}`),

  getShopifyOrder: (orderId: string) => api.get(`/v1/shopify/order/${orderId}`),

  getAllNativeOrders: (creatorId?: string) =>
    api.get("/v1/clickcrate/orders", { params: { creatorId } }),

  // Credential endpoints
  storeShopifyCredentials: (credentials: ShopifyCredentials) =>
    api.post("/v1/shopify/credentials", credentials),

  storeSquareCredentials: (credentials: SquareCredentials) =>
    api.post("/v1/square/credentials", credentials),

  // Verification endpoints
  initiateVerification: (email: string) =>
    api.post("/v1/initiate-verification", { email }),

  verifyCode: (email: string, code: string) =>
    api.post("/v1/verify-code", { email, code }),

  // Helper function to set the API key
  setApiKey: (apiKey: string) => setAuthHeader(apiKey),
};

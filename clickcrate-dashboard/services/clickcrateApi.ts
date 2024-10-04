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

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((request) => {
  console.log("Starting Request", JSON.stringify(request, null, 2));
  return request;
});

api.interceptors.response.use(
  (response) => {
    console.log("Response:", JSON.stringify(response.data, null, 2));
    return response;
  },
  (error) => {
    console.log(
      "Error Response:",
      JSON.stringify(error.response.data, null, 2)
    );
    return Promise.reject(error);
  }
);
export const clickcrateApi = {
  // ClickCrate endpoints
  fetchOwnedClickCrates: (owner: string, walletAddress: string) =>
    api.post("/clickcrate-proxy", {
      walletAddress,
      endpoint: "/v1/clickcrate/owned-clickrates",
      params: { owner: owner.toString() },
    }),

  fetchRegisteredClickcrate: (clickcrateId: string, walletAddress: string) =>
    api.post("/clickcrate-proxy", {
      walletAddress,
      endpoint: "/v1/clickcrate/registered",
      params: { clickcrateId: clickcrateId.toString() },
    }),

  fetchClickCrateDetails: (clickcrateId: string, walletAddress: string) =>
    api.post("/clickcrate-proxy", {
      walletAddress,
      endpoint: "/v1/clickcrate/details",
      params: { clickcrateId: clickcrateId.toString() },
    }),

  createClickcrate: (
    data: {
      name: string;
      description: string;
      eligiblePlacementType: PlacementType;
      eligibleProductCategory: ProductCategory;
      manager: PublicKey;
    },
    walletAddress: string
  ) =>
    api.post("/clickcrate-proxy", {
      walletAddress,
      endpoint: "/v1/clickcrate/create",
      params: {
        ...data,
        manager: data.manager.toString(),
      },
    }),

  registerClickcrate: (
    data: {
      clickcrateId: string;
      eligiblePlacementType: PlacementType;
      eligibleProductCategory: ProductCategory;
      manager: string;
    },
    walletAddress: string
  ) =>
    api.post("/clickcrate-proxy", {
      walletAddress,
      endpoint: "/v1/clickcrate/register",
      params: {
        ...data,
        clickcrateId: data.clickcrateId.toString(),
        manager: data.manager.toString(),
      },
    }),

  updateClickcrate: (
    data: {
      clickcrateId: string;
      eligiblePlacementType: PlacementType;
      eligibleProductCategory: ProductCategory;
      manager: string;
    },
    walletAddress: string
  ) =>
    api.post("/clickcrate-proxy", {
      walletAddress,
      endpoint: "/v1/clickcrate/update",
      params: {
        ...data,
        clickcrateId: data.clickcrateId.toString(),
        manager: data.manager.toString(),
      },
    }),

  activateClickcrate: (clickcrateId: string, walletAddress: string) =>
    api.post("/clickcrate-proxy", {
      walletAddress,
      endpoint: "/v1/clickcrate/activate",
      params: { clickcrateId: clickcrateId.toString() },
    }),

  deactivateClickcrate: (clickcrateId: string, walletAddress: string) =>
    api.post("/clickcrate-proxy", {
      walletAddress,
      endpoint: "/v1/clickcrate/deactivate",
      params: { clickcrateId: clickcrateId.toString() },
    }),

  // Product Listing endpoints
  fetchOwnedProductListings: (owner: string, walletAddress: string) =>
    api.post("/clickcrate-proxy", {
      walletAddress,
      endpoint: "/v1/product-listing/owned-listings",
      params: { owner: owner.toString() },
    }),

  fetchRegisteredProductListing: (
    productListingId: string,
    walletAddress: string
  ) =>
    api.post("/clickcrate-proxy", {
      walletAddress,
      endpoint: "/v1/product-listing/registered",
      params: { productListingId: productListingId.toString() },
    }),

  fetchProductListingDetails: (
    productListingId: string,
    walletAddress: string
  ) =>
    api.post("/clickcrate-proxy", {
      walletAddress,
      endpoint: "/v1/product-listing/details",
      params: { productListingId: productListingId.toString() },
    }),

  createProduct: (
    data: {
      name: string;
      description: string;
      quantity: number;
      unitPrice: number;
      currency: "SOL" | "USDC";
      orderManager: OrderManager;
      email: string;
      manager: string;
    },
    walletAddress: string
  ) =>
    api.post("/clickcrate-proxy", {
      walletAddress,
      endpoint: "/v1/product/create",
      params: data,
    }),

  registerProductListing: (
    data: {
      productListingId: string;
      origin: Origin;
      eligiblePlacementType: PlacementType;
      eligibleProductCategory: ProductCategory;
      manager: string;
      price: number;
      orderManager: OrderManager;
    },
    walletAddress: string
  ) =>
    api.post("/clickcrate-proxy", {
      walletAddress,
      endpoint: "/v1/product-listing/register",
      params: {
        ...data,
        productListingId: data.productListingId.toString(),
        manager: data.manager.toString(),
      },
    }),

  updateProductListing: (
    data: {
      productListingId: string;
      eligiblePlacementType: PlacementType;
      eligibleProductCategory: ProductCategory;
      manager: string;
      price: number;
    },
    walletAddress: string
  ) =>
    api.post("/clickcrate-proxy", {
      walletAddress,
      endpoint: "/v1/product-listing/update",
      params: {
        ...data,
        productListingId: data.productListingId.toString(),
        manager: data.manager.toString(),
      },
    }),

  activateProductListing: (productListingId: string, walletAddress: string) =>
    api.post("/clickcrate-proxy", {
      walletAddress,
      endpoint: "/v1/product-listing/activate",
      params: { productListingId: productListingId.toString() },
    }),

  deactivateProductListing: (productListingId: string, walletAddress: string) =>
    api.post("/clickcrate-proxy", {
      walletAddress,
      endpoint: "/v1/product-listing/deactivate",
      params: { productListingId: productListingId.toString() },
    }),

  placeProductListing: (
    data: {
      productListingId: string;
      clickcrateId: string;
      price: number;
    },
    walletAddress: string
  ) =>
    api.post("/clickcrate-proxy", {
      walletAddress,
      endpoint: "/v1/product-listing/place",
      params: {
        productListingId: data.productListingId.toString(),
        clickcrateId: data.clickcrateId.toString(),
        price: data.price,
      },
    }),

  removeProductListing: (
    data: {
      productListingId: string;
      clickcrateId: string;
    },
    walletAddress: string
  ) =>
    api.post("/clickcrate-proxy", {
      walletAddress,
      endpoint: "/v1/product-listing/remove",
      params: {
        productListingId: data.productListingId.toString(),
        clickcrateId: data.clickcrateId.toString(),
      },
    }),

  // Purchase endpoints
  initiatePurchase: (
    data: {
      productListingId: string;
      productId: string;
      clickcrateId: string;
      quantity: number;
      buyer: string;
    },
    walletAddress: string
  ) =>
    api.post("/clickcrate-proxy", {
      walletAddress,
      endpoint: "/v1/clickcrate/purchase",
      params: {
        ...data,
        productListingId: data.productListingId.toString(),
        productId: data.productId.toString(),
        clickcrateId: data.clickcrateId.toString(),
        buyer: data.buyer.toString(),
      },
    }),

  completePurchase: (
    data: {
      productListingId: string;
      productId: string;
      clickcrateId: string;
      quantity: number;
      buyer: string;
      payer: string;
      paymentProcessor: string;
    },
    walletAddress: string
  ) =>
    api.post("/clickcrate-proxy", {
      walletAddress,
      endpoint: "/v1/clickcrate/purchase",
      params: {
        ...data,
        productListingId: data.productListingId.toString(),
        productId: data.productId.toString(),
        clickcrateId: data.clickcrateId.toString(),
        buyer: data.buyer.toString(),
        payer: data.payer.toString(),
      },
    }),

  // Order endpoints
  getSquareOrder: (orderId: string, walletAddress: string) =>
    api.post("/clickcrate-proxy", {
      walletAddress,
      endpoint: `/v1/square/order/${orderId}`,
      params: {},
    }),

  getShopifyOrder: (orderId: string, walletAddress: string) =>
    api.post("/clickcrate-proxy", {
      walletAddress,
      endpoint: `/v1/shopify/order/${orderId}`,
      params: {},
    }),

  getAllNativeOrders: (creatorId: string, walletAddress: string) =>
    api.post("/clickcrate-proxy", {
      walletAddress,
      endpoint: "/v1/clickcrate/orders",
      params: { creatorId },
    }),

  // Credential endpoints
  storeShopifyCredentials: (
    credentials: ShopifyCredentials,
    walletAddress: string
  ) =>
    api.post("/clickcrate-proxy", {
      walletAddress,
      endpoint: "/v1/shopify/credentials",
      params: credentials,
    }),

  storeSquareCredentials: (
    credentials: SquareCredentials,
    walletAddress: string
  ) =>
    api.post("/clickcrate-proxy", {
      walletAddress,
      endpoint: "/v1/square/credentials",
      params: credentials,
    }),

  // Verification endpoints
  initiateVerification: (email: string, walletAddress: string) =>
    api.post("/clickcrate-proxy", {
      walletAddress,
      endpoint: "/v1/initiate-verification",
      params: { email },
    }),

  verifyCode: (email: string, code: string, walletAddress: string) =>
    api.post("/clickcrate-proxy", {
      walletAddress,
      endpoint: "/v1/verify-code",
      params: { email, code },
    }),
};

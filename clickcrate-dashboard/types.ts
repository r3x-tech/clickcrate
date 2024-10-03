import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

export type Origin = "clickcrate" | "shopify" | "square";
export type PlacementType =
  | "digitalreplica"
  | "relatedpurchase"
  | "targetedplacement";
export type ProductCategory =
  | "clothing"
  | "electronics"
  | "books"
  | "home"
  | "beauty"
  | "toys"
  | "sports"
  | "automotive"
  | "grocery"
  | "health";
export type OrderManager = "clickcrate" | "shopify" | "square";

export interface ClickCrateState {
  id: PublicKey;
  owner: PublicKey;
  manager: PublicKey;
  eligiblePlacementType: PlacementType;
  eligibleProductCategory: ProductCategory;
  product: PublicKey | null;
  isActive: boolean;
}

export interface ProductListingState {
  id: PublicKey;
  origin: Origin;
  owner: PublicKey;
  manager: PublicKey;
  placementType: PlacementType;
  productCategory: ProductCategory;
  inStock: BN;
  sold: BN;
  isActive: boolean;
}

export type RegisterClickCrateArgs = {
  id: PublicKey;
  eligiblePlacementType: PlacementType;
  eligibleProductCategory: ProductCategory;
  manager: PublicKey;
};

export type RemoveProductListingArgs = {
  productListingId: PublicKey;
  clickcrateId: PublicKey;
};

export type PlaceProductListingArgs = {
  productListingId: PublicKey;
  clickcrateId: PublicKey;
  price: BN;
};

export type MakePurchaseArgs = {
  productListingId: PublicKey;
  clickcrateId: PublicKey;
  productId: PublicKey;
  quantity: number;
  currentBuyer: PublicKey;
};

export interface NFT {
  name: string;
  symbol: string;
  royalty: number;
  image_uri: string;
  cached_image_uri: string;
  animation_url: string;
  cached_animation_url: string;
  metadata_uri: string;
  description: string;
  mint: string;
  owner: string;
  update_authority: string;
  creators: {
    address: string;
    share: number;
    verified: boolean;
  }[];
  collection: {
    address: string;
    verified: boolean;
  };
  attributes: unknown;
  attributes_array: {
    trait_type: string;
    value: string;
  }[];
  files: {
    uri: string;
    type: string;
  }[];
  external_url: string;
  primary_sale_happened: boolean;
  is_mutable: boolean;
  token_standard: string;
  is_loaded_metadata: boolean;
  is_compressed?: boolean;
}

export type ShopifyCredentials = {
  accessToken: string;
  shopDomain: string;
};

export type SquareCredentials = {
  accessToken: string;
  locationId: string;
};

export interface Order {
  productId: string;
  buyerId: string;
  sellerId: string;
  quantity: number;
  totalPrice: number;
  orderManager: "clickcrate" | "shopify" | "square";
  id: string;
  creatorId: string;
  status:
    | "Pending"
    | "Placed"
    | "Confirmed"
    | "Fulfilled"
    | "Delivered"
    | "Completed"
    | "Cancelled";
  createdAt: string;
  updatedAt: string;
  shippingName: string;
  shippingEmail: string;
  shippingAddress: string;
  shippingCity: string;
  shippingStateProvince: string;
  shippingCountryRegion: string;
  shippingZipCode: string;
}

export interface UpdateOrderStatusResponse {
  message: string;
  transaction: string;
}

export interface ProductListing {
  productListingId: string;
  origin: Origin;
  owner: string;
  manager: string;
  placementType: PlacementType;
  productCategory: ProductCategory;
  inStock: string;
  sold: string;
  clickcratePos: string | null;
  isActive: boolean;
  price: number | null;
  vault: string | null;
  orderManager: OrderManager;
}

export interface ProductListingResponse {
  productListings: ProductListing[];
}

export interface ClickCrate {
  clickcrateId: string;
  owner: string;
  manager: string;
  eligiblePlacementType: PlacementType;
  eligibleProductCategory: ProductCategory;
  product: string | null;
  isActive: boolean;
}

export interface ClickCrateResponse {
  clickCrates: ClickCrate[];
}

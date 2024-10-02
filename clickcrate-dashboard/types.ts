import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

export type PlacementType =
  | "Digitalreplica"
  | "Relatedpurchase"
  | "Targetedplacement";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getPlacementTypeFromString = (placementType: string): any => {
  switch (placementType) {
    case "Digitalreplica":
      return { digitalreplica: {} };
    case "Relatedpurchase":
      return { relatedpurchase: {} };
    case "Targetedplacement":
      return { targetedplacement: {} };
    default:
      throw new Error(`Invalid placement type: ${placementType}`);
  }
};

export type ProductCategory =
  | "Clothing"
  | "Electronics"
  | "Books"
  | "Home"
  | "Beauty"
  | "Toys"
  | "Sports"
  | "Automotive"
  | "Grocery"
  | "Health";

export const getProductCategoryFromString = (
  productCategory: string
): // eslint-disable-next-line @typescript-eslint/no-explicit-any
any => {
  switch (productCategory) {
    case "Clothing":
      return { clothing: {} };
    case "Electronics":
      return { electronics: {} };
    case "Books":
      return { boks: {} };
    case "Home":
      return { home: {} };
    case "Beauty":
      return { beauty: {} };
    case "Toys":
      return { toys: {} };
    case "Sports":
      return { sports: {} };
    case "Automotive":
      return { automotive: {} };
    case "Grocery":
      return { grocery: {} };
    case "Health":
      return { health: {} };
    default:
      throw new Error(`Invalid product category: ${productCategory}`);
  }
};

export type Origin = "ClickCrate" | "Shopify" | "Square";
export const getOriginFromString = (
  origin: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any => {
  switch (origin) {
    case "Clickcrate":
      return { clickcrate: {} };
    case "Shopify":
      return { shopify: {} };
    case "Square":
      return { square: {} };
    default:
      throw new Error(`Invalid origin: ${origin}`);
  }
};

export type OrderManager = "ClickCrate" | "Shopify" | "Square";
export const getOrderManagerFromString = (
  origin: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any => {
  switch (origin) {
    case "Clickcrate":
      return { clickcrate: {} };
    case "Shopify":
      return { shopify: {} };
    case "Square":
      return { square: {} };
    default:
      throw new Error(`Invalid origin: ${origin}`);
  }
};

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

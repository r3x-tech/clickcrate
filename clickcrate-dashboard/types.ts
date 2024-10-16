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

export type ClickcrateCreationData = {
  // name: string;
  // description: string;
  // eligiblePlacementType: PlacementType;
  // eligibleProductCategory: ProductCategory;
  // manager: PublicKey;
  name: string;
  symbol: string;
  description: string;
  image: string;
  placementType: PlacementType;
  additionalPlacementRequirements: string;
  placementFee: number;
  creator: PublicKey;
  feePayer: PublicKey;
  external_url: string;
  creator_url: string;
};

export type RegisterClickCrateArgs = {
  id: PublicKey;
  eligiblePlacementType: PlacementType;
  eligibleProductCategory: ProductCategory;
  manager: PublicKey;
};

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

export interface DetailedClickCrateState {
  collection: {
    interface: "MplCoreCollection";
    id: string;
    content: {
      $schema: string;
      json_uri: string;
      files: unknown[];
      metadata: {
        attributes: Array<{ trait_type: string; value: string }>;
        description: string;
        name: string;
        symbol: string;
      };
      links: {
        external_url: string;
        image: string;
        animation_url: string;
      };
    };
    authorities: {
      address: string;
      scopes: string[];
    };
    compression: {
      eligible: boolean;
      compressed: boolean;
      data_hash: string;
      creator_hash: string;
      asset_hash: string;
      tree: string;
    };
    grouping: {
      group_key: string;
      group_value: string;
    };
    royalty?: {
      royalty_model: string;
      target: string;
      percent: number;
      primary_sale_happened: boolean;
      locked: boolean;
    };
    creators: {
      address: string;
      verified: boolean;
    };
    ownership: {
      frozen: boolean;
      delegated: boolean;
      delegate: string;
      ownership_model: string;
      owner: string;
      supply: string;
      mutable: boolean;
      burnt: boolean;
    };
    mint_extensions: {
      confidential_transfer_mint: {
        authority: string;
        auto_approve_new_accounts: boolean;
        auditor_elgamal_pubkey: string;
      };
      confidential_transfer_fee_config: {
        authority: string;
        withdraw_withheld_authority_elgamal_pubkey: string;
        harvest_to_mint_enabled: boolean;
        withheld_amount: string;
      };
      transfer_fee_config: {
        transfer_fee_config_authority: string;
        withdraw_withheld_authority: string;
        older_transfer_fee: {
          epoch: string;
          maximum_fee: string;
          transfer_fee_basis_points: string;
        };
        newer_transfer_fee: {
          epoch: string;
        };
      };
      metadata_pointer: {
        authority: string;
        metadata_address: string;
      };
      mint_close_authority: {
        close_authority: string;
      };
      permanent_delegate: {
        delegate: string;
      };
      transfer_hook: {
        authority: string;
        program_id: string;
      };
      interest_bearing_config: {
        rate_authority: string;
      };
      default_account_state: string;
      confidential_transfer_account: {
        approved: boolean;
        elgamal_pubkey: string;
        pending_balance_lo: string;
        pending_balance_hi: string;
        available_balance: string;
        decryptable_available_balance: string;
        allow_confidential_credits: boolean;
        allow_non_confidential_credits: boolean;
      };
      metadata: {
        update_authority: string;
        mint: string;
        name: string;
        symbol: string;
        uri: string;
        additional_metadata: Array<{
          key: string;
          value: string;
        }>;
      };
    };
    supply: {
      master_edition_mint: string;
    };
    token_info: {
      symbol: string;
      token_program: string;
      price_info: {
        price_per_token: number;
        currency: string;
      };
      mint_authority: string;
      freeze_authority: string;
    };
    inscription: {
      contentType: string;
      encoding: string;
      validationHash: string;
      inscriptionDataAccount: string;
      authority: string;
    };
  };
}

export interface RecentCreation {
  mintAddress: string;
  name: string;
  image: string;
  type: string;
}

export type CreateProductData = {
  listingName: string;
  listingSymbol: string;
  listingDescription: string;
  listingImage: string;
  productCategory: ProductCategory;
  placementType: PlacementType;
  additionalPlacementRequirements: string;
  discount: string;
  customerProfileUri?: string;
  sku: string;
  products: Array<{
    name: string;
    symbol: string;
    description: string;
    image: string;
    animation_url?: string;
    external_url: string;
    creator_url: string;
    brand: string;
    size: string;
  }>;
  creator: string;
  feePayer: string;
  external_url: string;
  creator_url: string;
};

export type CreateClickcrateData = {
  name: string;
  symbol: string;
  description: string;
  image: string;
  placementType: PlacementType;
  additionalPlacementRequirements: string;
  placementFee: number;
  userProfileUri?: string;
  creator: string;
  feePayer: string;
  external_url: string;
  creator_url: string;
};

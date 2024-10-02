// components/ProductListingRegister.tsx
import { useState } from "react";
import { clickcrateApi } from "@/services/clickcrateApi";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@jup-ag/wallet-adapter";
import { Origin, PlacementType, ProductCategory } from "@/types";

export function ProductListingRegister() {
  const { publicKey } = useWallet();
  const [productId, setProductId] = useState("");
  const [productOrigin, setProductOrigin] = useState<Origin | null>(null);
  const [productPlacementType, setProductPlacementType] =
    useState<PlacementType | null>(null);
  const [productCategory, setProductCategory] =
    useState<ProductCategory | null>(null);
  const [productOrderManager, setProductOrderManager] = useState<Origin | null>(
    null
  );

  const handleProductRegistration = () => {
    if (
      publicKey &&
      productId &&
      productOrigin &&
      productPlacementType &&
      productCategory &&
      productOrderManager
    ) {
      clickcrateApi.registerProductListing({
        productListingId: new PublicKey(productId),
        origin: productOrigin,
        eligiblePlacementType: productPlacementType,
        eligibleProductCategory: productCategory,
        manager: publicKey,
        price: 0, // You need to add a price input field
        orderManager: productOrderManager,
      });
    }
  };

  // Add your form inputs here
  return (
    <div>
      <h2>Register New Product Listing</h2>
      {/* Add your form inputs here */}
      <button onClick={handleProductRegistration}>Register</button>
    </div>
  );
}

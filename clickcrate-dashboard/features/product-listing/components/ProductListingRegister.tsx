import React, { useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { Origin, PlacementType, ProductCategory } from "@/types";
import { clickcrateApi } from "@/services/clickcrateApi";
import toast from "react-hot-toast";
import { ExplorerLink } from "@/components/ExplorerLink";
import { ellipsify } from "@/utils/ellipsify";

interface ProductListingRegisterProps {
  show: boolean;
  onClose: () => void;
}

export function ProductListingRegister({
  show,
  onClose,
}: ProductListingRegisterProps) {
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

  const isProductFormValid =
    productId.trim() !== "" &&
    productOrigin !== null &&
    productPlacementType !== null &&
    productCategory !== null &&
    productOrderManager !== null;

  const handleProductRegistration = async () => {
    if (!publicKey) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!isProductFormValid) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await clickcrateApi.registerProductListing(
        {
          productListingId: productId,
          origin: productOrigin!,
          eligiblePlacementType: productPlacementType!,
          eligibleProductCategory: productCategory!,
          manager: publicKey.toString(),
          price: 0, // You may want to add a price input field
          orderManager: productOrderManager!,
        },
        publicKey.toString()
      );
      toast.success("Product listing registered successfully");
      onClose();
    } catch (error) {
      console.error("Error registering product listing:", error);
      toast.error("Failed to register product listing");
    }
  };

  if (!show) return null;

  return (
    <div className="modal modal-open absolute top-0 left-0 right-0 bottom-0">
      <div className="modal-box bg-background p-6 flex flex-col border-2 border-white rounded-lg space-y-4 w-[92vw]">
        <div className="flex flex-row justify-between items-end">
          <h1 className="text-lg font-bold text-start tracking-wide">
            Register Product Listing
          </h1>
          {publicKey && (
            <div className="flex flex-row justify-end items-end mb-[0.15em] p-0">
              <p className="text-start font-semibold tracking-wide text-xs">
                Owner:{" "}
              </p>
              <p className="pl-2 text-start font-normal text-xs">
                <ExplorerLink
                  path={`account/${publicKey}`}
                  label={ellipsify(publicKey.toString())}
                />
              </p>
            </div>
          )}
        </div>

        <input
          type="text"
          placeholder="Product ID (Core NFT Address)"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
        />

        <select
          value={productOrigin || ""}
          onChange={(e) => setProductOrigin(e.target.value as Origin)}
          className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
        >
          <option value="">Select an origin</option>
          <option value="Clickcrate">ClickCrate</option>
          <option value="Shopify">Shopify</option>
          <option value="Square">Square</option>
        </select>

        <select
          value={productPlacementType || ""}
          onChange={(e) =>
            setProductPlacementType(e.target.value as PlacementType)
          }
          className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
        >
          <option value="">Select a placement type</option>
          <option value="Relatedpurchase">Related Purchase</option>
          <option value="Digitalreplica">Digital Replica</option>
          <option value="Targetedplacement">Targeted Placement</option>
        </select>

        <select
          value={productCategory || ""}
          onChange={(e) =>
            setProductCategory(e.target.value as ProductCategory)
          }
          className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
        >
          <option value="">Select a product category</option>
          <option value="Clothing">Clothing</option>
          <option value="Electronics">Electronics</option>
          <option value="Books">Books</option>
          <option value="Home">Home</option>
          <option value="Beauty">Beauty</option>
          <option value="Toys">Toys</option>
          <option value="Sports">Sports</option>
          <option value="Automotive">Automotive</option>
          <option value="Grocery">Grocery</option>
          <option value="Health">Health</option>
        </select>

        <select
          value={productOrderManager || ""}
          onChange={(e) => setProductOrderManager(e.target.value as Origin)}
          className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
        >
          <option value="">Select an order manager</option>
          <option value="Clickcrate">ClickCrate</option>
          <option value="Shopify">Shopify</option>
          <option value="Square">Square</option>
        </select>

        <div className="flex flex-row gap-[4%] py-2">
          <button
            className="btn btn-xs lg:btn-sm btn-outline w-[48%] py-3"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="btn btn-xs lg:btn-sm btn-primary w-[48%] py-3"
            onClick={handleProductRegistration}
            disabled={!isProductFormValid}
          >
            Register Listing
          </button>
        </div>
      </div>
    </div>
  );
}

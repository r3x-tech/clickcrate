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
  const [isRegistering, setIsRegistering] = useState(false);
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

    setIsRegistering(true);
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
    } finally {
      setIsRegistering(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal modal-open absolute top-0 left-0 right-0 bottom-0">
      <div className="modal-box bg-background p-6 flex flex-col border-2 border-white rounded-lg space-y-4 w-[92vw] relative">
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

        {isRegistering ? (
          <div className="absolute inset-0 bg-background bg-opacity-50 flex flex-col items-center justify-center space-y-4">
            <div className="loading loading-spinner loading-sm"></div>
            <p className="text-sm font-bold">REGISTERING</p>
            <p className="text-xs font-semibold text-red my-4 p-2 bg-tertiary text-center rounded-md">
              WARNING: CLOSING THIS WINDOW MAY RESULT IN A FAILED REGISTRATION
            </p>
          </div>
        ) : (
          <div
            className={isRegistering ? "pointer-events-none opacity-50" : ""}
          >
            <input
              type="text"
              placeholder="Product ID (Core NFT Address)"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm mb-2"
              disabled={isRegistering}
            />

            <select
              value={productOrigin || ""}
              onChange={(e) => setProductOrigin(e.target.value as Origin)}
              className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm mb-2"
              disabled={isRegistering}
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
              className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm mb-2"
              disabled={isRegistering}
            >
              <option value="">Select a placement type</option>
              <option value="relatedpurchase">Related Purchase</option>
              <option value="digitalreplica">Digital Replica</option>
              <option value="targetedplacement">Targeted Placement</option>
            </select>

            <select
              value={productCategory || ""}
              onChange={(e) =>
                setProductCategory(e.target.value as ProductCategory)
              }
              className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm mb-2"
              disabled={isRegistering}
            >
              <option value="">Select a product category</option>
              <option value="clothing">Clothing</option>
              <option value="electronics">Electronics</option>
              <option value="books">Books</option>
              <option value="home">Home</option>
              <option value="beauty">Beauty</option>
              <option value="toys">Toys</option>
              <option value="sports">Sports</option>
              <option value="automotive">Automotive</option>
              <option value="grocery">Grocery</option>
              <option value="health">Health</option>
            </select>

            <select
              value={productOrderManager || ""}
              onChange={(e) => setProductOrderManager(e.target.value as Origin)}
              className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm mb-2"
              disabled={isRegistering}
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
                disabled={isRegistering}
              >
                Cancel
              </button>
              <button
                className="btn btn-xs lg:btn-sm btn-primary w-[48%] py-3"
                onClick={handleProductRegistration}
                disabled={!isProductFormValid || isRegistering}
              >
                Register Listing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

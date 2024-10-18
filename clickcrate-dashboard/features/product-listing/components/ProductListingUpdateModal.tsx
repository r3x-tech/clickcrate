import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { ExplorerLink } from "@/components/ExplorerLink";
import { ellipsify } from "@/utils/ellipsify";
import { PlacementType, ProductCategory } from "@/types";
import toast from "react-hot-toast";
import { useUpdateProductListing } from "../hooks/useUpdateProductListing";
import { PublicKey } from "@solana/web3.js";

export function ProductListingUpdateModal({
  show,
  onClose,
  currentProductListingId,
  currentManager,
  currentPlacementType,
  currentProductCategory,
  currentPrice,
  isUpdateProductListingFormValid,
}: {
  show: boolean;
  onClose: () => void;
  currentProductListingId: string;
  currentManager: string;
  currentPlacementType: PlacementType;
  currentProductCategory: ProductCategory;
  currentPrice: number;
  isUpdateProductListingFormValid: boolean;
}) {
  const { publicKey } = useWallet();
  const updateProductListing = useUpdateProductListing();

  const [placementType, setPlacementType] = useState<PlacementType | null>(
    currentPlacementType
  );
  const [productCategory, setProductCategory] =
    useState<ProductCategory | null>(currentProductCategory);
  const [manager, setManager] = useState<string>(currentManager);
  const [price, setPrice] = useState<number>(currentPrice / 1_000_000_000);

  const handleUpdateProductListing = () => {
    if (!placementType || !productCategory || !manager || price === undefined) {
      toast.error("All fields required");
      return;
    }

    try {
      new PublicKey(manager); // Validate manager is a valid public key
    } catch (error) {
      toast.error("Invalid manager public key");
      return;
    }

    if (publicKey && isUpdateProductListingFormValid) {
      updateProductListing.mutate(
        {
          productListingId: currentProductListingId,
          placementType,
          productCategory,
          manager,
          price: Math.floor(price * 1_000_000_000), // Convert to lamports and ensure it's an integer
        },
        {
          onSuccess: () => {
            onClose();
            toast.success("Product Listing updated ");
          },
          onError: (error) => {
            console.error("Error in mutation:", error);
            toast.error("Failed to update Product Listing");
          },
        }
      );
    } else {
      toast.error("Update unavailable");
    }
  };

  return (
    <div
      className={`modal ${
        show ? "modal-open" : ""
      } absolute top-0 left-0 right-0 bottom-0`}
    >
      <div className="modal-box bg-background p-6 flex flex-col border-2 border-white rounded-lg space-y-4 w-[92vw]">
        <div className="flex flex-row justify-between items-end">
          <h1 className="text-lg font-bold text-start">
            Update Product Listing
          </h1>
          <div className="flex flex-row justify-end items-end mb-[0.15em] p-0">
            <p className="text-start font-semibold tracking-wide text-xs">
              ID:{" "}
            </p>
            <p className="pl-2 text-start font-normal text-xs">
              <ExplorerLink
                path={`account/${currentProductListingId}`}
                label={ellipsify(currentProductListingId)}
              />
            </p>
          </div>
        </div>

        {updateProductListing.isPending ? (
          <div className="flex flex-col items-center justify-center space-y-4 h-full pt-4">
            <div className="loading loading-spinner loading-sm"></div>
            <p className="text-sm font-bold">UPDATING</p>
            <p className="text-xs font-semibold text-red my-4 p-2 bg-tertiary text-center rounded-md">
              WARNING: CLOSING THIS WINDOW MAY RESULT IN A FAILED REGISTRATION
            </p>
          </div>
        ) : (
          <div
            className={`${
              updateProductListing.isPending
                ? "pointer-events-none opacity-50"
                : ""
            } space-y-2
            `}
          >
            <select
              value={placementType || ""}
              onChange={(e) =>
                setPlacementType(e.target.value as PlacementType)
              }
              className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
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
              className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
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

            <input
              type="text"
              placeholder="Manager (Public Key)"
              value={manager}
              onChange={(e) => setManager(e.target.value)}
              className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
            />

            <input
              type="number"
              placeholder="Price (SOL)"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
            />

            <div className="flex flex-row gap-[4%] py-2">
              <button
                className="btn btn-xs lg:btn-sm btn-outline w-[48%] py-3"
                onClick={onClose}
                disabled={updateProductListing.isPending}
              >
                Cancel
              </button>
              <button
                className="btn btn-xs lg:btn-sm btn-primary w-[48%] py-3"
                onClick={handleUpdateProductListing}
                disabled={updateProductListing.isPending}
              >
                Update
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

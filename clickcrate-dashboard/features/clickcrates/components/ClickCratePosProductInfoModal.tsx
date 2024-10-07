// File: ClickCratePosProductInfoModal.tsx
import React from "react";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { ExplorerLink } from "@/components/ExplorerLink";
import { ellipsify } from "@/utils/ellipsify";
import { useRemoveProductListing } from "../hooks/useRemoveProductListing";
import { useProductListingDetails } from "../hooks/useProductListingDetails";

export function ClickCratePosProductInfoModal({
  show,
  onClose,
  currentClickcrateId,
  currentProductId,
  isProductInfoFormValid,
}: {
  show: boolean;
  onClose: () => void;
  currentClickcrateId: PublicKey;
  currentProductId: PublicKey;
  isProductInfoFormValid: boolean;
}) {
  const { publicKey } = useWallet();
  const removeProductListing = useRemoveProductListing(
    publicKey?.toString() || null
  );
  const { data: productDetails, isLoading } = useProductListingDetails(
    currentProductId.toString(),
    publicKey?.toString() || null
  );

  const handleRemoveProduct = async () => {
    if (publicKey && isProductInfoFormValid) {
      try {
        await removeProductListing.mutateAsync({
          productListingId: currentProductId.toString(),
          clickcrateId: currentClickcrateId.toString(),
        });
        onClose();
      } catch (error) {
        console.error("Failed to remove product:", error);
      }
    }
  };

  return (
    <div
      className={`modal ${
        show ? "modal-open" : ""
      } absolute top-0 left-0 right-0 bottom-0`}
    >
      <div className="modal-box bg-background p-6 flex flex-col border-2 border-white rounded-lg space-y-6 w-[92vw]">
        <div className="flex flex-row justify-between items-end">
          <h1 className="text-lg font-bold text-start">Product Info</h1>
          <div className="flex flex-row justify-end items-end mb-[0.15em] p-0">
            <p className="text-start font-semibold tracking-wide text-xs">
              Product:{" "}
            </p>
            <p className="pl-2 text-start font-normal text-xs">
              <ExplorerLink
                path={`account/${currentProductId}`}
                label={ellipsify(currentProductId.toString())}
              />
            </p>
          </div>
        </div>

        {/* {isLoading ? (
          <div>Loading product details...</div>
        ) : (
          <div>
            <p>Name: {productDetails?.name}</p>
            <p>Description: {productDetails?.description}</p>
            <p>Price: {productDetails?.price}</p>
          </div>
        )} */}

        <div className="flex flex-row gap-[4%] py-2">
          <button
            className="btn btn-xs lg:btn-sm btn-outline w-[48%] py-3"
            onClick={onClose}
            disabled={removeProductListing.isPending}
          >
            Cancel
          </button>
          <button
            className="btn btn-xs lg:btn-sm btn-primary w-[48%] py-3"
            onClick={handleRemoveProduct}
            disabled={removeProductListing.isPending || !isProductInfoFormValid}
          >
            {removeProductListing.isPending ? "Removing..." : "Remove Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

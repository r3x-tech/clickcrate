import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { ExplorerLink } from "@/components/ExplorerLink";
import { ellipsify } from "@/utils/ellipsify";
import toast from "react-hot-toast";
import { PublicKey } from "@solana/web3.js";
import { usePlaceProductListing } from "../hooks/usePlaceProductListing";

export function ProductListingPlaceModal({
  show,
  onClose,
  currentProductListingId,
  isPlaceProductListingFormValid,
  onFinishPlacing,
}: {
  show: boolean;
  onClose: () => void;
  currentProductListingId: string;
  isPlaceProductListingFormValid: boolean;
  onFinishPlacing: () => void;
}) {
  const { publicKey } = useWallet();
  const placeProductListing = usePlaceProductListing();

  const [clickcrateId, setClickcrateId] = useState<string>("");
  const [price, setPrice] = useState<number | null>(null);

  const handlePlaceProductListing = () => {
    if (!clickcrateId || price === null) {
      toast.error("All fields required");
      return;
    }

    try {
      new PublicKey(clickcrateId);
    } catch (error) {
      toast.error("Invalid Clickcrate ID");
      return;
    }

    if (publicKey && isPlaceProductListingFormValid) {
      placeProductListing.mutate(
        {
          productListingId: currentProductListingId,
          clickcrateId,
          price: price,
        },
        {
          onSuccess: () => {
            onClose();
            toast.success("Product Listing placed ");
            onFinishPlacing();
          },
          onError: (error) => {
            console.error("Error in mutation:", error);
            toast.error("Failed to place Product Listing");
            onFinishPlacing();
          },
        }
      );
    } else {
      toast.error("Placement unavailable");
    }
  };

  return (
    <div
      className={`modal ${
        show ? "modal-open" : ""
      } fixed inset-0 z-50 overflow-y-auto`}
    >
      <div className="modal-box bg-background p-6 flex flex-col border-2 border-white rounded-lg space-y-4 w-[92vw]">
        <div className="flex flex-row justify-between items-end">
          <h1 className="text-lg font-bold text-start">
            Place Product Listing
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

        {placeProductListing.isPending ? (
          <div className="flex flex-col items-center justify-center space-y-4 h-full pt-4">
            <div className="loading loading-spinner loading-sm"></div>
            <p className="text-sm font-bold">PLACING</p>
            <p className="text-xs font-semibold text-red my-4 p-2 bg-tertiary text-center rounded-md">
              WARNING: CLOSING THIS WINDOW MAY RESULT IN A FAILED REGISTRATION
            </p>
          </div>
        ) : (
          <div
            className={`${
              placeProductListing.isPending
                ? "pointer-events-none opacity-50"
                : ""
            } space-y-2
            `}
          >
            <input
              type="text"
              placeholder="Clickcrate ID (Public Key)"
              value={clickcrateId}
              onChange={(e) => setClickcrateId(e.target.value)}
              className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
            />

            <input
              type="number"
              placeholder="Price (SOL)"
              value={price !== null ? price : ""}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
            />

            <div className="flex flex-row gap-[4%] py-2">
              <button
                className="btn btn-xs lg:btn-sm btn-outline w-[48%] py-3"
                onClick={onClose}
                disabled={placeProductListing.isPending}
              >
                Cancel
              </button>
              <button
                className="btn btn-xs lg:btn-sm btn-primary w-[48%] py-3"
                onClick={handlePlaceProductListing}
                disabled={placeProductListing.isPending}
              >
                Place
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

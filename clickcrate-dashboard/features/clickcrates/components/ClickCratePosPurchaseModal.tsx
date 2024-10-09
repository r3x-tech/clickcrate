import React from "react";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { ExplorerLink } from "@/components/ExplorerLink";
import { ellipsify } from "@/utils/ellipsify";
import { useMakePurchase } from "../hooks/useMakePurchase";
import toast from "react-hot-toast";

export function ClickCratePosPurchaseModal({
  show,
  onClose,
  currentClickcrateId,
  currentProductId,
  isMakePurchaseFormValid,
}: {
  show: boolean;
  onClose: () => void;
  currentClickcrateId: PublicKey;
  currentProductId: PublicKey;
  isMakePurchaseFormValid: boolean;
}) {
  const { publicKey } = useWallet();
  const makePurchase = useMakePurchase();

  const handleMakePurchase = async () => {
    if (publicKey && isMakePurchaseFormValid) {
      try {
        await makePurchase.mutateAsync({
          productListingId: currentProductId.toString(),
          productId: currentProductId.toString(),
          clickcrateId: currentClickcrateId.toString(),
          quantity: 1,
          buyer: publicKey.toString(),
        });
        toast.success("Purchase completed successfully");
        onClose();
      } catch (error) {
        console.error("Failed to complete purchase:", error);
        toast.error("Failed to complete purchase");
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
          <h1 className="text-lg font-bold text-start">Make Purchase</h1>
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

        <div className="flex flex-row gap-[4%] py-2">
          <button
            className="btn btn-xs lg:btn-sm btn-outline w-[48%] py-3"
            onClick={onClose}
            disabled={makePurchase.isPending}
          >
            Cancel
          </button>
          <button
            className="btn btn-xs lg:btn-sm btn-primary w-[48%] py-3"
            onClick={handleMakePurchase}
            disabled={makePurchase.isPending || !isMakePurchaseFormValid}
          >
            {makePurchase.isPending ? "Purchasing..." : "Confirm Purchase"}
          </button>
        </div>
      </div>
    </div>
  );
}

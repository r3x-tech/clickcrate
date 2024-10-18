import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PlacementType, ProductCategory } from "@/types";
import { ExplorerLink } from "@/components/ExplorerLink";
import { ellipsify } from "@/utils/ellipsify";
import toast from "react-hot-toast";
import { useRegisterClickcrate } from "../hooks/useRegisterClickcrate";
import { showTransactionToast } from "@/components/TransactionToast";

interface ClickcrateRegisterProps {
  show: boolean;
  onClose: () => void;
}

export function ClickcrateRegisterModal({
  show,
  onClose,
}: ClickcrateRegisterProps) {
  const { publicKey } = useWallet();
  const registerClickCrate = useRegisterClickcrate();

  const [clickcrateId, setClickcrateId] = useState("");
  const [clickcratePlacementType, setClickcratePlacementType] = useState<
    PlacementType | undefined
  >();
  const [clickcrateProductCategory, setClickcrateProductCategory] = useState<
    ProductCategory | undefined
  >();

  const isClickcrateFormValid =
    clickcrateId.trim() !== "" &&
    clickcratePlacementType !== undefined &&
    clickcrateProductCategory !== undefined;

  const handleClickcrateRegistration = async () => {
    if (!publicKey) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!isClickcrateFormValid) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const result = await registerClickCrate.mutateAsync({
        clickcrateId: clickcrateId,
        eligiblePlacementType: clickcratePlacementType!,
        eligibleProductCategory: clickcrateProductCategory!,
        manager: publicKey.toString(),
      });
      toast.success("ClickCrate registered ");
      showTransactionToast(result.signature);
      onClose();
    } catch (error) {
      console.error("Error registering ClickCrate:", error);
      toast.error("Failed to register ClickCrate");
    }
  };

  if (!show) return null;

  return (
    <div className="modal modal-open fixed inset-0 z-50 overflow-y-auto">
      <div className="modal-box bg-background p-6 rounded-lg border-2 border-white w-[92vw] m-auto">
        <div className="flex flex-row justify-between items-end mb-4">
          <h1 className="text-lg font-bold text-start tracking-wide">
            Register ClickCrate
          </h1>
          <div className="flex flex-row justify-end items-end mb-[0.15em] p-0">
            <p className="text-start font-semibold tracking-wide text-xs">
              Registry:{" "}
            </p>
            <p className="pl-2 text-start font-normal text-xs">
              <ExplorerLink
                path={`account/${process.env.NEXT_PUBLIC_REGISTRY_ID!}`}
                label={ellipsify(process.env.NEXT_PUBLIC_REGISTRY_ID!)}
              />
            </p>
          </div>
        </div>

        {registerClickCrate.isPending ? (
          <div className="flex flex-col items-center justify-center space-y-4 h-full pt-4">
            <div className="loading loading-spinner loading-sm"></div>
            <p className="text-sm font-bold">REGISTERING</p>
            <p className="text-xs font-semibold text-red my-4 p-2 bg-tertiary text-center rounded-md">
              WARNING: CLOSING THIS WINDOW MAY RESULT IN A FAILED REGISTRATION
            </p>
          </div>
        ) : (
          <div
            className={
              registerClickCrate.isPending
                ? "pointer-events-none opacity-50"
                : ""
            }
          >
            <input
              type="text"
              placeholder="Collection ID (Core NFT Address)"
              value={clickcrateId}
              onChange={(e) => setClickcrateId(e.target.value)}
              className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm mb-2"
              disabled={registerClickCrate.isPending}
            />

            <select
              value={clickcratePlacementType}
              onChange={(e) =>
                setClickcratePlacementType(e.target.value as PlacementType)
              }
              className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm mb-2"
              disabled={registerClickCrate.isPending}
            >
              <option value="">Select a placement type</option>
              <option value="relatedpurchase">Related Purchase</option>
              <option value="digitalreplica">Digital Replica</option>
              <option value="targetedplacement">Targeted Placement</option>
            </select>

            <select
              value={clickcrateProductCategory}
              onChange={(e) =>
                setClickcrateProductCategory(e.target.value as ProductCategory)
              }
              className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm mb-2"
              disabled={registerClickCrate.isPending}
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

            <div className="flex flex-row gap-[4%] py-2">
              <button
                className="btn btn-xs lg:btn-sm btn-outline w-[48%] py-3"
                onClick={onClose}
                disabled={registerClickCrate.isPending}
              >
                Cancel
              </button>
              <button
                className="btn btn-xs lg:btn-sm btn-primary w-[48%] py-3"
                onClick={handleClickcrateRegistration}
                disabled={
                  registerClickCrate.isPending || !isClickcrateFormValid
                }
              >
                Register
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { useWallet } from "@jup-ag/wallet-adapter";
import { PublicKey } from "@solana/web3.js";
import { PlacementType, ProductCategory } from "@/types";
import { ExplorerLink } from "@/components/ExplorerLink";
import { ellipsify } from "@/utils/ellipsify";
import toast from "react-hot-toast";
import { useRegisterClickcrate } from "../hooks/useRegisterClickcrate";

interface ClickcrateRegisterProps {
  show: boolean;
  onClose: () => void;
}

export function ClickcrateRegister({ show, onClose }: ClickcrateRegisterProps) {
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
      await registerClickCrate.mutateAsync({
        clickcrateId: new PublicKey(clickcrateId),
        eligiblePlacementType: clickcratePlacementType!,
        eligibleProductCategory: clickcrateProductCategory!,
        manager: publicKey,
      });
      toast.success("ClickCrate registered successfully");
      onClose();
    } catch (error) {
      console.error("Error registering ClickCrate:", error);
      toast.error("Failed to register ClickCrate");
    }
  };

  if (!show) return null;

  return (
    <div className="modal modal-open absolute top-0 left-0 right-0 bottom-0">
      <div className="modal-box bg-background p-6 flex flex-col border-2 border-white rounded-lg space-y-4 w-[92vw]">
        <div className="flex flex-row justify-between items-end">
          <h1 className="text-lg font-bold text-start tracking-wide">
            Register ClickCrate
          </h1>
          <div className="flex flex-row justify-end items-end mb-[0.15em] p-0">
            <p className="text-start font-semibold tracking-wide text-xs">
              Registry:{" "}
            </p>
            <p className="pl-2 text-start font-normal text-xs">
              <ExplorerLink
                path={`account/${process.env.REGISTRY_ID!}`}
                label={ellipsify(process.env.REGISTRY_ID!)}
              />
            </p>
          </div>
        </div>

        <input
          type="text"
          placeholder="Collection ID (Core NFT Address)"
          value={clickcrateId}
          onChange={(e) => setClickcrateId(e.target.value)}
          className="rounded-lg p-2 text-black"
        />

        <select
          value={clickcratePlacementType}
          onChange={(e) =>
            setClickcratePlacementType(e.target.value as PlacementType)
          }
          className="rounded-lg p-2 text-black"
        >
          <option value="">Select a placement type</option>
          <option value="Relatedpurchase">Related Purchase</option>
          <option value="Digitalreplica">Digital Replica</option>
          <option value="Targetedplacement">Targeted Placement</option>
        </select>

        <select
          value={clickcrateProductCategory}
          onChange={(e) =>
            setClickcrateProductCategory(e.target.value as ProductCategory)
          }
          className="rounded-lg p-2 text-black"
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
            disabled={registerClickCrate.isPending || !isClickcrateFormValid}
          >
            {registerClickCrate.isPending ? "Registering..." : "Register POS"}
          </button>
        </div>
      </div>
    </div>
  );
}

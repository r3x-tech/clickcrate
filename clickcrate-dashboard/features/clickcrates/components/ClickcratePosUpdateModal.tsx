import { ExplorerLink } from "@/components/ExplorerLink";
import { ellipsify } from "@/components/Layout";
import { PlacementType, ProductCategory } from "@/types";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useState } from "react";
import toast from "react-hot-toast";
import { useUpdateClickcrate } from "../hooks/useUpdateClickcrate";

export function ClickCratePosUpdateModal({
  show,
  onClose,
  currentClickcrateId,
  isUpdateClickCrateFormValid,
}: {
  show: boolean;
  onClose: () => void;
  currentClickcrateId: PublicKey;
  isUpdateClickCrateFormValid: boolean;
}) {
  const { publicKey } = useWallet();
  const updateClickcrate = useUpdateClickcrate();

  const [placementType, setPlacementType] = useState<PlacementType | null>(
    null
  );
  const [productCategory, setProductCategory] =
    useState<ProductCategory | null>(null);
  const [managerInput, setManagerInput] = useState<string>("");

  const handleUpdateClickCrate = () => {
    if (!placementType || !productCategory || !managerInput) {
      toast.error("All fields required");
      return;
    }

    let manager: PublicKey;
    try {
      manager = new PublicKey(managerInput);
    } catch (error) {
      toast.error("Invalid manager public key");
      return;
    }

    if (publicKey && isUpdateClickCrateFormValid) {
      updateClickcrate.mutate(
        {
          clickcrateId: currentClickcrateId.toString(),
          eligiblePlacementType: placementType,
          eligibleProductCategory: productCategory,
          manager: manager.toString(),
        },
        {
          onSuccess: () => {
            onClose();
            toast.success("ClickCrate updated successfully");
          },
          onError: (error) => {
            console.error("Error in mutation:", error);
            toast.error("Failed to update ClickCrate");
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
            Update ClickCrate POS
          </h1>
          <div className="flex flex-row justify-end items-end mb-[0.15em] p-0">
            <p className="text-start font-semibold tracking-wide text-xs">
              ID:{" "}
            </p>
            <p className="pl-2 text-start font-normal text-xs">
              <ExplorerLink
                path={`account/${currentClickcrateId}`}
                label={ellipsify(currentClickcrateId.toString())}
              />
            </p>
          </div>
        </div>

        <select
          value={placementType || ""}
          onChange={(e) => setPlacementType(e.target.value as PlacementType)}
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
          placeholder="Manager"
          value={managerInput}
          onChange={(e) => setManagerInput(e.target.value)}
          className="rounded-lg p-[10px] text-white w-full bg-tertiary text-sm"
        />
        <div className="flex flex-row gap-[4%] py-2">
          <button
            className="btn btn-xs lg:btn-sm btn-outline w-[48%] py-3"
            onClick={onClose}
            disabled={updateClickcrate.isPending}
          >
            Cancel
          </button>
          <button
            className="btn btn-xs lg:btn-sm btn-primary w-[48%] py-3"
            onClick={handleUpdateClickCrate}
            disabled={updateClickcrate.isPending}
          >
            {updateClickcrate.isPending ? "Updating..." : "Update ClickCrate"}
          </button>
        </div>
      </div>
    </div>
  );
}

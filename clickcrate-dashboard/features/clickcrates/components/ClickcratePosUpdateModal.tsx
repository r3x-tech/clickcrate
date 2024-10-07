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
  const [manager, setManager] = useState<PublicKey | null>(null);

  const handleUpdateClickCrate = () => {
    if (
      manager === null ||
      placementType === null ||
      productCategory === null
    ) {
      toast.error("All fields required");
    } else if (publicKey && isUpdateClickCrateFormValid) {
      updateClickcrate.mutate({
        clickcrateId: currentClickcrateId.toString(),
        eligiblePlacementType: placementType,
        eligibleProductCategory: productCategory,
        manager: manager.toString(),
      });
      onClose();
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
      <div className="modal-box bg-background p-6 flex flex-col border-2 border-white rounded-lg space-y-6 w-[92vw]">
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
          className="rounded-lg p-2 text-black"
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
        <input
          type="text"
          placeholder="Manager"
          onChange={(e) => setManager(new PublicKey(e.target.value))}
          className="rounded-lg p-2 text-black"
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

import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { CreateProductData, CreateClickcrateData } from "@/types";
import { ExplorerLink } from "@/components/ExplorerLink";
import { ellipsify } from "@/utils/ellipsify";
import { ProductForm } from "@/features/create/components/forms/ProductForm";
import { ClickcrateForm } from "@/features/create/components/forms/ClickcrateForm";
import { ProductSuccessInfo } from "@/features/create/components/ProductSuccessInfo";
import toast from "react-hot-toast";
import { ClickcrateSuccessInfo } from "./ClickcrateSuccessInfo";

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateModal: React.FC<CreateProductModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [creationType, setCreationType] = useState<"product" | "clickcrate">(
    "product"
  );
  const [isCreating, setIsCreating] = useState(false);
  const [creationSuccess, setCreationSuccess] = useState(false);
  const [createdId, setCreatedId] = useState("");
  const [createdProductIds, setCreatedProductIds] = useState<string[]>([]);
  const { publicKey } = useWallet();

  if (!isOpen) return null;

  const handleCreationStart = () => {
    setIsCreating(true);
  };

  const handleCreationSuccess = (id: string, productIds?: string[]) => {
    setIsCreating(false);
    setCreationSuccess(true);
    setCreatedId(id);
    if (productIds) {
      setCreatedProductIds(productIds);
    }
  };

  const handleCreationFailure = () => {
    setIsCreating(false);
  };

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(createdId);
      toast.success("Copied ID to clipboard");
    } catch (err) {
      console.error("Failed to copy ID:", err);
      toast.error("Failed to copy ID");
    }
  };

  const handleCreateAgain = () => {
    setCreationSuccess(false);
    setCreatedId("");
    setCreatedProductIds([]);
    setCreationType("product");
  };

  const handleRegisterAndActivate = () => {
    console.log("Register and activate clicked");
    toast.success("Registration and activation initiated");
  };

  return (
    <div className="modal modal-open absolute top-0 left-0 right-0 bottom-0">
      <div className="modal-box bg-background p-6 flex flex-col border-2 border-white rounded-lg space-y-6 w-[92vw] max-h-[90vh] overflow-y-auto">
        <div className="flex flex-row justify-between items-end">
          <h1 className="text-lg font-bold text-start tracking-wide">
            New Creation
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

        {!creationSuccess && (
          <>
            {!isCreating && (
              <div className="space-y-2">
                <p className="text-start font-semibold tracking-wide text-xs">
                  What would you like to create?{" "}
                </p>
                <select
                  className="rounded-lg p-[10px] text-white font-semibold w-full bg-tertiary text-sm"
                  value={creationType}
                  disabled={isCreating}
                  onChange={(e) =>
                    setCreationType(e.target.value as "product" | "clickcrate")
                  }
                >
                  <option value="product">Create Product Listing</option>
                  <option value="clickcrate">Create ClickCrate</option>
                </select>
              </div>
            )}

            {creationType === "product" ? (
              <ProductForm
                key="product-form"
                onClose={onClose}
                onCreationStart={handleCreationStart}
                onCreationSuccess={handleCreationSuccess}
                onCreationFailure={handleCreationFailure}
                isCreating={isCreating}
              />
            ) : (
              <ClickcrateForm
                key="clickcrate-form"
                onClose={onClose}
                onCreationStart={handleCreationStart}
                onCreationSuccess={handleCreationSuccess}
                onCreationFailure={handleCreationFailure}
                isCreating={isCreating}
              />
            )}
          </>
        )}

        {/* {isCreating && (
          <div className="flex flex-col items-center justify-center space-y-4 h-full">
            <div className="loading loading-spinner loading-sm"></div>
            <p className="text-sm font-bold">CREATING</p>
            <p className="text-xs font-semibold text-red my-4 p-2 bg-tertiary text-center rounded-md">
              WARNING: CLOSING THIS WINDOW MAY RESULT IN A FAILED CREATION
            </p>
          </div>
        )} */}

        {creationSuccess && (
          <div className="flex flex-col items-between justify-between h-full w-full">
            <h2 className="text-center text-sm text-green font-bold mb-4  bg-tertiary rounded-md p-2">{`${
              creationType === "product" ? "Product NFTs" : "ClickCrate NFT"
            } created successfully!`}</h2>
            {creationType === "clickcrate" ? (
              <ClickcrateSuccessInfo
                clickcrateId={createdId}
                walletAddress={publicKey?.toString() || ""}
                onCopyId={handleCopyId}
              />
            ) : (
              <ProductSuccessInfo
                listingId={createdId}
                productIds={createdProductIds}
                walletAddress={publicKey?.toString() || ""}
                onCopyId={handleCopyId}
              />
            )}
            <div className="flex space-x-2 pt-4 justify-between mt-6">
              <button
                onClick={onClose}
                className="w-[23%] btn btn-xs lg:btn-sm btn-outline p-3"
              >
                Close
              </button>
              <button
                onClick={handleCreateAgain}
                className="w-[32%] btn btn-xs lg:btn-sm btn-primary hover:btn-secondary p-3 text-white"
              >
                Create Again
              </button>
              <button
                onClick={handleRegisterAndActivate}
                className="w-[40%] btn btn-xs lg:btn-sm btn-primary hover:btn-secondary p-3 text-white"
              >
                Register & Activate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

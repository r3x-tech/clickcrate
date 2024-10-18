import React, { useState, useEffect } from "react";
import { PublicKey } from "@solana/web3.js";
import { ellipsify } from "@/utils/ellipsify";
import { ExplorerLink } from "@/components/ExplorerLink";
import { ClickCrate } from "@/types";
import {
  IconRefresh,
  IconEdit,
  IconShoppingCartFilled,
  IconLink,
  IconChevronDown,
  IconChevronRight,
  IconClipboard,
} from "@tabler/icons-react";
import toast from "react-hot-toast";
import {
  formatPlacementType,
  formatProductCategory,
} from "@/utils/conversions";
import { useWallet } from "@solana/wallet-adapter-react";
import { PlacementType, ProductCategory } from "@/types";
import { Action, useActionsRegistryInterval } from "@dialectlabs/blinks";
import { ClickCratePosUpdateModal } from "./ClickcratePosUpdateModal";
import { ClickCratePosPurchaseModal } from "./ClickCratePosPurchaseModal";
import { ClickCratePosProductInfoModal } from "./ClickCratePosProductInfoModal";
import { ClickCratePosShareModal } from "./ClickCratePosShareModal";
import { useClickcrateDetails } from "../hooks/useClickcrateDetails";
import Image from "next/image";

interface ClickcratesListProps {
  clickcrates: ClickCrate[];
  onSelect: (clickcrateId: string, selected: boolean) => void;
  selectedClickcrates: string[];
  // refetch: () => Promise<void>;
}

export function ClickcratesList({
  clickcrates,
  onSelect,
  selectedClickcrates,
}: // refetch,
ClickcratesListProps) {
  const [allSelected, setAllSelected] = useState(false);

  // const handleRefetch = async () => {
  //   try {
  //     await refetch();
  //     toast.success("ClickCrates refreshed");
  //   } catch (error) {
  //     toast.error("Failed to refresh ClickCrates");
  //   }
  // };

  useEffect(() => {
    setAllSelected(selectedClickcrates.length === clickcrates.length);
  }, [selectedClickcrates, clickcrates]);

  const handleAllSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isSelected = e.target.checked;
    setAllSelected(isSelected);
    clickcrates.forEach((clickcrate) => {
      onSelect(clickcrate.clickcrateId, isSelected);
    });
  };

  return (
    <div className="w-[100%] bg-background border-2 border-quaternary rounded-lg">
      {/* <div className="flex justify-end mb-2">
        <button className="btn btn-ghost btn-sm" onClick={handleRefetch}>
          <IconRefresh size={18} />
          Refresh
        </button>
      </div> */}
      <div className="flex flex-row justify-start items-center w-[100%] px-4 pb-2 pt-2 border-b-2 border-quaternary">
        <div className="flex flex-row w-[3%]">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={handleAllSelectChange}
            className="checkbox checkbox-xs bg-quaternary border-quaternary rounded-sm"
          />
        </div>
        <div className="flex flex-row w-[4%]"></div>
        <div className="flex flex-row w-[10%]">
          <p className="text-start font-extrabold text-xs">ID</p>
        </div>
        <div className="flex flex-row w-[10%]">
          <p className="text-start font-extrabold text-xs">OWNER</p>
        </div>
        <div className="flex flex-row w-[8%]">
          <p className="text-start font-extrabold text-xs">STATUS</p>
        </div>
        <div className="flex flex-row w-[12%]">
          <p className="text-start font-extrabold text-xs">CATEGORY</p>
        </div>
        <div className="flex flex-row items-center w-[13%]">
          <p className="text-start font-extrabold text-xs">PLACEMENT TYPE</p>
        </div>
        <div className="flex flex-row w-[10%]">
          <p className="text-start font-extrabold text-xs">PRODUCT</p>
        </div>
        <div className="flex flex-row w-[10%] justify-end">
          <p className="text-end font-bold text-xs">INVENTORY </p>
        </div>
        <div className="flex flex-row w-[20%]"></div>
      </div>
      {clickcrates.map((clickcrate, index) => (
        <ClickCratePosCard
          key={clickcrate.clickcrateId}
          clickcrateId={new PublicKey(clickcrate.clickcrateId)}
          clickcrate={clickcrate}
          onSelect={(account, selected) =>
            onSelect(account.toString(), selected)
          }
          isFirst={index === 0}
          isLast={index === clickcrates.length - 1}
          allSelected={allSelected}
          isSelected={selectedClickcrates.includes(clickcrate.clickcrateId)}
        />
      ))}
    </div>
  );
}

function ClickCratePosCard({
  clickcrateId,
  clickcrate,
  onSelect,
  isFirst,
  isLast,
  allSelected,
  isSelected,
}: {
  clickcrateId: PublicKey;
  clickcrate: ClickCrate;
  onSelect: (clickcrateId: PublicKey, selected: boolean) => void;
  isFirst: boolean;
  isLast: boolean;
  allSelected: boolean;
  isSelected: boolean;
}) {
  const { publicKey } = useWallet();
  const { data: clickcrateDetails, isLoading } = useClickcrateDetails(
    clickcrateId,
    publicKey?.toString() || null
  );
  const [imageUrl, setImageUrl] = useState<string>("/placeholder-image.svg");

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showProductInfoModal, setShowProductInfoModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selected, setSelected] = useState(isSelected);

  const isUpdateClickCrateFormValid =
    clickcrate?.eligiblePlacementType !== null &&
    clickcrate?.eligibleProductCategory !== null &&
    clickcrate?.manager !== null;

  const isMakePurchaseFormValid =
    clickcrate?.product !== null && clickcrate?.product !== undefined;

  const isProductInfoFormValid =
    clickcrate?.product !== null &&
    clickcrate?.product !== undefined &&
    clickcrate?.clickcrateId !== undefined;

  const isShareFormValid =
    clickcrateDetails !== null && clickcrateDetails !== undefined;

  const toggleUpdateModal = () => {
    setShowUpdateModal(!showUpdateModal);
  };

  const [isProductInfoLoading, setIsProductInfoLoading] = useState(false);

  const toggleProductInfoModal = () => {
    if (clickcrate?.isActive === undefined || clickcrate?.isActive === false) {
      toast.error("Clickcrate not active");
      return;
    }
    setIsProductInfoLoading(true);
    if (
      clickcrate?.product &&
      clickcrate?.product !== undefined &&
      clickcrate?.clickcrateId &&
      clickcrate?.clickcrateId !== undefined
    ) {
      setShowProductInfoModal(!showProductInfoModal);
    } else {
      toast.error("Product info not found");
    }
    setIsProductInfoLoading(false);
  };

  const togglePurchaseModal = () => {
    if (clickcrate?.isActive === undefined || clickcrate?.isActive === false) {
      toast.error("Clickcrate not active");
      return;
    }
    if (clickcrate?.product && clickcrate?.product !== undefined) {
      setShowPurchaseModal(!showPurchaseModal);
    } else {
      toast.error("No product to purchase");
    }
  };

  const toggleShareModal = () => {
    if (clickcrate?.isActive === undefined || clickcrate?.isActive === false) {
      toast.error("Clickcrate not active");
      return;
    }
    if (clickcrate?.product && clickcrate?.product !== undefined) {
      setShowShareModal(!showShareModal);
    } else {
      toast.error("No product in ClickCrate");
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSelected = e.target.checked;
    setSelected(newSelected);
    onSelect(clickcrateId, newSelected);
  };

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(clickcrateId.toString());
      toast.success("ID copied to clipboard");
    } catch (err) {
      console.error("Failed to copy ID:", err);
      toast.error("Failed to copy ID");
    }
  };

  useEffect(() => {
    const fetchImageUrl = async () => {
      if (clickcrateDetails?.collection.content.json_uri) {
        try {
          const response = await fetch(
            clickcrateDetails.collection.content.json_uri
          );
          const data = await response.json();
          console.log("Clickcrate data: ", data);
          console.log("Clickcrate image: ", data.image);

          setImageUrl(data.image || "/placeholder-image.svg");
        } catch (error) {
          console.error("Error fetching image URL:", error);
          setImageUrl("/placeholder-image.svg");
        }
      }
    };
    fetchImageUrl();
  }, [clickcrateDetails]);

  useEffect(() => {
    setSelected(isSelected);
  }, [isSelected]);

  useEffect(() => {
    setSelected(allSelected);
  }, [allSelected]);

  if (!publicKey) {
    return <p>Connect your wallet</p>;
  }

  return isLoading ? (
    <div className="flex justify-center w-[100%] p-4">
      <span className="loading loading-spinner loading-sm"></span>
    </div>
  ) : (
    <div>
      <div
        className={`px-4 py-2 ${!isFirst ? "border-t-0" : ""} ${
          !isLast ? "border-b-2" : ""
        } border-quaternary`}
      >
        <div className="flex flex-row justify-start items-center w-[100%]">
          <div className="flex flex-row w-[3%]">
            <input
              type="checkbox"
              checked={selected}
              onChange={handleSelectChange}
              className="checkbox checkbox-xs bg-quaternary border-quaternary rounded-sm"
            />
          </div>
          <div className="flex flex-row w-[4%]">
            <Image
              src={imageUrl}
              alt="product image"
              width={30}
              height={30}
              unoptimized
            />{" "}
          </div>
          <div className="flex flex-row w-[10%] items-center">
            <p className="text-start font-normal text-xs mr-2">
              <ExplorerLink
                path={`account/${clickcrateId}`}
                label={ellipsify(clickcrateId.toString())}
                className="font-normal underline cursor-pointer"
              />
            </p>
            <button
              onClick={handleCopyId}
              className="btn btn-ghost btn-xs p-0"
              aria-label="Copy ID to clipboard"
            >
              <IconClipboard size={16} className="text-white" />
            </button>
          </div>
          <div className="flex flex-row w-[10%]">
            <p className="text-start font-normal text-xs">
              {clickcrateDetails?.collection.ownership.owner ? (
                <ExplorerLink
                  label={ellipsify(
                    clickcrateDetails.collection.ownership.owner
                  )}
                  path={`address/${clickcrateDetails.collection.ownership.owner}`}
                  className="font-normal underline cursor-pointer"
                />
              ) : (
                "NA"
              )}
            </p>
          </div>
          <div className="flex flex-row w-[8%]">
            <p className="text-start font-normal text-xs">
              {!clickcrate.isActive ? "Inactive" : "Active"}
            </p>
          </div>
          <div className="flex flex-row w-[12%]">
            <p className="text-start font-normal text-xs">
              {formatPlacementType(clickcrate.eligiblePlacementType) || "NA"}
            </p>
          </div>
          <div className="flex flex-row w-[13%]">
            <p className="text-start font-normal text-xs">
              {formatProductCategory(clickcrate.eligibleProductCategory) ||
                "NA"}
            </p>
          </div>
          <div className="flex flex-row w-[10%]">
            <p
              className={`text-start font-normal text-xs ${
                clickcrate.product && "underline cursor-pointer"
              }`}
              onClick={toggleProductInfoModal}
            >
              {clickcrate.product ? ellipsify(clickcrate.product) : "None"}
            </p>
          </div>
          <div className="flex flex-row w-[10%] justify-end">
            <p className="text-end font-normal text-xs">
              {/* {clickcrate.product ? (
                <ExplorerLink
                  label={ellipsify(clickcrate.product)}
                  path={`address/${clickcrate.product}`}
                  className="font-normal underline cursor-pointer"
                />
              ) : (
                "NA"
              )} */}
              {"NA"}
            </p>
          </div>
          <div className="flex flex-row w-[20%] justify-end">
            <button
              className="btn btn-xs btn-mini w-[30%] flex flex-row items-center justify-center m-0 p-0 gap-[0.25em]"
              onClick={toggleUpdateModal}
              style={{ fontSize: "12px", border: "none" }}
            >
              <IconEdit className="m-0 p-0" size={12} />
              Edit
            </button>
            <button
              className="btn btn-xs btn-mini w-[30%] flex flex-row items-center justify-center m-0 p-0 gap-[0.25em]"
              onClick={togglePurchaseModal}
              style={{ fontSize: "12px", border: "none" }}
            >
              <IconShoppingCartFilled className="m-0 p-0" size={12} />
              Buy
            </button>
            <button
              className="btn btn-xs btn-mini w-[30%] flex flex-row items-center justify-center m-0 p-0 gap-[0.25em]"
              onClick={toggleShareModal}
              style={{ fontSize: "12px", border: "none" }}
            >
              <IconLink className="m-0 p-0" size={12} />
              Share
            </button>
          </div>
        </div>
      </div>
      {showUpdateModal && (
        <ClickCratePosUpdateModal
          show={showUpdateModal}
          onClose={toggleUpdateModal}
          currentClickcrateId={new PublicKey(clickcrateId)}
          isUpdateClickCrateFormValid={isUpdateClickCrateFormValid}
        />
      )}
      {showPurchaseModal && clickcrate?.product && (
        <ClickCratePosPurchaseModal
          show={showPurchaseModal}
          onClose={togglePurchaseModal}
          currentClickcrateId={new PublicKey(clickcrateId)}
          currentProductId={new PublicKey(clickcrate.product)}
          isMakePurchaseFormValid={isMakePurchaseFormValid}
        />
      )}
      {showProductInfoModal && clickcrate?.product && !isProductInfoLoading && (
        <ClickCratePosProductInfoModal
          show={showProductInfoModal}
          onClose={toggleProductInfoModal}
          currentClickcrateId={new PublicKey(clickcrateId)}
          currentProductId={new PublicKey(clickcrate.product)}
          isProductInfoFormValid={isProductInfoFormValid}
        />
      )}
      {showShareModal && clickcrateDetails && (
        <ClickCratePosShareModal
          show={showShareModal}
          onClose={toggleShareModal}
          currentClickcrateId={new PublicKey(clickcrateId)}
          currentClickcrate={clickcrate}
          isShareFormValid={isShareFormValid}
        />
      )}
    </div>
  );
}

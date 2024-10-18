import React, { useState, useEffect } from "react";
import { PublicKey } from "@solana/web3.js";
import { ellipsify } from "@/utils/ellipsify";
import { ExplorerLink } from "@/components/ExplorerLink";
import { ProductListing } from "@/types";
import {
  IconEdit,
  IconShoppingCartFilled,
  IconClipboard,
} from "@tabler/icons-react";
import toast from "react-hot-toast";
import { formatOrigin, formatProductCategory } from "@/utils/conversions";
import { useWallet } from "@solana/wallet-adapter-react";
import { useProductListingDetails } from "../hooks/useProductListingDetails";
import Image from "next/image";
import { ProductListingUpdateModal } from "./ProductListingUpdateModal";
import { ProductListingPlaceModal } from "./ProductListingPlaceModal";

interface ProductListingsListProps {
  listings: ProductListing[];
  onSelect: (productListingId: string, selected: boolean) => void;
  selectedListings: string[];
  onStartPlacing: () => void;
  onFinishPlacing: () => void;
}

export default function ProductListingsList({
  listings,
  onSelect,
  selectedListings,
  onStartPlacing,
  onFinishPlacing,
}: ProductListingsListProps) {
  const [allSelected, setAllSelected] = useState(false);

  useEffect(() => {
    setAllSelected(selectedListings.length === listings.length);
  }, [selectedListings, listings]);

  const handleAllSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isSelected = e.target.checked;
    setAllSelected(isSelected);
    listings.forEach((listing) => {
      onSelect(listing.productListingId, isSelected);
    });
  };

  return (
    <div className="w-[100%] bg-background border-2 border-quaternary rounded-lg">
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
          <p className="text-start font-extrabold text-xs">STATUS</p>
        </div>
        <div className="flex flex-row w-[10%]">
          <p className="text-start font-extrabold text-xs">CATEGORY</p>
        </div>
        <div className="flex flex-row items-center w-[10%]">
          <p className="text-start font-extrabold text-xs">ORIGIN</p>
        </div>
        <div className="flex flex-row w-[13%]">
          <p className="text-start font-extrabold text-xs">CURRENT PLACEMENT</p>
        </div>
        <div className="flex flex-row w-[10%] justify-end">
          <p className="text-end font-extrabold text-xs">UNIT PRICE</p>
        </div>
        <div className="flex flex-row w-[10%] justify-end">
          <p className="text-end font-extrabold text-xs">STOCK</p>
        </div>
        <div className="flex flex-row w-[20%]"></div>
      </div>
      {listings.map((listing, index) => (
        <ProductListingCard
          key={listing.productListingId}
          listing={listing}
          onSelect={onSelect}
          isFirst={index === 0}
          isLast={index === listings.length - 1}
          allSelected={allSelected}
          isSelected={selectedListings.includes(listing.productListingId)}
          onStartPlacing={onStartPlacing}
          onFinishPlacing={onFinishPlacing}
        />
      ))}
    </div>
  );
}

function ProductListingCard({
  listing,
  onSelect,
  isFirst,
  isLast,
  allSelected,
  isSelected,
  onStartPlacing,
  onFinishPlacing,
}: {
  listing: ProductListing;
  onSelect: (productListingId: string, selected: boolean) => void;
  isFirst: boolean;
  isLast: boolean;
  allSelected: boolean;
  isSelected: boolean;
  onStartPlacing: () => void;
  onFinishPlacing: () => void;
}) {
  const { publicKey } = useWallet();
  const { data: listingDetails, isLoading } = useProductListingDetails(
    listing.productListingId,
    publicKey?.toString() || null
  );
  const [imageUrl, setImageUrl] = useState<string>("/placeholder-image.svg");
  const [selected, setSelected] = useState(isSelected);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showPlaceModal, setShowPlaceModal] = useState(false);

  useEffect(() => {
    setSelected(isSelected);
  }, [isSelected]);

  useEffect(() => {
    setSelected(allSelected);
  }, [allSelected]);

  useEffect(() => {
    const fetchImageUrl = async () => {
      if (listingDetails?.collection.content.json_uri) {
        try {
          const response = await fetch(
            listingDetails.collection.content.json_uri
          );
          const data = await response.json();
          console.log("Listing data: ", data);
          console.log("Listing image: ", data.image);

          setImageUrl(data.image || "/placeholder-image.svg");
        } catch (error) {
          console.error("Error fetching image URL:", error);
          setImageUrl("/placeholder-image.svg");
        }
      }
    };
    fetchImageUrl();
  }, [listingDetails]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSelected = e.target.checked;
    setSelected(newSelected);
    onSelect(listing.productListingId, newSelected);
  };

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(listing.productListingId);
      toast.success("ID copied to clipboard");
    } catch (err) {
      console.error("Failed to copy ID:", err);
      toast.error("Failed to copy ID");
    }
  };

  const toggleUpdateModal = () => {
    setShowUpdateModal(!showUpdateModal);
  };

  const togglePlaceModal = () => {
    if (listing.clickcratePos) {
      toast.error("Product already placed");
    } else if (listing.isActive) {
      setShowPlaceModal(!showPlaceModal);
      if (!showPlaceModal) {
        onStartPlacing();
      } else {
        onFinishPlacing();
      }
    } else {
      toast.error("Product listing is not active");
    }
  };

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
            <Image src={imageUrl} alt="product image" width={30} height={30} />
          </div>
          <div className="flex flex-row w-[10%] items-center">
            <p className="text-start font-normal text-xs mr-2">
              <ExplorerLink
                path={`account/${listing.productListingId}`}
                label={ellipsify(listing.productListingId)}
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
              {listing.isActive ? "Active" : "Inactive"}
            </p>
          </div>
          <div className="flex flex-row w-[10%]">
            <p className="text-start font-normal text-xs">
              {listing.productCategory
                ? formatProductCategory(listing.productCategory)
                : "N/A"}
            </p>
          </div>
          <div className="flex flex-row w-[10%]">
            <p className="text-start font-normal text-xs">
              {listing.origin ? formatOrigin(listing.origin) : "N/A"}
            </p>
          </div>
          <div className="flex flex-row w-[13%]">
            <p className="text-start font-normal text-xs">
              {listing.clickcratePos ? (
                <ExplorerLink
                  label={ellipsify(listing.clickcratePos)}
                  path={`address/${listing.clickcratePos}`}
                  className="font-normal underline cursor-pointer"
                />
              ) : (
                "Not placed"
              )}
            </p>
          </div>
          <div className="flex flex-row w-[10%] justify-end">
            <p className="text-end font-normal text-xs">
              {listing.price !== null
                ? `${listing.price / 1_000_000_000} SOL`
                : "NA"}
            </p>
          </div>
          <div className="flex flex-row w-[10%] justify-end">
            <p className="text-end font-normal text-xs">
              {listing.inStock !== undefined ? listing.inStock : "N/A"}
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
              onClick={togglePlaceModal}
              style={{ fontSize: "12px", border: "none" }}
            >
              <IconShoppingCartFilled className="m-0 p-0" size={12} />
              Place
            </button>
          </div>
        </div>
      </div>
      {showUpdateModal && (
        <ProductListingUpdateModal
          show={showUpdateModal}
          onClose={toggleUpdateModal}
          currentProductListingId={listing.productListingId}
          currentManager={listing.manager}
          currentPlacementType={listing.placementType}
          currentProductCategory={listing.productCategory}
          currentPrice={listing.price!}
          isUpdateProductListingFormValid={true} // You might want to add logic to determine this
        />
      )}
      {showPlaceModal && (
        <ProductListingPlaceModal
          show={showPlaceModal}
          onClose={togglePlaceModal}
          currentProductListingId={listing.productListingId}
          isPlaceProductListingFormValid={
            listing.isActive && !listing.clickcratePos
          }
          onFinishPlacing={onFinishPlacing}
        />
      )}
    </div>
  );
}

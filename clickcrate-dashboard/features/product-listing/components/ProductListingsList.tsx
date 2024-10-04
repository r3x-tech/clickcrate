import React, { ChangeEvent, useState } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { ellipsify } from "@/utils/ellipsify";
import { ExplorerLink } from "@/components/ExplorerLink";
import { ProductListing } from "@/types";
import {
  IconRefresh,
  IconEdit,
  IconShoppingCartFilled,
} from "@tabler/icons-react";
import toast from "react-hot-toast";
import { formatOrigin, formatProductCategory } from "@/utils/conversions";

interface ProductListingsListProps {
  listings: ProductListing[];
  onSelect: (productListingId: string, selected: boolean) => void;
  selectedListings: string[];
  // refetch: () => Promise<void>;
}

export default function ProductListingsList({
  listings,
  onSelect,
  selectedListings,
}: // refetch,
ProductListingsListProps) {
  const [allSelected, setAllSelected] = useState(false);

  // const handleRefetch = async () => {
  //   try {
  //     await refetch();
  //     toast.success("Product listings refreshed");
  //   } catch (error) {
  //     toast.error("Failed to refresh product listings");
  //   }
  // };

  const handleAllSelectChange = (e: ChangeEvent<HTMLInputElement>) => {
    const isSelected = e.target.checked;
    setAllSelected(isSelected);
    listings.forEach((listing) => {
      onSelect(listing.productListingId, isSelected);
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
        <div className="flex flex-row w-[5%]">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={handleAllSelectChange}
            className="checkbox checkbox-xs bg-quaternary border-quaternary rounded-sm"
          />
        </div>
        <div className="flex flex-row w-[10%]">
          <p className="text-start font-bold text-xs">ACCOUNT</p>
        </div>
        <div className="flex flex-row w-[10%]">
          <p className="text-start font-bold text-xs">ID</p>
        </div>
        <div className="flex flex-row w-[10%]">
          <p className="text-start font-bold text-xs">STATUS</p>
        </div>
        <div className="flex flex-row items-center w-[10%]">
          <p className="text-start font-bold text-xs">CATEGORY</p>
        </div>
        <div className="flex flex-row w-[10%]">
          <p className="text-start font-bold text-xs">ORIGIN</p>
        </div>
        <div className="flex flex-row w-[13%]">
          <p className="text-start font-bold text-xs">CURRENT PLACEMENT</p>
        </div>
        <div className="flex flex-row w-[10%] justify-end">
          <p className="text-end font-bold text-xs">UNIT PRICE</p>
        </div>
        <div className="flex flex-row w-[10%] justify-end">
          <p className="text-end font-bold text-xs">STOCK</p>
        </div>
        <div className="flex flex-row w-[10%]"></div>
      </div>
      {listings.map((listing, index) => (
        <div
          key={listing.productListingId}
          className={`px-4 py-2 ${
            index !== listings.length - 1 ? "border-b-2 border-quaternary" : ""
          }`}
        >
          <div className="flex flex-row justify-start items-center w-[100%]">
            <div className="flex flex-row w-[5%]">
              <input
                type="checkbox"
                checked={selectedListings.includes(listing.productListingId)}
                onChange={(e) =>
                  onSelect(listing.productListingId, e.target.checked)
                }
                className="checkbox checkbox-xs bg-quaternary border-quaternary rounded-sm"
              />
            </div>
            <div className="flex flex-row w-[10%]">
              <p className="text-start font-normal text-xs">
                <ExplorerLink
                  path={`account/${listing.productListingId}`}
                  label={ellipsify(listing.productListingId)}
                  className="font-normal underline cursor-pointer"
                />
              </p>
            </div>
            <div className="flex flex-row w-[10%]">
              <p className="text-start font-normal text-xs">
                <ExplorerLink
                  label={ellipsify(listing.productListingId)}
                  path={`address/${listing.productListingId}`}
                  className="font-normal underline cursor-pointer"
                />
              </p>
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
                  ? `${listing.price / LAMPORTS_PER_SOL} SOL`
                  : "NA"}
              </p>
            </div>
            <div className="flex flex-row w-[10%] justify-end">
              <p className="text-end font-normal text-xs">
                {listing.inStock !== undefined ? listing.inStock : "N/A"}
              </p>
            </div>
            <div className="flex flex-row w-[10%] ml-[2%]">
              <button
                className="btn btn-xs btn-mini w-[50%] flex flex-row items-center justify-center m-0 p-0 gap-[0.25em]"
                style={{ fontSize: "12px", border: "none" }}
              >
                <IconEdit size={12} />
                Edit
              </button>
              <button
                className="btn btn-xs btn-mini w-[50%] flex flex-row items-center justify-center m-0 p-0 gap-[0.25em]"
                style={{ fontSize: "12px", border: "none" }}
              >
                <IconShoppingCartFilled size={12} />
                Place
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

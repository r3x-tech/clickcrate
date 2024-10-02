import { ProductListingState } from "@/types";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { ellipsify } from "@/utils/ellipsify";
import { ExplorerLink } from "@/components/ExplorerLink";

type Props = {
  listings: ProductListingState[];
};

export default function ProductListingsList({ listings }: Props) {
  return (
    <div className="w-[100%] bg-background border-2 border-quaternary rounded-lg">
      <div className="flex flex-row justify-start items-center w-[100%] px-4 pb-2 pt-2 border-b-2 border-quaternary">
        <div className="flex flex-row w-[5%]">
          <p className="text-start font-bold text-xs"></p>
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
      {/* {listings.map((listing) => (
        <div
          key={listing.id.toString()}
          className="px-4 py-2 border-b-2 border-quaternary"
        >
          <div className="flex flex-row justify-start items-center w-[100%]">
            <div className="flex flex-row w-[5%]">
              <input
                type="checkbox"
                className="checkbox checkbox-xs bg-quaternary border-quaternary rounded-sm"
              />
            </div>
            <div className="flex flex-row w-[10%]">
              <p className="text-start font-extralight text-xs">
                <ExplorerLink
                  path={`account/${listing.id}`}
                  label={ellipsify(listing.id.toString())}
                  className="font-extralight underline cursor-pointer"
                />
              </p>
            </div>
            <div className="flex flex-row w-[10%]">
              <p className="text-start font-extralight text-xs">
                <ExplorerLink
                  label={ellipsify(listing.id.toString())}
                  path={`address/${listing.id}`}
                  className="font-extralight underline cursor-pointer"
                />
              </p>
            </div>
            <div className="flex flex-row w-[10%]">
              <p className="text-start font-extralight text-xs">
                {listing.isActive ? "Active" : "Inactive"}
              </p>
            </div>
            <div className="flex flex-row w-[10%]">
              <p className="text-start font-extralight text-xs">
                {listing.productCategory}
              </p>
            </div>
            <div className="flex flex-row w-[10%]">
              <p className="text-start font-extralight text-xs">
                {listing.origin}
              </p>
            </div>
            <div className="flex flex-row w-[13%]">
              <p className="text-start font-extralight text-xs">
                {listing.clickcratePos ? (
                  <ExplorerLink
                    label={ellipsify(listing.clickcratePos.toString())}
                    path={`address/${listing.clickcratePos}`}
                    className="font-extralight underline cursor-pointer"
                  />
                ) : (
                  "Not placed"
                )}
              </p>
            </div>
            <div className="flex flex-row w-[10%] justify-end">
              <p className="text-end font-extralight text-xs">
                {listing.price !== undefined && listing.clickcratePos !== null
                  ? `${listing.price / LAMPORTS_PER_SOL} SOL`
                  : "NA"}
              </p>
            </div>
            <div className="flex flex-row w-[10%] justify-end">
              <p className="text-end font-extralight text-xs">
                {listing.inStock !== undefined
                  ? listing.inStock.toString()
                  : "NA"}
              </p>
            </div>
            <div className="flex flex-row w-[10%] ml-[2%]">
              <button
                className="btn btn-xs btn-mini w-[50%] flex flex-row items-center justify-center m-0 p-0 gap-[0.25em]"
                style={{ fontSize: "12px", border: "none" }}
              >
                Edit
              </button>
              <button
                className="btn btn-xs btn-mini w-[50%] flex flex-row items-center justify-center m-0 p-0 gap-[0.25em]"
                style={{ fontSize: "12px", border: "none" }}
              >
                Place
              </button>
            </div>
          </div>
        </div>
      ))} */}
    </div>
  );
}

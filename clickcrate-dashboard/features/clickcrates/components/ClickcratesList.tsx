import React, { useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { ellipsify } from "@/utils/ellipsify";
import { ExplorerLink } from "@/components/ExplorerLink";
import { ClickCrate } from "@/types";
import {
  IconRefresh,
  IconEdit,
  IconShoppingCartFilled,
} from "@tabler/icons-react";
import toast from "react-hot-toast";

interface ClickcratesListProps {
  clickcrates: ClickCrate[];
  onSelect: (clickcrateId: string, selected: boolean) => void;
  selectedClickCrates: string[];
  onRefetch: () => Promise<void>;
}

export function ClickcratesList({
  clickcrates,
  onSelect,
  selectedClickCrates,
  onRefetch,
}: ClickcratesListProps) {
  const [allSelected, setAllSelected] = useState(false);

  const handleRefetch = async () => {
    try {
      await onRefetch();
      toast.success("ClickCrates refreshed");
    } catch (error) {
      toast.error("Failed to refresh ClickCrates");
    }
  };

  const handleAllSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isSelected = e.target.checked;
    setAllSelected(isSelected);
    clickcrates.forEach((clickcrate) => {
      onSelect(clickcrate.clickcrateId, isSelected);
    });
  };

  return (
    <div className="w-[100%] bg-background border-2 border-quaternary rounded-lg">
      <div className="flex justify-end mb-2">
        <button className="btn btn-ghost btn-sm" onClick={handleRefetch}>
          <IconRefresh size={18} />
          Refresh
        </button>
      </div>
      <div className="flex flex-row justify-start items-center w-[100%] px-4 pb-2 pt-2 border-b-2 border-quaternary">
        <div className="flex flex-row w-[5%]">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={handleAllSelectChange}
            className="checkbox checkbox-xs bg-quaternary border-quaternary rounded-sm"
          />
        </div>
        <div className="flex flex-row w-[15%]">
          <p className="text-start font-bold text-xs">CLICKCRATE ID</p>
        </div>
        <div className="flex flex-row w-[15%]">
          <p className="text-start font-bold text-xs">OWNER</p>
        </div>
        <div className="flex flex-row w-[10%]">
          <p className="text-start font-bold text-xs">STATUS</p>
        </div>
        <div className="flex flex-row items-center w-[15%]">
          <p className="text-start font-bold text-xs">PLACEMENT TYPE</p>
        </div>
        <div className="flex flex-row w-[15%]">
          <p className="text-start font-bold text-xs">PRODUCT CATEGORY</p>
        </div>
        <div className="flex flex-row w-[15%]">
          <p className="text-start font-bold text-xs">PRODUCT</p>
        </div>
        <div className="flex flex-row w-[10%]"></div>
      </div>
      {clickcrates.map((clickcrate) => (
        <div
          key={clickcrate.clickcrateId}
          className="px-4 py-2 border-b-2 border-quaternary"
        >
          <div className="flex flex-row justify-start items-center w-[100%]">
            <div className="flex flex-row w-[5%]">
              <input
                type="checkbox"
                checked={selectedClickCrates.includes(clickcrate.clickcrateId)}
                onChange={(e) =>
                  onSelect(clickcrate.clickcrateId, e.target.checked)
                }
                className="checkbox checkbox-xs bg-quaternary border-quaternary rounded-sm"
              />
            </div>
            <div className="flex flex-row w-[15%]">
              <p className="text-start font-extralight text-xs">
                <ExplorerLink
                  path={`account/${clickcrate.clickcrateId}`}
                  label={ellipsify(clickcrate.clickcrateId)}
                  className="font-extralight underline cursor-pointer"
                />
              </p>
            </div>
            <div className="flex flex-row w-[15%]">
              <p className="text-start font-extralight text-xs">
                <ExplorerLink
                  path={`account/${clickcrate.owner}`}
                  label={ellipsify(clickcrate.owner)}
                  className="font-extralight underline cursor-pointer"
                />
              </p>
            </div>
            <div className="flex flex-row w-[10%]">
              <p className="text-start font-extralight text-xs">
                {clickcrate.isActive ? "Active" : "Inactive"}
              </p>
            </div>
            <div className="flex flex-row w-[15%]">
              <p className="text-start font-extralight text-xs">
                {clickcrate.eligiblePlacementType}
              </p>
            </div>
            <div className="flex flex-row w-[15%]">
              <p className="text-start font-extralight text-xs">
                {clickcrate.eligibleProductCategory}
              </p>
            </div>
            <div className="flex flex-row w-[15%]">
              <p className="text-start font-extralight text-xs">
                {clickcrate.product ? (
                  <ExplorerLink
                    label={ellipsify(clickcrate.product)}
                    path={`address/${clickcrate.product}`}
                    className="font-extralight underline cursor-pointer"
                  />
                ) : (
                  "No product"
                )}
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

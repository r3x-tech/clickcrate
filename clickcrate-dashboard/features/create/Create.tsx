import React, { useState } from "react";
import { IconRefresh, IconClipboard } from "@tabler/icons-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { RecentCreation } from "@/types";
import { useRecentCreations } from "./hooks/useRecentCreations";
import { ExplorerLink } from "@/components/ExplorerLink";
import { ellipsify } from "@/components/Layout";
import { CreateModal } from "./components/CreateModal";

export default function Create() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    data: recentCreations,
    isLoading,
    error,
    refetch,
  } = useRecentCreations();
  const [isRefetching, setIsRefetching] = useState(false);

  const handleCreateNew = () => {
    setIsModalOpen(true);
  };

  const handleRefetch = async () => {
    setIsRefetching(true);

    try {
      await refetch();
      toast.success("Recent creations refreshed");
    } catch (error) {
      toast.error("Failed to refresh recent creations");
    }
    setIsRefetching(false);
  };

  const handleCopyMintAddress = async (mintAddress: string) => {
    try {
      await navigator.clipboard.writeText(mintAddress);
      toast.success("Copied ID to clipboard");
    } catch (err) {
      console.error("Failed to copy mint address:", err);
      toast.error("Failed to copy mint address");
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-4 mt-8">
        <div className="flex items-end m-0 p-0">
          <h1 className="text-lg font-bold mr-2">Recently Created</h1>
          <button
            className="btn btn-ghost btn-sm text-white bg-transparent hover:bg-transparent p-2"
            onClick={handleRefetch}
            disabled={isLoading || isRefetching}
          >
            <IconRefresh
              size={21}
              className={`refresh-icon ${
                isLoading || isRefetching ? "animate-spin-counterclockwise" : ""
              }`}
            />
          </button>
        </div>
        <div className="flex items-end space-x-4 m-0 p-0">
          <button
            onClick={handleCreateNew}
            className="btn btn-xs lg:btn-sm btn-primary w-[10rem] py-3 font-light"
          >
            Create New
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center w-full p-6 space-y-2">
          <span className="loading loading-spinner loading-md"></span>
          <p className="font-body text-xs font-semibold">LOADING</p>
        </div>
      )}

      {error && (
        <div className="mb-20 w-full bg-background border-2 border-quaternary rounded-lg">
          <p className="text-sm font-light text-center p-4">
            Failed to fetch recent creations. Please try again.
          </p>
        </div>
      )}

      {!isLoading &&
        !error &&
        recentCreations &&
        recentCreations.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 max-h-[78vh] overflow-y-auto">
            {recentCreations.map((creation: RecentCreation) => (
              <div
                key={creation.mintAddress}
                className="bg-tertiary rounded-lg p-4 flex flex-col items-center"
              >
                <img
                  src={creation.image}
                  alt={creation.name}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <div className="flex flex-col items-start justify-center w-full py-2">
                  <div className="flex w-full justify-between items-center">
                    <span
                      className={`text-xs ${
                        creation.type == "ClickCrate"
                          ? "bg-primary"
                          : creation.type == "Product"
                          ? "bg-purple"
                          : "bg-pink"
                      }  rounded-full px-2`}
                    >
                      {creation.type == "Product Listing"
                        ? "Listing"
                        : creation.type}
                    </span>
                    <div className="flex items-center text-xs">
                      <ExplorerLink
                        path={`account/${creation.mintAddress}`}
                        label={ellipsify(creation.mintAddress.toString())}
                      />
                      <button
                        onClick={() =>
                          handleCopyMintAddress(creation.mintAddress)
                        }
                        className="btn btn-ghost btn-xs p-0"
                        aria-label="Copy mint address to clipboard"
                      >
                        <IconClipboard size={16} className="text-white" />
                      </button>
                    </div>
                  </div>

                  <span className="text-sm font-semibold mt-2 text-start">
                    {creation.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      {!isLoading &&
        !error &&
        (!recentCreations || recentCreations.length === 0) && (
          <div className="mb-20 w-full bg-background border-2 border-quaternary rounded-lg">
            <p className="text-sm font-light text-center p-4">
              No recent creations found. Try creating a new one!
            </p>
          </div>
        )}

      <CreateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

import React, { useState } from "react";
import { CreateProductModal } from "./components/CreateProductModal";
import { IconRefresh, IconClipboard } from "@tabler/icons-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { RecentCreation } from "@/types";
import { useRecentCreations } from "./hooks/useRecentCreations";
import { ExplorerLink } from "@/components/ExplorerLink";
import { ellipsify } from "@/components/Layout";

export default function Create() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    data: recentCreations,
    isLoading,
    error,
    refetch,
  } = useRecentCreations();

  const handleCreateNew = () => {
    setIsModalOpen(true);
  };

  const handleRefetch = async () => {
    try {
      await refetch();
      toast.success("Recent creations refreshed");
    } catch (error) {
      toast.error("Failed to refresh recent creations");
    }
  };

  const handleCopyMintAddress = async (mintAddress: string) => {
    try {
      await navigator.clipboard.writeText(mintAddress);
      toast.success("Mint address copied to clipboard");
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
          >
            <IconRefresh size={21} />
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 max-h-[70vh] overflow-y-auto">
            {recentCreations.map((creation: RecentCreation) => (
              <div
                key={creation.mintAddress}
                className="bg-quaternary rounded-lg p-4 flex flex-col items-center"
              >
                <img
                  src={creation.image}
                  alt={creation.name}
                  className="w-full h-40 object-cover rounded-lg mb-2"
                />
                <div className="flex flex-col items-center h-full w-full justify-center">
                  <div className="flex items-center">
                    <ExplorerLink
                      path={`account/${creation.mintAddress}`}
                      label={ellipsify(creation.mintAddress.toString())}
                    />
                    <button
                      onClick={() =>
                        handleCopyMintAddress(creation.mintAddress)
                      }
                      className="btn btn-ghost btn-xs p-0 ml-1"
                      aria-label="Copy mint address to clipboard"
                    >
                      <IconClipboard size={16} className="text-white" />
                    </button>
                  </div>
                  <span className="text-sm font-semibold mt-1 text-center">
                    {creation.name}
                  </span>
                  <span className="text-xs mt-1">{creation.type}</span>
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

      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

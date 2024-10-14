import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useOwnedProductListings } from "./hooks/useOwnedProductListings";
import { ProductListingRegister } from "./components/ProductListingRegister";
import ProductListingsList from "./components/ProductListingsList";
import toast from "react-hot-toast";
import { WalletButton } from "@/solana/solana-provider";
import { IconCaretDownFilled, IconRefresh } from "@tabler/icons-react";
import { useActivateProductListing } from "./hooks/useActivateProductListing";
import { useDeactivateProductListing } from "./hooks/useDeactivateProductListing";

export default function ProductListings() {
  const { publicKey } = useWallet();
  const {
    data: listings,
    isLoading,
    error,
    refetch,
  } = useOwnedProductListings(
    publicKey ? publicKey.toBase58() : null,
    publicKey ? publicKey.toBase58() : null
  );
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedListings, setSelectedListings] = useState<string[]>([]);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);

  const activateProductListing = useActivateProductListing();
  const deactivateProductListing = useDeactivateProductListing();

  const handleListingSelect = (productListingId: string, selected: boolean) => {
    setSelectedListings((prev) =>
      selected
        ? [...prev, productListingId]
        : prev.filter((id) => id !== productListingId)
    );
  };

  const handleRefetch = async () => {
    setIsRefetching(true);
    try {
      await refetch();
      toast.success("Product listings refreshed");
    } catch (error) {
      toast.error("Failed to refresh product listings");
    }
    setIsRefetching(false);
  };

  const handleActivateListings = async () => {
    for (const listingId of selectedListings) {
      try {
        await activateProductListing.mutateAsync(listingId);
        toast.success(`Product listing activated successfully`);
      } catch (error) {
        console.error(`Error activating product listing ${listingId}:`, error);
        toast.error(`Failed to activate product listing ${listingId}`);
      }
    }
    setSelectedListings([]);
    setShowActionsMenu(false);
    refetch();
  };

  const handleDeactivateListings = async () => {
    for (const listingId of selectedListings) {
      try {
        await deactivateProductListing.mutateAsync(listingId);
        toast.success(`Product listing deactivated successfully`);
      } catch (error) {
        console.error(
          `Error deactivating product listing ${listingId}:`,
          error
        );
        toast.error(`Failed to deactivate product listing ${listingId}`);
      }
    }
    setSelectedListings([]);
    setShowActionsMenu(false);
    refetch();
  };

  if (!publicKey) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="hero py-[64px]">
          <div className="hero-content text-center">
            <WalletButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-4 mt-8">
        <div className="flex items-end m-0 p-0">
          <h1 className="text-lg font-bold mr-2">My Product Listings</h1>
          <button
            className="btn btn-ghost btn-sm text-white bg-transparent hover:bg-transparent p-2"
            onClick={handleRefetch}
            disabled={isRefetching || !publicKey}
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
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-xs lg:btn-sm btn-outline w-[10rem] py-3 font-light"
              onClick={() => setShowActionsMenu(!showActionsMenu)}
            >
              More Actions
              <IconCaretDownFilled
                className={`m-0 p-0 ${showActionsMenu ? "icon-flip" : ""}`}
                size={12}
              />
            </label>
            {showActionsMenu && (
              <ul
                tabIndex={0}
                className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-[10rem] mt-4 gap-2"
                style={{ border: "2px solid white" }}
              >
                <li>
                  <button
                    className="btn btn-sm btn-ghost hover:bg-quaternary"
                    onClick={() => {
                      handleActivateListings();
                      setShowActionsMenu(false);
                    }}
                  >
                    Activate
                  </button>
                </li>
                <li>
                  <button
                    className="btn btn-sm btn-ghost hover:bg-quaternary"
                    onClick={() => {
                      handleDeactivateListings();
                      setShowActionsMenu(false);
                    }}
                  >
                    Deactivate
                  </button>
                </li>
              </ul>
            )}
          </div>
          <button
            className="btn btn-xs lg:btn-sm btn-primary w-[10rem] py-3 font-light"
            onClick={() => setShowRegisterModal(true)}
          >
            Register
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
            Failed to fetch product listings. Please try again.
          </p>
        </div>
      )}

      {!isLoading && !error && listings && listings.length > 0 && (
        <ProductListingsList
          listings={listings}
          onSelect={handleListingSelect}
          selectedListings={selectedListings}
        />
      )}

      {!isLoading && !error && (!listings || listings.length === 0) && (
        <div className="mb-20 w-full bg-background border-2 border-quaternary rounded-lg">
          <p className="text-sm font-light text-center p-4">
            No product listings found. Try registering a new one!
          </p>
        </div>
      )}

      {showRegisterModal && (
        <ProductListingRegister
          show={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
        />
      )}
    </div>
  );
}

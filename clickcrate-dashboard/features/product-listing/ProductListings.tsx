import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useOwnedProductListings } from "./hooks/useOwnedProductListings";
import { ProductListingRegister } from "./components/ProductListingRegister";
import ProductListingsList from "./components/ProductListingsList";
import toast from "react-hot-toast";
import { UnifiedWalletButton } from "@jup-ag/wallet-adapter";

export default function ProductListings() {
  const { publicKey } = useWallet();
  const {
    data: listings,
    isLoading,
    error,
    refetch,
  } = useOwnedProductListings(publicKey);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedListings, setSelectedListings] = useState<string[]>([]);

  const handleListingSelect = (productListingId: string, selected: boolean) => {
    setSelectedListings((prev) =>
      selected
        ? [...prev, productListingId]
        : prev.filter((id) => id !== productListingId)
    );
  };

  const handleRefetch = async () => {
    try {
      await refetch();
      toast.success("Product listings refreshed");
    } catch (error) {
      toast.error("Failed to refresh product listings");
    }
  };

  if (!publicKey) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="hero py-[64px]">
          <div className="hero-content text-center">
            <UnifiedWalletButton />
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex justify-between items-center my-6">
          <h1 className="text-lg font-bold">My Product Listings</h1>
          <button
            className="btn btn-sm btn-primary py-2 px-4"
            onClick={() => setShowRegisterModal(true)}
          >
            Register
          </button>
        </div>
        <div className="flex flex-col items-center justify-center w-[100%] p-6 space-y-2">
          <span className="loading loading-spinner loading-md"></span>
          <p className="font-body text-xs font-semibold">LOADING</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="flex justify-between items-center my-6">
          <h1 className="text-lg  font-bold">My Product Listings</h1>
          <button
            className="btn btn-sm btn-primary py-2 px-4"
            onClick={() => setShowRegisterModal(true)}
          >
            Register
          </button>
        </div>
        <div className="mb-20 w-[100%] bg-background border-2 border-quaternary rounded-lg">
          <p className="text-sm font-light text-center p-4">
            Failed to fetch product listings. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center my-6">
        <h1 className="text-lg font-bold">My Product Listings</h1>
        <button
          className="btn btn-sm btn-primary py-2 px-4"
          onClick={() => setShowRegisterModal(true)}
        >
          Register
        </button>
      </div>

      <ProductListingsList
        listings={listings || []}
        onSelect={handleListingSelect}
        selectedListings={selectedListings}
        refetch={handleRefetch}
      />

      {showRegisterModal && (
        <ProductListingRegister
          show={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
        />
      )}
    </div>
  );
}

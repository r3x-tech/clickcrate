import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useOwnedClickcrates } from "./hooks/useOwnedClickcrates";
import { ClickcrateRegister } from "./components/ClickcrateRegister";
import { ClickcratesList } from "./components/ClickcratesList";
import toast from "react-hot-toast";
import { UnifiedWalletButton } from "@jup-ag/wallet-adapter";

export default function Clickcrates() {
  const { publicKey } = useWallet();
  const {
    data: clickcrates,
    isLoading,
    error,
    refetch,
  } = useOwnedClickcrates(publicKey);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedClickCrates, setSelectedClickCrates] = useState<string[]>([]);

  const handleClickcrateSelect = (clickcrateId: string, selected: boolean) => {
    setSelectedClickCrates((prev) =>
      selected
        ? [...prev, clickcrateId]
        : prev.filter((id) => id !== clickcrateId)
    );
  };

  const handleRefetch = async () => {
    try {
      await refetch();
      toast.success("ClickCrates refreshed");
    } catch (error) {
      toast.error("Failed to refresh ClickCrates");
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
          <h1 className="text-lg font-bold">My ClickCrates (POS)</h1>
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
          <h1 className="text-lg font-bold">My ClickCrates (POS)</h1>
          <button
            className="btn btn-sm btn-primary py-2 px-4"
            onClick={() => setShowRegisterModal(true)}
          >
            Register
          </button>
        </div>
        <div className="mb-20 w-[100%] bg-background border-2 border-quaternary rounded-lg">
          <p className="text-sm font-light text-center p-4">
            Failed to fetch ClickCrates. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center my-6">
        <h1 className="text-lg font-bold">My ClickCrates (POS)</h1>
        <button
          className="btn btn-sm btn-primary py-2 px-4"
          onClick={() => setShowRegisterModal(true)}
        >
          Register
        </button>
      </div>

      <ClickcratesList
        clickcrates={clickcrates || []}
        onSelect={handleClickcrateSelect}
        selectedClickCrates={selectedClickCrates}
        onRefetch={handleRefetch}
      />

      {showRegisterModal && (
        <ClickcrateRegister
          show={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
        />
      )}
    </div>
  );
}

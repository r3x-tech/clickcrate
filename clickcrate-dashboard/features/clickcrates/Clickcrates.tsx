import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useOwnedClickcrates } from "./hooks/useOwnedClickcrates";
import { ClickcrateRegister } from "./components/ClickcrateRegister";
import toast from "react-hot-toast";
import { WalletButton } from "@/solana/solana-provider";
import { IconCaretDownFilled, IconRefresh } from "@tabler/icons-react";
import { ClickcratesList } from "./components/ClickcratesList";
import { useActivateClickcrate } from "./hooks/useActivateClickcrate";
import { useDeactivateClickcrate } from "./hooks/useDeactivateClickcrate";

export default function Clickcrates() {
  const { publicKey } = useWallet();
  const {
    data: clickcrates,
    isLoading,
    error,
    refetch,
  } = useOwnedClickcrates(
    publicKey ? publicKey.toBase58() : null,
    publicKey ? publicKey.toBase58() : null
  );
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedClickcrates, setSelectedClickcrates] = useState<string[]>([]);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);

  const activateClickcrate = useActivateClickcrate();
  const deactivateClickcrate = useDeactivateClickcrate();

  const handleClickcrateSelect = (clickcrateId: string, selected: boolean) => {
    setSelectedClickcrates((prev) =>
      selected
        ? [...prev, clickcrateId]
        : prev.filter((id) => id !== clickcrateId)
    );
  };

  const handleRefetch = async () => {
    try {
      setIsRefetching(true);
      await refetch();
      toast.success("ClickCrates refreshed");
    } catch (error) {
      toast.error("Failed to refresh ClickCrates");
    }
    setIsRefetching(false);
  };

  const handleActivateClickcrates = async () => {
    for (const clickcrateId of selectedClickcrates) {
      try {
        await activateClickcrate.mutateAsync(clickcrateId);
        toast.success(`ClickCrate ${clickcrateId} activated successfully`);
      } catch (error) {
        console.error(`Error activating ClickCrate ${clickcrateId}:`, error);
        toast.error(`Failed to activate ClickCrate ${clickcrateId}`);
      }
    }
    setShowActionsMenu(false);
    refetch();
  };

  const handleDeactivateClickcrates = async () => {
    for (const clickcrateId of selectedClickcrates) {
      try {
        await deactivateClickcrate.mutateAsync(clickcrateId);
        toast.success(`ClickCrate ${clickcrateId} deactivated successfully`);
      } catch (error) {
        console.error(`Error deactivating ClickCrate ${clickcrateId}:`, error);
        toast.error(`Failed to deactivate ClickCrate ${clickcrateId}`);
      }
    }
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
          <h1 className="text-lg font-bold mr-2">My ClickCrates (POS)</h1>
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
              className="btn btn-xs lg:btn-sm btn-outline w-[10rem] py-3 font-normal"
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
                      handleActivateClickcrates();
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
                      handleDeactivateClickcrates();
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
            className="btn btn-xs lg:btn-sm btn-primary w-[10rem] py-3 font-normal"
            onClick={() => setShowRegisterModal(true)}
          >
            Register
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center w-[100%] p-6 space-y-2">
          <span className="loading loading-spinner loading-md"></span>
          <p className="font-body text-xs font-semibold">LOADING</p>
        </div>
      )}

      {error && (
        <div className="mb-20 w-full bg-background border-2 border-quaternary rounded-lg">
          <p className="text-sm font-normal text-center p-4">
            Failed to fetch ClickCrates. Please try again.
          </p>
        </div>
      )}

      {!isLoading && !error && clickcrates && clickcrates.length > 0 && (
        <ClickcratesList
          clickcrates={clickcrates}
          onSelect={handleClickcrateSelect}
          selectedClickcrates={selectedClickcrates}
        />
      )}

      {!isLoading && !error && (!clickcrates || clickcrates.length === 0) && (
        <div className="mb-20 w-full bg-background border-2 border-quaternary rounded-lg">
          <p className="text-sm font-normal text-center p-4">
            No ClickCrates found. Try registering a new one!
          </p>
        </div>
      )}

      {showRegisterModal && (
        <ClickcrateRegister
          show={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
        />
      )}
    </div>
  );
}

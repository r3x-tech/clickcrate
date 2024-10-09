import React, { useState, useEffect } from "react";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { ExplorerLink } from "@/components/ExplorerLink";
import { ellipsify } from "@/utils/ellipsify";
import { useClickcrateDetails } from "../hooks/useClickcrateDetails";
import { Action, useActionsRegistryInterval } from "@dialectlabs/blinks";
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react";
import toast from "react-hot-toast";
import { BlinkPreview } from "@/components/blinks/BlinkPreview";
import { ClickCrate } from "@/types";

export function ClickCratePosShareModal({
  show,
  onClose,
  currentClickcrateId,
  currentClickcrate,
  isShareFormValid,
}: {
  show: boolean;
  onClose: () => void;
  currentClickcrateId: PublicKey;
  currentClickcrate: ClickCrate;
  isShareFormValid: boolean;
}) {
  const { publicKey } = useWallet();
  const { data: clickcrateDetails, isLoading: isClickcrateLoading } =
    useClickcrateDetails(currentClickcrateId, publicKey?.toString() || null);

  const { isRegistryLoaded } = useActionsRegistryInterval();

  const actionApiUrl = `https://api.clickcrate.xyz/blink/${currentClickcrateId.toString()}`;
  const rouletteApiUrl = `https://api.clickcrate.xyz/blink/roulette/${currentClickcrateId.toString()}`;
  const foodApiUrl = `https://api.clickcrate.xyz/blink/food/${currentClickcrateId.toString()}`;

  //   const actionApiUrl = `https://clickcrate-api-dev-62979740970.us-central1.run.app/blink/${currentClickcrateId.toString()}`;
  //   const rouletteApiUrl = `https://clickcrate-api-dev-62979740970.us-central1.run.app/blink/roulette/${currentClickcrateId.toString()}`;
  //   const foodApiUrl = `https://clickcrate-api-dev-62979740970.us-central1.run.app/blink/food/${currentClickcrateId.toString()}`;

  const [blinkUrl, setBlinkUrl] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [fetchedAction, setFetchedAction] = useState<Action | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAction = async () => {
    let fetchedAction = await Action.fetch(actionApiUrl);
    let finalApiUrl = actionApiUrl;
    if (
      currentClickcrate?.eligibleProductCategory &&
      currentClickcrate.eligibleProductCategory === "grocery"
    ) {
      if (fetchedAction.title.endsWith("Roulette")) {
        fetchedAction = await Action.fetch(rouletteApiUrl);
        finalApiUrl = rouletteApiUrl;
      } else {
        fetchedAction = await Action.fetch(foodApiUrl);
        finalApiUrl = foodApiUrl;
      }
    }
    return { finalApiUrl, fetchedAction };
  };

  useEffect(() => {
    if (show && clickcrateDetails && isRegistryLoaded) {
      setIsLoading(true);
      fetchAction().then(({ finalApiUrl, fetchedAction }) => {
        setFetchedAction(fetchedAction);
        setBlinkUrl(
          // `https://discover.clickcrate.xyz/?action=solana-action:${finalApiUrl}`
          `https://dial.to/?action=solana-action:${finalApiUrl}`
        );

        setIsLoading(false);
      });
    }
  }, [show, clickcrateDetails, isRegistryLoaded]);

  const handleGenerateBlink = () => {
    if (fetchedAction) {
      navigator.clipboard
        .writeText(blinkUrl)
        .then(() => {
          toast.success("Copied to clipboard");
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
          toast.error("Failed to copy blink link");
        });
    } else {
      toast.error("Blink not available");
    }
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <div
      className={`modal ${
        show ? "modal-open" : ""
      } absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center`}
    >
      <div className="modal-box bg-background p-6 flex flex-col border-2 border-white rounded-lg space-y-6 w-full max-w-md sm:max-h-[80vh]">
        <div className="flex flex-row justify-between items-end">
          <h1 className="text-lg font-bold text-start">Share ClickCrate</h1>
          <div className="flex flex-row justify-end items-end mb-[0.15em] p-0">
            <p className="text-start font-semibold tracking-wide text-xs">
              ClickCrate ID:{" "}
            </p>
            <p className="pl-2 text-start font-normal text-xs">
              <ExplorerLink
                path={`account/${currentClickcrateId}`}
                label={ellipsify(currentClickcrateId.toString())}
              />
            </p>
          </div>
        </div>

        {!isRegistryLoaded ||
        isLoading ||
        isClickcrateLoading ||
        !isShareFormValid ? (
          <div className="text-center">
            <span className="loading loading-spinner loading-md"></span>
            <p className="font-body text-sm font-normal">
              {isRegistryLoaded ? "Loading..." : "Loading registry..."}
            </p>
          </div>
        ) : (
          <div>
            {blinkUrl && (
              <div className="bg-quaternary p-2 rounded w-full">
                <p className="text-white text-sm break-all">{blinkUrl}</p>
              </div>
            )}
            <div
              className="flex items-center justify-end cursor-pointer mt-4"
              onClick={togglePreview}
            >
              <span className="mr-2 font-body text-xs font-bold">
                {showPreview ? "CLOSE PREVIEW" : "SHOW PREVIEW"}
              </span>
              {showPreview ? (
                <IconChevronDown size={21} />
              ) : (
                <IconChevronRight size={21} />
              )}
            </div>
            {showPreview && (
              <div className="blink-preview-container mt-4">
                <BlinkPreview
                  clickcrateId={currentClickcrateId.toString()}
                  action={fetchedAction}
                />
              </div>
            )}
            <div className="flex flex-row gap-4 mt-4">
              <button
                className="btn btn-xs lg:btn-sm btn-outline flex-1 py-3"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="btn btn-xs lg:btn-sm btn-primary flex-1 py-3"
                onClick={handleGenerateBlink}
              >
                Copy Blink
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

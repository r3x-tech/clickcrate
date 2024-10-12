import React, { useState } from "react";
import { ExplorerLink } from "@/components/ExplorerLink";
import { ellipsify } from "@/utils/ellipsify";
import {
  IconClipboard,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";
import toast from "react-hot-toast";
import { PublicKey } from "@solana/web3.js";
import { useClickcrateDetails } from "@/features/clickcrates/hooks/useClickcrateDetails";

interface ClickcrateSuccessInfoProps {
  clickcrateId: string;
  walletAddress: string;
  onCopyId: () => void;
}

export const ClickcrateSuccessInfo: React.FC<ClickcrateSuccessInfoProps> = ({
  clickcrateId,
  walletAddress,
  onCopyId,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    data: clickcrateDetails,
    isLoading,
    error,
  } = useClickcrateDetails(new PublicKey(clickcrateId), walletAddress);

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <p className="text-center font-normal text-sm">
          Loading ClickCrate details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center">
        <p className="text-center font-normal text-sm">
          Failed to load ClickCrate details
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-md font-semibold">Details</h3>
        <div className="flex items-end space-x-2 text-sm">
          <p className="flex space-x-2">Mint Address/Clickcrate Id:</p>
          <ExplorerLink
            path={`account/${clickcrateId}`}
            label={ellipsify(clickcrateId)}
          />
          <button
            onClick={onCopyId}
            className="btn btn-ghost btn-xs p-0 mb-[-2px]"
            aria-label="Copy ID to clipboard"
          >
            <IconClipboard size={16} className="text-white" />
          </button>
        </div>
      </div>
      {clickcrateDetails && (
        <div>
          <div className="flex space-x-6 mt-4">
            <img
              src={clickcrateDetails.collection.content.links.image}
              alt={clickcrateDetails.collection.content.metadata.name}
              className="w-40 h-40 object-cover rounded-lg"
            />
            <div className="flex flex-col flex-grow">
              <h4 className="font-semibold">
                {clickcrateDetails.collection.content.metadata.name}
              </h4>
              <p className="text-xs">
                {clickcrateDetails.collection.content.metadata.description}
              </p>
              <div className="mt-2 bg-tertiary p-2 rounded-md w-full">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  <p className="text-xs font-semibold">Metadata:</p>
                  {isExpanded ? (
                    <IconChevronUp size={16} />
                  ) : (
                    <IconChevronDown size={16} />
                  )}
                </div>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isExpanded ? "max-h-full" : "max-h-20"
                  }`}
                >
                  <pre className="text-xs whitespace-pre-wrap break-words mt-2">
                    {JSON.stringify(
                      clickcrateDetails.collection.content.metadata,
                      null,
                      2
                    )}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

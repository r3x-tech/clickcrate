import React, { useState } from "react";
import { useProductDetails } from "@/features/create/hooks/useProductDetails";
import { ellipsify } from "@/utils/ellipsify";
import { ExplorerLink } from "@/components/ExplorerLink";
import {
  IconChevronDown,
  IconChevronUp,
  IconClipboard,
} from "@tabler/icons-react";

export const ProductDetailItem: React.FC<{
  productId: string;
  walletAddress: string;
  onCopyId: () => void;
}> = ({ productId, walletAddress, onCopyId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    data: productDetails,
    isLoading,
    error,
  } = useProductDetails(productId, walletAddress);

  if (isLoading) return <div className="text-center text-sm">Loading...</div>;
  if (error)
    return (
      <div className="text-center text-sm">Error loading product details</div>
    );

  return (
    <div>
      <div className="flex space-x-6">
        <img
          src={productDetails.asset.content.links.image}
          alt={productDetails.asset.content.metadata.name}
          className="w-40 h-40 object-cover rounded-lg mb-2"
        />

        <div className="flex flex-col flex-grow">
          <div className="flex items-end space-x-2 text-xs">
            {/* <p className="flex space-x-2">Mint Address/Listing Id:</p> */}
            <ExplorerLink
              path={`account/${productId}`}
              label={ellipsify(productId)}
            />
            <button
              onClick={onCopyId}
              className="btn btn-ghost btn-xs p-0 mb-[-4px]"
              aria-label="Copy ID to clipboard"
            >
              <IconClipboard size={16} className="text-white" />
            </button>
          </div>
          <h4 className="font-semibold text-sm my-2">
            {productDetails?.asset.content.metadata.name || "Product"}
          </h4>
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
                isExpanded ? "max-h-full" : "max-h-16"
              }`}
            >
              <pre className="text-xs whitespace-pre-wrap break-words mt-2">
                {JSON.stringify(productDetails.asset.content.metadata, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

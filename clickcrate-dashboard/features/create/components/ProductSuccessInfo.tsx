import React, { useState } from "react";
import { ExplorerLink } from "@/components/ExplorerLink";
import { ellipsify } from "@/utils/ellipsify";
import {
  IconClipboard,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";
import { useProductListingDetails } from "@/features/product-listing/hooks/useProductListingDetails";
import { PublicKey } from "@solana/web3.js";
import { useProductDetails } from "../hooks/useProductDetails";
import { ProductDetailItem } from "./ProductDetailItem";

interface ProductSuccessInfoProps {
  listingId: string;
  productIds: string[];
  walletAddress: string;
  onCopyId: () => void;
}

export const ProductSuccessInfo: React.FC<ProductSuccessInfoProps> = ({
  listingId,
  productIds,
  walletAddress,
  onCopyId,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    data: listingDetails,
    isLoading,
    error,
  } = useProductListingDetails(listingId, walletAddress);

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <p className="text-center font-normal text-sm">
          Loading Product Listing details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center">
        <p className="text-center font-normal text-sm">
          Failed to load Product Listing details
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-md font-semibold">Listing</h3>
        <div className="flex items-end space-x-2 text-xs">
          <p className="flex space-x-2 font-semibold">
            Mint Address/Listing Id:
          </p>
          <ExplorerLink
            path={`account/${listingId}`}
            label={ellipsify(listingId)}
          />
          <button
            onClick={onCopyId}
            className="btn btn-ghost btn-xs p-0 mb-[-4px]"
            aria-label="Copy ID to clipboard"
          >
            <IconClipboard size={16} className="text-white" />
          </button>
        </div>
      </div>
      {listingDetails && (
        <div>
          <div className="flex space-x-6 mt-4">
            <img
              src={listingDetails.collection.content.links.image}
              alt={listingDetails.collection.content.metadata.name}
              className="w-40 h-40 object-cover rounded-lg"
            />
            <div className="flex flex-col flex-grow">
              <h4 className="font-semibold text-sm">
                {listingDetails.collection.content.metadata.name}
              </h4>
              <p className="text-xs py-2">
                {listingDetails.collection.content.metadata.description}
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
                    isExpanded ? "max-h-full" : "max-h-16"
                  }`}
                >
                  <pre className="text-xs whitespace-pre-wrap break-words mt-2">
                    {JSON.stringify(
                      listingDetails.collection.content.metadata,
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
      <h3 className="text-md font-semibold pt-10">Individual Products</h3>
      <div className="flex flex-col w-full space-y-4">
        {productIds.map((productId) => (
          <ProductDetailItem
            key={productId}
            productId={productId}
            walletAddress={walletAddress}
            onCopyId={onCopyId}
          />
        ))}
      </div>
    </div>
  );
};

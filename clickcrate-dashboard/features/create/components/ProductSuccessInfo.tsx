import React from "react";
import { ExplorerLink } from "@/components/ExplorerLink";
import { ellipsify } from "@/utils/ellipsify";
import { IconClipboard } from "@tabler/icons-react";
import { useProductListingDetails } from "@/features/product-listing/hooks/useProductListingDetails";
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
  const {
    data: listingDetails,
    isLoading: isListingLoading,
    error: listingError,
  } = useProductListingDetails(listingId, walletAddress);

  if (isListingLoading) {
    return (
      <div className="flex justify-center">
        <p className="p-2 text-center font-normal text-xs bg-tertiary">
          Loading Product details...{" "}
        </p>
      </div>
    );
  }

  if (listingError) {
    return (
      <div className="flex justify-center">
        <p className="p-2 text-center font-normal text-xs bg-tertiary">
          Error loading Product details
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Product Listing Details</h3>
        <div className="flex items-center space-x-2">
          <ExplorerLink
            path={`account/${listingId}`}
            label={ellipsify(listingId)}
          />
          <button
            onClick={onCopyId}
            className="btn btn-ghost btn-xs p-0"
            aria-label="Copy ID to clipboard"
          >
            <IconClipboard size={16} className="text-white" />
          </button>
        </div>
      </div>
      {listingDetails && (
        <div className="bg-tertiary p-4 rounded-lg">
          <img
            src={listingDetails.listingImage}
            alt={listingDetails.listingName}
            className="w-full h-40 object-cover rounded-lg mb-4"
          />
          <h4 className="font-semibold">{listingDetails.listingName}</h4>
          <p className="text-sm">{listingDetails.listingDescription}</p>
          <div className="mt-2">
            <p className="text-xs">
              <span className="font-semibold">Category:</span>{" "}
              {listingDetails.productCategory}
            </p>
            <p className="text-xs">
              <span className="font-semibold">Placement Type:</span>{" "}
              {listingDetails.placementType}
            </p>
          </div>
        </div>
      )}
      <h3 className="text-lg font-semibold mt-6">Individual Products</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {productIds.map((productId) => (
          <ProductDetailItem
            key={productId}
            productId={productId}
            walletAddress={walletAddress}
          />
        ))}
      </div>
    </div>
  );
};

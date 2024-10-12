import React from "react";
import { useProductDetails } from "@/features/create/hooks/useProductDetails";
import { ellipsify } from "@/utils/ellipsify";

interface ProductDetailItemProps {
  productId: string;
  walletAddress: string;
}

export const ProductDetailItem: React.FC<ProductDetailItemProps> = ({
  productId,
  walletAddress,
}) => {
  const { data, isLoading, error } = useProductDetails(
    productId,
    walletAddress
  );

  if (isLoading) {
    return <div className="bg-tertiary p-4 rounded-lg">Loading...</div>;
  }

  if (error) {
    return (
      <div className="bg-tertiary p-4 rounded-lg text-red-500">
        Error loading product details
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="bg-tertiary p-4 rounded-lg">
      <img
        src={data.image}
        alt={data.name}
        className="w-full h-32 object-cover rounded-lg mb-2"
      />
      <h5 className="font-semibold text-sm">{data.name}</h5>
      <p className="text-xs">{ellipsify(data.description, 50)}</p>
      <p className="text-xs mt-1">
        <span className="font-semibold">Metadata:</span> {data.sku}
      </p>
    </div>
  );
};

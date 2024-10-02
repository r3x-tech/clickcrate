import React from "react";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    placementStatus: string;
  };
  onUse: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onUse }) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{product.title}</h2>
        <p>Placement Status: {product.placementStatus}</p>
        <div className="card-actions justify-end">
          <button onClick={onUse} className="btn btn-primary btn-sm">
            Use as Template
          </button>
        </div>
      </div>
    </div>
  );
};

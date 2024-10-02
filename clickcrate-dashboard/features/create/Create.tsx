import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { clickcrateApi } from "@/services/clickcrateApi";
// import { ProductCard } from "./ProductCard";
import { CreateProductModal } from "./components/CreateProductModal";

export default function Create() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  //   const {
  //     data: recentProducts,
  //     isLoading,
  //     error,
  //   } = useQuery({
  //     queryKey: ["recentProducts"],
  //     queryFn: () => clickcrateApi.fetchRecentProducts(),
  //   });

  const handleCreateNew = () => {
    setIsModalOpen(true);
  };

  //   if (isLoading) return <div className="text-center">Loading...</div>;
  //   if (error)
  //     return (
  //       <div className="text-center text-error">
  //         Error loading recent products
  //       </div>
  //     );

  return (
    <div className="mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-bold">Recent Products</h1>
        <button onClick={handleCreateNew} className="btn btn-primary">
          Create New
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* {recentProducts?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))} */}
      </div>

      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

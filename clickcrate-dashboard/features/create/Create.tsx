import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { clickcrateApi } from "@/services/clickcrateApi";
import { CreateProductModal } from "./components/CreateProductModal";
import { IconRefresh } from "@tabler/icons-react";
import toast from "react-hot-toast";

export default function Create() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const {
  //   data: recentProducts,
  //   isLoading,
  //   error,
  //   refetch,
  // } = useQuery({
  //   queryKey: ["recentProducts"],
  //   queryFn: () => clickcrateApi.fetchRecentProducts(),
  // });

  const handleCreateNew = () => {
    setIsModalOpen(true);
  };

  const handleRefetch = async () => {
    try {
      // await refetch();
      toast.success("Recent products refreshed");
    } catch (error) {
      toast.error("Failed to refresh recent products");
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-4 mt-8">
        <div className="flex items-end m-0 p-0">
          <h1 className="text-lg font-bold mr-2">Recent Products</h1>
          <button
            className="btn btn-ghost btn-sm text-white bg-transparent hover:bg-transparent p-2"
            onClick={handleRefetch}
          >
            <IconRefresh size={21} />
          </button>
        </div>
        <div className="flex items-end space-x-4 m-0 p-0">
          <button
            onClick={handleCreateNew}
            className="btn btn-xs lg:btn-sm btn-primary w-[10rem] py-3 font-light"
          >
            Create New
          </button>
        </div>
      </div>
      {/* 
      {isLoading && (
        <div className="flex flex-col items-center justify-center w-full p-6 space-y-2">
          <span className="loading loading-spinner loading-md"></span>
          <p className="font-body text-xs font-semibold">LOADING</p>
        </div>
      )}

      {error && (
        <div className="mb-20 w-full bg-background border-2 border-quaternary rounded-lg">
          <p className="text-sm font-light text-center p-4">
            Failed to fetch recent products. Please try again.
          </p>
        </div>
      )} 

      {!isLoading && !error && recentProducts && recentProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {/* {recentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))} 
        </div>
      )}

      {!isLoading && !error && (!recentProducts || recentProducts.length === 0) && (
        <div className="mb-20 w-full bg-background border-2 border-quaternary rounded-lg">
          <p className="text-sm font-light text-center p-4">
            No recent products found. Try creating a new one!
          </p>
        </div>
      )} */}

      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

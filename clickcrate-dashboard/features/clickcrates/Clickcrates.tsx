import {
  ProductListingsList,
  ProductListingRegister,
} from "@/features/product-listings/components";
import { useProductListings } from "./hooks/useProductListings";

export default function ProductListings() {
  const { listings, isLoading, error } = useProductListings();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Product Listings</h1>
      <ProductListingRegister />
      <ProductListingsList listings={listings} />
    </div>
  );
}

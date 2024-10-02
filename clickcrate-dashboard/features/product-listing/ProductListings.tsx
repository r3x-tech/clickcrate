import { useProductListings } from "./hooks/useOwnedProductListings";

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

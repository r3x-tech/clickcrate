import { ProductListingRegister } from "./components/ProductListingRegister";
import ProductListingsList from "./components/ProductListingsList";
import { useOwnedProductListings } from "./hooks/useOwnedProductListings";
import { useWallet } from "@jup-ag/wallet-adapter";

export default function ProductListings() {
  const { publicKey } = useWallet();
  const {
    data: listings,
    isLoading,
    error,
  } = useOwnedProductListings(publicKey!);

  if (!publicKey) return <div>Please connect your wallet</div>;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>My Product Listings</h1>
      <ProductListingRegister />
      {/* <ProductListingsList listings={listings} /> */}
    </div>
  );
}

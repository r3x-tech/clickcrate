import { ProductListing } from "../../../types";

type Props = {
  listings: ProductListing[];
};

export default function ProductListingsList({ listings }: Props) {
  return (
    <ul>
      {listings.map((listing) => (
        <li key={listing.id}>{listing.name}</li>
      ))}
    </ul>
  );
}

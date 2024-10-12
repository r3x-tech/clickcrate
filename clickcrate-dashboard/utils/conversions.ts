import { Cluster, ClusterNetwork } from "@/features/cluster/hooks/useCluster";

export const formatPlacementType = (placementType: string): string => {
  switch (placementType) {
    case "digitalreplica":
      return "Digital Replica";
    case "relatedpurchase":
      return "Related Purchase";
    case "targetedplacement":
      return "Targeted Placement";
    default:
      return "Unavailable";
  }
};

export const formatProductCategory = (productCategory: string): string => {
  switch (productCategory.toLowerCase()) {
    case "clothing":
      return "Clothing";
    case "electronics":
      return "Electronics";
    case "books":
      return "Books";
    case "home":
      return "Home";
    case "beauty":
      return "Beauty";
    case "toys":
      return "Toys";
    case "sports":
      return "Sports";
    case "automotive":
      return "Automotive";
    case "grocery":
      return "Grocery";
    case "health":
      return "Health";
    default:
      return "Unavailable";
  }
};

export const formatOrigin = (origin: string): string => {
  switch (origin) {
    case "clickcrate":
      return "ClickCrate";
    case "shopify":
      return "Shopify";
    case "square":
      return "Square";
    default:
      return "Unavailable";
  }
};

export const formatOrderManager = (orderManager: string): string => {
  switch (orderManager) {
    case "clickcrate":
      return "ClickCrate";
    case "shopify":
      return "Shopify";
    case "square":
      return "Square";
    default:
      return "Unavailable";
  }
};

export function generateSymbol(name: string): string {
  const cleanedName = name.replace(/[^a-zA-Z0-9]/g, "");
  const uppercaseName = cleanedName.toUpperCase();
  return uppercaseName.slice(0, 5).padEnd(5, "X");
}

export function getNetwork(cluster: Cluster) {
  let network = "mainnet";
  switch (cluster.network) {
    case ClusterNetwork.Devnet:
      network = "devnet";
      break;
    case ClusterNetwork.Mainnet:
      network = "mainnet";
      break;
  }
  return network;
}

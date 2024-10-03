import { useQuery } from "@tanstack/react-query";
import { clickcrateApi } from "@/services/clickcrateApi";
import { PublicKey } from "@solana/web3.js";
import { PlacementType, ProductCategory } from "@/types";

interface ClickCrate {
  clickcrateId: string;
  owner: string;
  manager: string;
  eligiblePlacementType: PlacementType;
  eligibleProductCategory: ProductCategory;
  product: string | null;
  isActive: boolean;
}

interface ClickCrateResponse {
  clickCrates: ClickCrate[];
}

export function useOwnedClickcrates(owner: PublicKey | null) {
  return useQuery<ClickCrate[], Error>({
    queryKey: ["ownedClickcrates", owner?.toString()],
    queryFn: async () => {
      if (!owner) {
        return [];
      }
      const response = await clickcrateApi.fetchOwnedClickCrates(owner);
      const data = response.data as ClickCrateResponse;
      return data.clickCrates;
    },
    enabled: !!owner,
  });
}

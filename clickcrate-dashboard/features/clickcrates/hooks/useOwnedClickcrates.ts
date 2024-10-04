import { useQuery, useMutation } from "@tanstack/react-query";
import { clickcrateApi } from "@/services/clickcrateApi";
import { PlacementType, ProductCategory } from "@/types";
import axios from "axios";
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

export function useOwnedClickcrates(
  owner: string | null,
  walletAddress: string | null
) {
  return useQuery<ClickCrate[], Error>({
    queryKey: ["ownedClickcrates", owner, walletAddress],
    queryFn: async () => {
      if (!owner) {
        console.error("Owner is null");
        return [];
      }
      if (!walletAddress) {
        console.error("Wallet not connected");
        return [];
      }
      try {
        const response = await clickcrateApi.fetchOwnedClickCrates(
          owner,
          walletAddress
        );
        const data = response.data as ClickCrateResponse;
        return data.clickCrates;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          console.error("Unauthorized request");
        } else {
          console.error("Error fetching owned clickcrates:", error);
        }
        return [];
      }
    },
    enabled: !!owner && !!walletAddress,
  });
}

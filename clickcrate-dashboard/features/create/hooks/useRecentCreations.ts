import { useQuery } from "@tanstack/react-query";
import { clickcrateApi } from "@/services/clickcrateApi";
import { useWallet } from "@solana/wallet-adapter-react";

export function useRecentCreations() {
  const { publicKey } = useWallet();

  return useQuery({
    queryKey: ["recentCreations", publicKey?.toBase58()],
    queryFn: async () => {
      if (!publicKey) {
        throw new Error("Wallet not connected");
      }
      const response = await clickcrateApi.fetchRecentCreations(
        publicKey.toBase58(),
        publicKey.toBase58()
      );
      return response.data.recentCreations;
    },
    enabled: !!publicKey,
  });
}

import { useWallet } from "@solana/wallet-adapter-react";
import { useClickCrateOrders } from "./hooks/useOrders";
import { useEffect, useRef, useState } from "react";
import { IconRefresh } from "@tabler/icons-react";
import { AppHero } from "@/components/Layout";
import { UnifiedWalletButton } from "@jup-ag/wallet-adapter";
import { OrdersList } from "./components/OrderList";

export default function Orders() {
  const { publicKey } = useWallet();
  const ordersQuery = useClickCrateOrders(
    publicKey ? publicKey.toBase58() : null
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const hasInitiallyFetched = useRef(false);

  useEffect(() => {
    if (publicKey && !hasInitiallyFetched.current) {
      ordersQuery.refetch();
      hasInitiallyFetched.current = true;
    }
  }, [publicKey, ordersQuery]);

  const handleRefresh = async () => {
    if (publicKey) {
      setIsRefreshing(true);
      await ordersQuery.refetch();
      setIsRefreshing(false);
    }
  };

  return publicKey ? (
    <div>
      <AppHero title="" subtitle="">
        <div className="flex flex-row items-end w-[100%] h-[3rem] mb-4">
          <div className="flex flex-row flex-1 justify-start items-end">
            <p className="text-start font-bold text-xl text-white tracking-wide">
              My Orders
            </p>
            <button
              className="btn btn-ghost btn-sm ml-2 text-white bg-transparent hover:bg-transparent p-2"
              onClick={handleRefresh}
              disabled={isRefreshing || !publicKey}
            >
              <IconRefresh
                size={21}
                className={`refresh-icon ${
                  isRefreshing ? "animate-spin-counterclockwise" : ""
                }`}
              />
            </button>
          </div>
        </div>
        <OrdersList
          orders={ordersQuery.data}
          isLoading={ordersQuery.isLoading}
          error={ordersQuery.error}
        />
      </AppHero>
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <UnifiedWalletButton />
        </div>
      </div>
    </div>
  );
}

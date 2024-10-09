import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useRef, useState } from "react";
import { IconRefresh } from "@tabler/icons-react";
import { AppHero } from "@/components/Layout";
import { OrdersList } from "./components/OrderList";
import { useClickcrateOrders } from "./hooks/useClickcrateOrders";
import { WalletButton } from "@/solana/solana-provider";

export default function Orders() {
  const { publicKey } = useWallet();
  const ordersQuery = useClickcrateOrders(
    publicKey ? publicKey.toBase58() : null,
    publicKey ? publicKey.toBase58() : null
  );
  const [isRefetching, setIsRefetching] = useState(false);
  const hasInitiallyFetched = useRef(false);

  useEffect(() => {
    if (publicKey && !hasInitiallyFetched.current) {
      ordersQuery.refetch();
      hasInitiallyFetched.current = true;
    }
  }, [publicKey, ordersQuery]);

  const handleRefetch = async () => {
    if (publicKey) {
      setIsRefetching(true);
      await ordersQuery.refetch();
      setIsRefetching(false);
    }
  };

  return publicKey ? (
    <div>
      <AppHero title="" subtitle="">
        <div className="flex flex-row items-end w-[100%] h-[3rem] mb-4">
          <div className="flex flex-row flex-1 justify-start items-end">
            <h1 className="text-lg font-bold mr-2"> Inbound Orders</h1>

            <button
              className="btn btn-ghost btn-sm ml-2 text-white bg-transparent hover:bg-transparent p-2"
              onClick={handleRefetch}
              disabled={isRefetching || !publicKey}
            >
              <IconRefresh
                size={21}
                className={`refresh-icon ${
                  isRefetching ? "animate-spin-counterclockwise" : ""
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
          <WalletButton />
        </div>
      </div>
    </div>
  );
}

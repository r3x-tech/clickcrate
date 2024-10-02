import { useWallet } from "@jup-ag/wallet-adapter";
import { useOwnedClickcrates } from "./hooks/useOwnedClickcrates";
// import {
//   ClickcrateRegister,
//   ClickcratesList,
// } from "./components/ClickcrateRegister";

export default function Clickcrates() {
  const { publicKey } = useWallet();

  const {
    data: clickcrates,
    isLoading,
    error,
  } = useOwnedClickcrates(publicKey!);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>My ClickCrates (POS)</h1>
      {/* <ClickcrateRegister /> */}
      {/* <ClickcratesList listings={listings} /> */}
    </div>
  );
}

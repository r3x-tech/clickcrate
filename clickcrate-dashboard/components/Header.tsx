import { UnifiedWalletButton } from "@jup-ag/wallet-adapter";

export default function Header() {
  return (
    <header className="bg-tertiary py-4 px-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold">ClickCrate Dashboard</h1>
      <UnifiedWalletButton />
    </header>
  );
}

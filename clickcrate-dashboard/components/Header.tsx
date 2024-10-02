import { UnifiedWalletButton } from "@jup-ag/wallet-adapter";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ClusterUiSelect } from "@/features/cluster/components/ClusterUiSelect";

const links = [
  { label: "Home", path: "/" },
  { label: "Create", path: "/create" },
  { label: "Product Listings", path: "/product-listings" },
  { label: "ClickCrates (POS)", path: "/clickcrates" },
  { label: "Orders", path: "/orders" },
  { label: "Account", path: "/account" },
];

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path + "/") || pathname === path;
  };

  return (
    <header className="navbar text-neutral-content px-[4vw] flex items-center border-b-2 border-tertiary">
      <div className="flex-none justify-start">
        <Link
          className="btn btn-ghost p-0 h-auto"
          href="https://clickcrate.r3x.tech/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/clickcrate-logo-small.svg"
            alt="clickcrate logo"
            width={120}
            height={80}
          />
        </Link>
      </div>
      <div className="flex-1 justify-center">
        <nav className="w-full">
          <ul className="menu menu-horizontal justify-center w-full px-1 space-x-4 font-semibold">
            {links.map(({ label, path }) => (
              <li key={path}>
                <Link
                  className={`${
                    isActive(path)
                      ? "active underline decoration-4 underline-offset-8 decoration-primary"
                      : ""
                  }`}
                  href={path}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="flex-none justify-end space-x-2 flex">
        <UnifiedWalletButton />
        {/* <ClusterUiSelect /> */}
      </div>
    </header>
  );
}

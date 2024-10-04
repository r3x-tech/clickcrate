import React, { useState } from "react";
import { WalletButton } from "@/solana/solana-provider";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { IconMenu2 } from "@tabler/icons-react";

const links = [
  { label: "Account", path: "/" },
  { label: "Create", path: "/create" },
  { label: "Product Listings", path: "/product-listings" },
  { label: "ClickCrates (POS)", path: "/clickcrates" },
  { label: "Orders", path: "/orders" },
];

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/" || path === "/account") {
      return pathname === "/";
    }
    return pathname.startsWith(path + "/") || pathname === path;
  };

  return (
    <header className="navbar text-neutral-content px-[4vw] flex flex-col md:flex-row items-center border-b-2 border-tertiary">
      {/* Mobile Header */}
      <div className="w-full md:hidden flex justify-between items-center">
        <button
          className="btn btn-ghost"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <IconMenu2 size={24} />
        </button>
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
        <WalletButton />
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex md:flex-none justify-start">
        <Link
          className="btn btn-ghost px-4 py-0 h-auto hover:bg-transparent"
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

      <nav
        className={`w-full md:flex-1 ${
          isMenuOpen ? "block" : "hidden"
        } md:block`}
      >
        <ul className="menu menu-vertical md:menu-horizontal justify-center w-full px-1 space-y-2 md:space-y-0 md:space-x-4 font-semibold">
          {links.map(({ label, path }) => (
            <li key={path}>
              <Link
                className={`${
                  isActive(path)
                    ? "active underline decoration-4 underline-offset-8 decoration-primary"
                    : ""
                } hover:bg-quaternary`}
                href={path}
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="hidden md:flex md:flex-none justify-end">
        <WalletButton />
      </div>
    </header>
  );
}

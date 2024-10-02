import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="bg-quaternary w-64 h-full">
      <nav className="mt-10">
        <Link
          href="/"
          className="block py-2 px-4 text-gray-400 hover:bg-gray-700"
        >
          Home
        </Link>
        <Link
          href="/create"
          className="block py-2 px-4 text-gray-400 hover:bg-gray-700"
        >
          Create
        </Link>
        <Link
          href="/product-listings"
          className="block py-2 px-4 text-gray-400 hover:bg-gray-700"
        >
          Product Listings
        </Link>
        <Link
          href="/clickcrates"
          className="block py-2 px-4 text-gray-400 hover:bg-gray-700"
        >
          ClickCrates (POS)
        </Link>
        <Link
          href="/orders"
          className="block py-2 px-4 text-gray-400 hover:bg-gray-700"
        >
          Orders
        </Link>
      </nav>
    </aside>
  );
}

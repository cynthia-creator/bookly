import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-indigo-600">
          Bookly
        </Link>
        <ul className="flex items-center gap-6 text-sm font-medium text-gray-700">
          <li>
            <Link href="/" className="hover:text-indigo-600">Home</Link>
          </li>
          <li>
            <Link href="/#services" className="hover:text-indigo-600">Services</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
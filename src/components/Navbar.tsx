import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-background/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight"
        >
          <span
            aria-hidden
            className="h-7 w-7 rounded-[10px] bg-gradient-to-br from-brand to-[#ff6b8a]"
          />
          Bookly
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <span className="hidden rounded-full border border-line bg-surface px-4 py-2 text-[13px] font-semibold text-muted lg:inline-block">
            Open Mon–Sat · 09:00–17:00
          </span>

          <ul className="flex items-center gap-2 text-sm font-semibold sm:gap-4">
            <li>
              <Link
                href="/"
                className="rounded-full px-3 py-2 text-muted transition hover:bg-brand-soft hover:text-brand"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/services"
                className="rounded-full px-3 py-2 text-muted transition hover:bg-brand-soft hover:text-brand"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                href="/services"
                className="rounded-full bg-gradient-to-br from-brand to-[#ff6b8a] px-5 py-2.5 text-white shadow-md shadow-brand/30 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                Book now
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
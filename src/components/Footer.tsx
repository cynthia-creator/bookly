import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="h-6 w-6 rounded-lg bg-gradient-to-br from-brand to-[#ff6b8a]"
          />
          <span className="font-bold text-ink">Bookly</span>
        </div>

        <p>
          © {new Date().getFullYear()} Bookly. Built with Next.js, TypeScript and
          Tailwind CSS.
        </p>

        <Link
          href="/services"
          className="font-semibold text-brand transition hover:underline"
        >
          Browse services →
        </Link>
      </div>
    </footer>
  );
}
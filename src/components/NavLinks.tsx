"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map(({ href, label }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-full px-3 py-2 transition hover:bg-brand-soft hover:text-brand",
                active ? "bg-brand-soft text-brand" : "text-muted"
              )}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </>
  );
}
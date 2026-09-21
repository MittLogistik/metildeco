"use client";

import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/admin", label: "Översikt" },
  { href: "/admin/ordrar", label: "Ordrar" },
  { href: "/admin/kunder", label: "Kunder" },
  { href: "/admin/korgar", label: "Övergivna korgar" },
  { href: "/admin/produkter", label: "Produkter" },
  { href: "/admin/paket", label: "Paket" },
  { href: "/admin/annonser", label: "Annonser" },
  { href: "/admin/konto", label: "Mitt konto" },
];

/** Snurra i länken som just klickats, så klicket syns innan servern hunnit svara. */
function Pending() {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  return <span className="ml-2 inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent align-middle" aria-hidden="true" />;
}

export function AdminNav() {
  const path = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto scrollbar-none lg:flex-col" aria-label="Adminmeny">
      {nav.map((n) => {
        const active = n.href === "/admin" ? path === "/admin" : path.startsWith(n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            className={`shrink-0 rounded-xl px-3 py-2 text-sm transition-colors ${active ? "bg-primary-soft font-medium text-primary" : "text-muted hover:bg-sand hover:text-foreground"}`}
          >
            {n.label}
            <Pending />
          </Link>
        );
      })}
    </nav>
  );
}

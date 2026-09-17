"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/admin", label: "Översikt" },
  { href: "/admin/ordrar", label: "Ordrar" },
  { href: "/admin/korgar", label: "Övergivna korgar" },
  { href: "/admin/produkter", label: "Produkter" },
  { href: "/admin/paket", label: "Paket" },
  { href: "/admin/konto", label: "Mitt konto" },
];

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
          </Link>
        );
      })}
    </nav>
  );
}

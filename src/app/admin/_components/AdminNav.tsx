"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/admin", label: "Översikt" },
  { href: "/admin/ordrar", label: "Ordrar" },
  { href: "/admin/produkter", label: "Produkter" },
  { href: "/admin/paket", label: "Paket" },
  { href: "/admin/konto", label: "Mitt konto" },
];

export function AdminNav() {
  const path = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto scrollbar-none">
      {nav.map((n) => {
        const active = n.href === "/admin" ? path === "/admin" : path.startsWith(n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm hover:bg-sand ${active ? "bg-sand font-medium" : ""}`}
          >
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}

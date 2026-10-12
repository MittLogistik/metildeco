"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/client";
import { layout } from "@/i18n/messages/layout";
import { ChevronRight } from "@/components/icons";

export type Crumb = { href?: string; label: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const { locale, r } = useI18n();
  const t = layout[locale].breadcrumbs;
  const all: Crumb[] = [{ href: r.home, label: t.home }, ...items];
  return (
    <nav aria-label={t.label} className="text-xs text-muted">
      <ol className="flex flex-wrap items-center gap-1">
        {all.map((c, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 ? <ChevronRight size={12} /> : null}
            {c.href && i < all.length - 1 ? (
              <Link href={c.href} className="hover:text-foreground">
                {c.label}
              </Link>
            ) : (
              <span className="text-foreground" aria-current="page">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

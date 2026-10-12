"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/client";
import { layout } from "@/i18n/messages/layout";
import { formatPrice } from "@/lib/format";
import { freeShippingOver } from "@/lib/shipping";
import { FlaskIcon, LeafIcon, RefreshIcon, TruckIcon } from "@/components/icons";

/** Fyra löften som återkommer på start- och produktsidor. */
export function TrustBar({ compact = false }: { compact?: boolean }) {
  const { locale, market, r } = useI18n();
  const t = layout[locale].trust;
  const items = [
    { icon: FlaskIcon, title: t.contentTitle, text: t.contentText, href: r.quality },
    { icon: LeafIcon, title: t.additivesTitle, text: t.additivesText, href: r.quality },
    { icon: TruckIcon, title: t.shippingTitle(formatPrice(freeShippingOver(locale), market.currency)), text: t.shippingText, href: r.shipping },
    { icon: RefreshIcon, title: t.returnsTitle, text: t.returnsText, href: r.returns },
  ];
  if (compact) {
    return (
      <ul className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        {items.map((it) => (
          <li key={it.title} className="flex items-start gap-2.5">
            <it.icon size={18} className="mt-0.5 shrink-0 text-primary" />
            <span>
              <Link href={it.href} className="font-medium hover:underline">
                {it.title}
              </Link>
            </span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((it) => (
        <li key={it.title} className="flex gap-4">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
            <it.icon size={22} />
          </span>
          <div>
            <h3 className="font-display text-base font-medium">
              <Link href={it.href} className="hover:underline">
                {it.title}
              </Link>
            </h3>
            <p className="mt-1 text-sm text-muted">{it.text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

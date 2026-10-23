"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/i18n/client";
import { layout } from "@/i18n/messages/layout";
import { formatPrice } from "@/lib/format";
import { hasPage, type RouteKey } from "@/lib/routes";
import { freeShippingOver } from "@/lib/shipping";
import { useCart } from "@/components/cart/CartProvider";
import { CartIcon, CloseIcon, MenuIcon } from "@/components/icons";
import { Container } from "@/components/ui";

const navKeys = ["products", "goals", "subscription", "articles", "quality"] as const satisfies RouteKey[];

export function Header() {
  const cart = useCart();
  const pathname = usePathname();
  const { locale, market, r } = useI18n();
  const t = layout[locale].header;
  const nav = navKeys.filter((k) => hasPage(k, locale)).map((k) => ({ href: r[k], label: t.nav[k] }));
  const showAccount = hasPage("account", locale);
  // Menyn är öppen bara för den sida den öppnades på – byter sidan stängs den automatiskt.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const menuOpen = openOn === pathname;
  const setMenuOpen = (fn: (o: boolean) => boolean) => setOpenOn(fn(menuOpen) ? pathname : null);

  return (
    <>
      <div className="bg-primary text-primary-fg">
        <Container className="flex min-h-9 items-center justify-center py-1.5 text-center text-xs font-medium tracking-wide">
          <p>
            {t.freeShipping(formatPrice(freeShippingOver(locale), market.currency))} <span className="mx-2 opacity-50">·</span> {t.sameDay}
          </p>
        </Container>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
        <Container className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              aria-label={menuOpen ? t.closeMenu : t.openMenu}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
              className="rounded-full p-2 hover:bg-sand"
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>

          <Link href={r.home} className="flex items-center gap-2.5" aria-label={t.homeLabel}>
            <Image src="/logo-mark.png" alt="" width={44} height={32} className="h-8 w-auto" priority />
            <span className="font-display text-2xl font-medium tracking-tight">Metilde</span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label={t.mainNav}>
            {nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/") || pathname.startsWith(item.href + "?");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${active ? "text-primary" : "text-foreground"}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            <Link href={r.contact} className="hidden rounded-full px-3 py-2 text-sm font-medium hover:bg-sand lg:inline-block">
              {t.customerService}
            </Link>
            {showAccount ? (
              <Link href={r.account} className="hidden rounded-full px-3 py-2 text-sm font-medium hover:bg-sand lg:inline-block">
                {t.account}
              </Link>
            ) : null}
            <button
              type="button"
              onClick={cart.open}
              aria-label={t.openCart(cart.count)}
              className="relative rounded-full p-2 hover:bg-sand"
            >
              <CartIcon size={22} />
              {cart.count > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-fg">
                  {cart.count}
                </span>
              ) : null}
            </button>
          </div>
        </Container>

        {menuOpen ? (
          <nav className="border-t border-line bg-white lg:hidden" aria-label={t.mobileNav}>
            <Container className="flex flex-col py-2">
              {nav.map((item) => (
                <Link key={item.href} href={item.href} className="border-b border-line py-3.5 text-base font-medium">
                  {item.label}
                </Link>
              ))}
              <Link href={r.contact} className="border-b border-line py-3.5 text-base font-medium">
                {t.customerService}
              </Link>
              {showAccount ? (
                <Link href={r.account} className="border-b border-line py-3.5 text-base font-medium">
                  {t.account}
                </Link>
              ) : null}
            </Container>
          </nav>
        ) : null}
      </header>
    </>
  );
}

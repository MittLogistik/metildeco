"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { routes } from "@/lib/routes";
import { site } from "@/lib/site";
import { useCart } from "@/components/cart/CartProvider";
import { CartIcon, CloseIcon, MenuIcon } from "@/components/icons";
import { Container } from "@/components/ui";

const nav = [
  { href: routes.products, label: "Produkter" },
  { href: routes.goals, label: "Handla efter mål" },
  { href: routes.subscription, label: "Prenumeration" },
  { href: routes.articles, label: "Journalen" },
  { href: routes.quality, label: "Kvalitetsgaranti" },
];

export function Header() {
  const cart = useCart();
  const pathname = usePathname();
  // Menyn är öppen bara för den sida den öppnades på – byter sidan stängs den automatiskt.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const menuOpen = openOn === pathname;
  const setMenuOpen = (fn: (o: boolean) => boolean) => setOpenOn(fn(menuOpen) ? pathname : null);

  return (
    <>
      <div className="bg-primary text-primary-fg">
        <Container className="flex h-9 items-center justify-center text-center text-xs font-medium tracking-wide">
          <p>
            Fri frakt över {site.freeShippingOver} kr <span className="mx-2 opacity-50">·</span> Skickas samma dag vid order före 12
            <span className="mx-2 hidden opacity-50 sm:inline">·</span>
            <span className="hidden sm:inline">Tillverkat i Sverige</span>
          </p>
        </Container>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
        <Container className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              aria-label={menuOpen ? "Stäng meny" : "Öppna meny"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
              className="rounded-full p-2 hover:bg-sand"
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>

          <Link href={routes.home} className="flex items-center gap-2.5" aria-label="Metilde – till startsidan">
            <Image src="/logo-mark.png" alt="" width={32} height={32} className="h-8 w-8" priority />
            <span className="font-display text-2xl font-medium tracking-tight">Metilde</span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Huvudmeny">
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
            <Link href={routes.contact} className="hidden rounded-full px-3 py-2 text-sm font-medium hover:bg-sand lg:inline-block">
              Kundservice
            </Link>
            <Link href={routes.account} className="hidden rounded-full px-3 py-2 text-sm font-medium hover:bg-sand lg:inline-block">
              Mitt konto
            </Link>
            <button
              type="button"
              onClick={cart.open}
              aria-label={`Öppna varukorgen, ${cart.count} varor`}
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
          <nav className="border-t border-line bg-white lg:hidden" aria-label="Mobilmeny">
            <Container className="flex flex-col py-2">
              {nav.map((item) => (
                <Link key={item.href} href={item.href} className="border-b border-line py-3.5 text-base font-medium last:border-0">
                  {item.label}
                </Link>
              ))}
              <Link href={routes.contact} className="border-b border-line py-3.5 text-base font-medium">
                Kundservice
              </Link>
              <Link href={routes.account} className="py-3.5 text-base font-medium">
                Mitt konto
              </Link>
            </Container>
          </nav>
        ) : null}
      </header>
    </>
  );
}

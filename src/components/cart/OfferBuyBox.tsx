"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";
import { subscriptionUnitPrice, unitCount, type Product } from "@/lib/products";
import { freeShippingOver } from "@/lib/shipping";
import { useI18n } from "@/i18n/client";
import { cart as cartMessages } from "@/i18n/messages/cart";
import { artworkFor, isCutout, packArtworkFor } from "@/content/offer-artwork";
import { Button } from "@/components/ui";
import { CheckIcon } from "@/components/icons";

export type GiftOption = { slug: string; name: string; price: number; image: string };

type OptionId = "sub1" | "pack" | "once";
type Point = { text: string; tone?: "gift" };

const shortName = (name: string) => name.replace(/\s*\|.*$/, "");

/**
 * Köprutan i erbjudandeläget (variant B): tre kort ovanpå varandra.
 *  1. Prenumerera på 1 förpackning: 15 % rabatt och fri frakt.
 *  2. Prenumerera på ett flerpack: 15 % rabatt, fri frakt och en gåva.
 *  3. Köp 1 gång till ordinarie pris.
 * Varje kort har produktbilden till vänster (flerpacket som en bild med gåvan framför),
 * texten i mitten och pris med besparing till höger. Bilderna ligger direkt på kortets färg:
 * friställda PNG:er som de är, vanliga bilder med vit bakgrund blandas bort (multiply).
 */
export function OfferBuyBox({ product, inStock, gifts }: { product: Product; inStock: boolean; gifts: GiftOption[] }) {
  const cart = useCart();
  const { locale } = useI18n();
  const t = cartMessages[locale];
  const currency = cart.currency;
  const fmt = (n: number) => formatPrice(n, currency);
  const packQty = Math.max(2, product.offerPackQty);
  const [option, setOption] = useState<OptionId>(gifts.length ? "pack" : "sub1");
  const [giftSlug, setGiftSlug] = useState<string | null>(gifts[0]?.slug ?? null);
  const [added, setAdded] = useState(false);
  const gift = gifts.find((g) => g.slug === giftSlug) ?? null;
  const perPack = unitCount(product);
  const single = artworkFor(product.slug, product.images[0] ?? "/media/placeholder.svg");
  const pack = packArtworkFor(product.slug);

  const subUnit = subscriptionUnitPrice(product.price, site.subscriptionDiscount, currency);
  const cents = (n: number) => Math.round(n * 100) / 100;
  const packInterval: 30 | 60 | 90 = packQty >= 3 ? 90 : 60;
  const packTotal = cents(subUnit * packQty);
  const packValue = cents(product.price * packQty + (gift?.price ?? 0));
  const packSave = cents(packValue - packTotal);
  const packPct = packValue > 0 ? Math.round((packSave / packValue) * 100) : 0;
  const oneSave = cents(product.price - subUnit);

  const totals: Record<OptionId, { pay: number; list: number }> = {
    sub1: { pay: subUnit, list: product.price },
    pack: { pay: packTotal, list: packValue },
    once: { pay: product.price, list: product.price },
  };
  const current = totals[option];

  const add = () => {
    if (option === "sub1") cart.addProduct(product.slug, 1, "sub", 30);
    else if (option === "pack") cart.addOffer(product.slug, packQty, packInterval, gift?.slug ?? null);
    else cart.addProduct(product.slug, 1, "once");
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="space-y-3">
      <div role="radiogroup" aria-label={t.chooseOption} className="space-y-3">
        <OptionCard
          currency={currency}
          saveLabel={t.saveOffer}
          active={option === "sub1"}
          onClick={() => setOption("sub1")}
          badge={t.freeShipping}
          title={t.sub1Title}
          sub={t.sub1Sub(perPack)}
          pct={site.subscriptionDiscount}
          price={subUnit}
          list={product.price}
          save={oneSave}
          points={[{ text: t.freeEvery(30) }, { text: t.cancelAnytime }]}
          visual={<Art src={single} className="h-[60px] w-11 sm:h-[68px] sm:w-12" />}
        />

        <OptionCard
          currency={currency}
          saveLabel={t.saveOffer}
          active={option === "pack"}
          onClick={() => setOption("pack")}
          badge={t.bestValue}
          badgeTone="accent"
          title={t.packTitle(packQty)}
          sub={t.packSub(packQty, perPack ? perPack * packQty : null)}
          pct={packPct}
          price={packTotal}
          list={packValue}
          save={packSave}
          points={[
            ...(gift ? [{ text: t.giftPoint(shortName(gift.name), fmt(gift.price)), tone: "gift" as const }] : []),
            { text: t.freeEvery(packInterval) },
            { text: t.cancelAnytime },
          ]}
          visual={
            <span className="relative block h-[68px] w-[64px] -translate-x-1.5 sm:h-[84px] sm:w-[80px]">
              {pack ? (
                <Art src={pack} className="absolute inset-0" />
              ) : (
                <>
                  <Art src={single} className="absolute left-0 top-2 h-[72px] w-12 opacity-80" />
                  <Art src={single} className="absolute right-0 top-2 h-[72px] w-12 opacity-80" />
                  <Art src={single} className="absolute left-1/2 top-0 h-[82px] w-14 -translate-x-1/2" />
                </>
              )}
              {gift ? (
                <span className="absolute -bottom-2 -right-3 block h-[54px] w-10 drop-shadow-lg sm:-right-4 sm:h-[66px] sm:w-12">
                  <Art src={artworkFor(gift.slug, gift.image)} className="absolute inset-0" />
                  <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-success px-1.5 py-0.5 text-[9px] font-bold uppercase leading-none tracking-wide text-white shadow">{t.gift}</span>
                </span>
              ) : null}
              <span className="absolute -left-1 bottom-0 rounded-full bg-foreground px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">×{packQty}</span>
            </span>
          }
        >
          {gifts.length > 1 && option === "pack" ? (
            <div className="mt-2.5">
              <p className="mb-1.5 text-xs font-medium">{t.chooseGift}</p>
              <div className="flex flex-wrap gap-1.5">
                {gifts.map((g) => (
                  <button
                    key={g.slug}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setGiftSlug(g.slug);
                    }}
                    aria-pressed={giftSlug === g.slug}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors ${
                      giftSlug === g.slug ? "border-primary bg-primary text-primary-fg" : "border-line bg-white hover:border-foreground/40"
                    }`}
                  >
                    <span className="relative h-5 w-4">
                      <Image src={artworkFor(g.slug, g.image)} alt="" fill sizes="20px" className="object-contain" />
                    </span>
                    {shortName(g.name)}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </OptionCard>

        <OptionCard
          currency={currency}
          saveLabel={t.saveOffer}
          active={option === "once"}
          onClick={() => setOption("once")}
          title={t.onceTitle}
          sub={t.onceSub}
          price={product.price}
          list={null}
          save={null}
          points={[{ text: t.freeOver(fmt(freeShippingOver(locale))) }]}
          visual={<Art src={single} className="h-[60px] w-11 sm:h-[68px] sm:w-12" />}
        />
      </div>

      <Button size="lg" className="w-full" onClick={add} disabled={!inStock}>
        {!inStock ? (
          t.soldOut
        ) : added ? (
          <>
            <CheckIcon size={18} /> {t.addedToCart}
          </>
        ) : (
          <>
            {t.addToCart} · {fmt(current.pay)}
            {current.pay < current.list ? <span className="text-primary-fg/70 line-through tabular-nums">{fmt(current.list)}</span> : null}
          </>
        )}
      </Button>
      <p className="text-center text-xs text-muted">
        {option === "once"
          ? t.onceFootnote
          : `${t.subFootnote}${option === "pack" && gift ? t.giftFootnote : ""}`}
      </p>
    </div>
  );
}

/** Produktbild utan egen bakgrund. Bilder med vit bakgrund blandas in i kortets färg. */
function Art({ src, className = "" }: { src: string; className?: string }) {
  return (
    <span className={`block ${className.includes("absolute") ? "" : "relative "}${className}`}>
      <Image src={src} alt="" fill sizes="120px" className={`object-contain ${isCutout(src) ? "" : "mix-blend-multiply"}`} />
    </span>
  );
}

function OptionCard({
  currency,
  saveLabel,
  active,
  onClick,
  badge,
  badgeTone = "primary",
  title,
  sub,
  pct,
  price,
  list,
  save,
  points,
  visual,
  children,
}: {
  active: boolean;
  onClick: () => void;
  badge?: string;
  badgeTone?: "primary" | "accent";
  title: string;
  sub: string;
  pct?: number;
  price: number;
  list: number | null;
  save: number | null;
  points: Point[];
  visual: React.ReactNode;
  children?: React.ReactNode;
  currency: string;
  saveLabel: (pct: number, amount: string) => string;
}) {
  return (
    <div
      role="radio"
      aria-checked={active}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={`relative cursor-pointer rounded-2xl border-2 p-3 transition-all ${
        active ? "border-primary bg-primary-soft shadow-sm" : "border-line bg-white hover:border-foreground/30"
      }`}
    >
      {badge ? (
        <span className={`absolute -top-2.5 left-4 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badgeTone === "accent" ? "bg-accent text-white" : "bg-primary text-primary-fg"}`}>
          {badge}
        </span>
      ) : null}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <span className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${active ? "border-primary bg-primary" : "border-foreground/25 bg-white"}`}>
          {active ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
        </span>
        <div className="flex w-[68px] shrink-0 justify-center sm:w-[84px]">{visual}</div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-snug">{title}</p>
          <p className="text-xs text-muted">{sub}</p>
          {pct && save ? (
            <p className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-success/12 px-2 py-0.5 text-[11px] font-bold text-success">
              {saveLabel(pct, formatPrice(save, currency))}
            </p>
          ) : null}
          <ul className="mt-1.5 space-y-0.5 text-xs">
            {points.map((p) => (
              <li key={p.text} className={`flex items-start gap-1.5 ${p.tone === "gift" ? "font-semibold text-success" : "text-foreground/80"}`}>
                <CheckIcon size={12} className={`mt-0.5 shrink-0 ${p.tone === "gift" ? "text-success" : "text-primary"}`} />
                <span>{p.text}</span>
              </li>
            ))}
          </ul>
          {children}
        </div>
        <div className="shrink-0 self-start text-right">
          <p className="text-base font-bold tabular-nums leading-tight">{formatPrice(price, currency)}</p>
          {list !== null && list > price ? <p className="text-[11px] text-muted line-through tabular-nums">{formatPrice(list, currency)}</p> : null}
        </div>
      </div>
    </div>
  );
}

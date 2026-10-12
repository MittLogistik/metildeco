"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/client";
import { localeForCountry, markets, type Locale } from "@/lib/i18n";
import { translatePath } from "@/lib/routes";

/** Texten skrivs på besökarens (landets) språk, inte sidans. */
const text: Record<Locale, { message: string; action: string; close: string }> = {
  sv: { message: "Handlar du från Sverige? Den svenska butiken har priser i kronor och leverans inom Sverige.", action: "Till svenska butiken", close: "Stäng" },
  fi: { message: "Asioitko Suomesta? Suomen verkkokaupassa hinnat ovat euroina ja toimitus Suomeen.", action: "Siirry Suomen kauppaan", close: "Sulje" },
  da: { message: "Handler du fra Danmark? Den danske butik har priser i kroner og levering til Danmark.", action: "Gå til den danske butik", close: "Luk" },
};

const MARKET_COUNTRIES = new Set(Object.values(markets).map((m) => m.country as string));
const DISMISS_KEY = "metilde_market_hint";
const GEO_KEY = "metilde_geo";

/** Besökarens land, hämtat en gång per flik (sessionStorage) från /api/geo. */
async function visitorCountry(): Promise<string | null> {
  try {
    const cached = sessionStorage.getItem(GEO_KEY);
    if (cached !== null) return cached || null;
  } catch {
    /* lagring blockerad – hämta ändå */
  }
  const res = await fetch("/api/geo", { cache: "no-store" }).catch(() => null);
  const country = res?.ok ? (((await res.json()) as { country: string | null }).country ?? null) : null;
  try {
    sessionStorage.setItem(GEO_KEY, country ?? "");
  } catch {
    /* ignoreras */
  }
  return country;
}

/**
 * Diskret rad överst när besökaren verkar vara i ett annat av våra länder än sidans marknad,
 * t.ex. någon i Finland på /sv. Tvingar ingen och visas inte igen när den stängts.
 */
export function MarketHint() {
  const { locale } = useI18n();
  const pathname = usePathname();
  const [target, setTarget] = useState<Locale | null>(null);

  useEffect(() => {
    let alive = true;
    visitorCountry().then((country) => {
      if (!alive || !country || !MARKET_COUNTRIES.has(country)) return;
      const suggested = localeForCountry(country);
      if (suggested === locale) return;
      try {
        if (localStorage.getItem(DISMISS_KEY) === suggested) return;
      } catch {
        /* utan lagring visas raden tills den stängs */
      }
      setTarget(suggested);
    });
    return () => {
      alive = false;
    };
  }, [locale]);

  if (!target) return null;
  const t = text[target];
  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, target);
    } catch {
      /* ignoreras */
    }
    setTarget(null);
  };
  return (
    <div lang={target} className="border-b border-line bg-sand-soft">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2.5 text-[13px] sm:flex-row sm:items-center sm:gap-4 sm:px-6 sm:text-sm lg:px-8">
        <p className="min-w-0 flex-1 text-muted">{t.message}</p>
        <div className="flex items-center justify-between gap-3">
          <Link href={translatePath(pathname, target)} onClick={dismiss} className="inline-flex h-9 items-center rounded-full bg-primary px-4 text-[13px] font-medium text-primary-fg sm:text-sm">
            {t.action}
          </Link>
          <button type="button" onClick={dismiss} aria-label={t.close} className="grid size-9 place-items-center rounded-full text-muted hover:text-foreground">
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

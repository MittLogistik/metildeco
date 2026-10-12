"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { readConsent, writeConsent, type Consent } from "@/lib/consent";
import { useI18n } from "@/i18n/client";
import { layout } from "@/i18n/messages/layout";

const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  const onChange = () => cb();
  window.addEventListener("metilde:consent", onChange);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("metilde:consent", onChange);
  };
};
const notify = () => listeners.forEach((cb) => cb());

/** Öppnar bannern igen, t.ex. från länken Cookieinställningar i sidfoten. */
export const openCookieSettings = () => {
  document.cookie = "metilde_consent=; Max-Age=0; Path=/";
  notify();
};

/** Samtyckesbanner. Marknadsföringscookies (Meta Pixel, Google-taggen) sätts först efter Acceptera alla. */
export function CookieBanner() {
  const { locale, r } = useI18n();
  const t = layout[locale].cookie;
  const consent = useSyncExternalStore(subscribe, readConsent, () => "necessary" as Consent);
  if (consent) return null;
  const choose = (c: Consent) => {
    writeConsent(c);
    notify();
  };
  return (
    <div role="dialog" aria-label={t.title} className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-2xl border border-line bg-white p-5 shadow-float sm:inset-x-6 sm:bottom-6">
      <p className="font-display text-lg font-medium">{t.title}</p>
      <p className="mt-1 text-sm text-muted">
        {t.text}{" "}
        <Link href={r.cookies} className="underline">
          {t.policy}
        </Link>
        .
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={() => choose("necessary")} className="h-11 rounded-full border border-line px-5 text-sm font-medium hover:bg-sand">
          {t.necessary}
        </button>
        <button type="button" onClick={() => choose("all")} className="h-11 rounded-full bg-primary px-5 text-sm font-medium text-primary-fg hover:bg-primary-hover">
          {t.acceptAll}
        </button>
      </div>
    </div>
  );
}

export function CookieSettingsLink({ className = "" }: { className?: string }) {
  const { locale } = useI18n();
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      {layout[locale].cookie.settings}
    </button>
  );
}

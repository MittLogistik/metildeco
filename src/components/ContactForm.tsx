"use client";

import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/i18n/client";
import { layout } from "@/i18n/messages/layout";
import { company } from "@/lib/site";
import { Button } from "@/components/ui";

const field =
  "h-11 w-full rounded-xl border border-line bg-white px-3.5 text-sm placeholder:text-muted-soft focus:border-primary focus:outline-none";

/**
 * Kontaktformulär. Skickas till kundservice via /api/contact; kunden får svaret direkt på sin e-post.
 * Ämnet skickas alltid på svenska (kundservice), kunden ser det på sitt språk.
 */
export function ContactForm() {
  const { locale, r } = useI18n();
  const t = layout[locale].contactForm;
  const [state, setState] = useState<{ status: "idle" | "sending" | "sent" | "error"; error?: string }>({ status: "idle" });

  if (state.status === "sent") {
    return (
      <div className="rounded-2xl bg-primary-soft p-6">
        <h3 className="font-display text-xl font-medium">{t.sentTitle}</h3>
        <p className="mt-2 text-sm text-muted">{t.sentText}</p>
        <button type="button" onClick={() => setState({ status: "idle" })} className="mt-4 text-sm font-medium underline underline-offset-2">
          {t.another}
        </button>
      </div>
    );
  }

  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={async (e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        setState({ status: "sending" });
        try {
          const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ kind: "contact", name: f.get("name"), email: f.get("email"), order: f.get("order"), topic: f.get("topic"), message: f.get("message"), website: f.get("website") }),
          });
          const data = (await res.json()) as { ok?: boolean; error?: string };
          // API:ets felmeddelanden är på svenska – på andra språk visas ett allmänt fel
          if (!res.ok || !data.ok) throw new Error((locale === "sv" && data.error) || t.genericError);
          setState({ status: "sent" });
        } catch (err) {
          setState({ status: "error", error: locale === "sv" && err instanceof Error ? err.message : t.genericError });
        }
      }}
    >
      <label className="text-sm">
        <span className="mb-1.5 block font-medium">{t.name}</span>
        <input name="name" required autoComplete="name" placeholder={t.namePlaceholder} className={field} />
      </label>
      <label className="text-sm">
        <span className="mb-1.5 block font-medium">{t.email}</span>
        <input name="email" type="email" required autoComplete="email" placeholder={t.emailPlaceholder} className={field} />
      </label>
      <label className="text-sm">
        <span className="mb-1.5 block font-medium">{t.order}</span>
        <input name="order" placeholder="MO-0001" className={field} />
      </label>
      <label className="text-sm">
        <span className="mb-1.5 block font-medium">{t.topic}</span>
        <select name="topic" className={field} defaultValue={t.topics[0].value}>
          {t.topics.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm sm:col-span-2">
        <span className="mb-1.5 block font-medium">{t.message}</span>
        <textarea
          name="message"
          required
          minLength={10}
          rows={6}
          placeholder={t.messagePlaceholder}
          className="w-full rounded-xl border border-line bg-white p-3.5 text-sm placeholder:text-muted-soft focus:border-primary focus:outline-none"
        />
      </label>
      {/* Honungsfälla för robotar – dold för människor */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" disabled={state.status === "sending"}>
          {state.status === "sending" ? t.sending : t.submit}
        </Button>
        {state.status === "error" ? (
          <p role="alert" className="mt-3 text-sm text-danger">
            {state.error} {t.mailInstead}{" "}
            <a href={`mailto:${company.email}`} className="underline">
              {company.email}
            </a>
            .
          </p>
        ) : null}
        <p className="mt-3 text-xs text-muted">
          {t.privacyBefore}{" "}
          <Link href={r.privacy} className="underline">
            {t.privacy}
          </Link>
          .
        </p>
      </div>
    </form>
  );
}

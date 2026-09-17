"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { company } from "@/lib/site";
import { Button } from "@/components/ui";

const channels = ["Instagram", "TikTok", "Blogg", "YouTube"];
const tiers = [
  { min: 1000, label: "1 000 följare", fee: 1000, note: "Nano – 1 inlägg eller 2 stories" },
  { min: 5000, label: "5 000 följare", fee: 5000, note: "Micro – 1 inlägg + 2 stories" },
  { min: 10000, label: "10 000 följare", fee: 10000, note: "Mid – 1 reel + 3 stories" },
  { min: 25000, label: "25 000+ följare", fee: 25000, note: "Makro – paket enligt offert" },
];

const field = "h-11 w-full rounded-xl border border-line bg-white px-3.5 text-sm placeholder:text-muted-soft focus:border-primary focus:outline-none";

/** Förfrågan skickas som mejl till kundservice tills ett eget ärendesystem finns. */
export function PartnerForm() {
  const [selected, setSelected] = useState<string[]>([]);
  const [tier, setTier] = useState(tiers[0]!);
  const [sent, setSent] = useState(false);
  const toggle = (c: string) => setSelected((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]));

  if (sent) {
    return (
      <div className="rounded-card bg-primary-soft p-6">
        <h2 className="font-display text-xl font-medium">Tack! Ditt mejlprogram har öppnats</h2>
        <p className="mt-2 text-sm text-muted">Skicka mejlet så hör vi av oss inom fem arbetsdagar. Öppnades inget? Mejla {company.email} direkt.</p>
      </div>
    );
  }

  return (
    <form
      className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]"
      onSubmit={(e) => {
        e.preventDefault();
        if (selected.length === 0) {
          window.alert("Välj minst en kanal.");
          return;
        }
        const f = new FormData(e.currentTarget);
        const subject = `Samarbete – ${selected.join(", ")} – ${tier.label}`;
        const body = `Namn: ${f.get("name")}\nE-post: ${f.get("email")}\nKanaler: ${selected.join(", ")}\nFöljare: ${tier.label}\nLänk/användarnamn: ${f.get("handle")}\n\n${f.get("about")}`;
        window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setSent(true);
      }}
    >
      <div className="space-y-8">
        <section>
          <h2 className="font-display text-xl font-medium">1. Var vill du samarbeta?</h2>
          <p className="text-sm text-muted">Välj en eller flera kanaler.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {channels.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => toggle(c)}
                aria-pressed={selected.includes(c)}
                className={`rounded-full border px-4 py-2 text-sm ${selected.includes(c) ? "border-primary bg-primary text-primary-fg" : "border-line hover:border-foreground/40"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </section>
        <section>
          <h2 className="font-display text-xl font-medium">2. Hur många följare har du?</h2>
          <p className="text-sm text-muted">Har du flera kanaler, välj din största.</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {tiers.map((t) => (
              <button
                key={t.min}
                type="button"
                onClick={() => setTier(t)}
                aria-pressed={tier.min === t.min}
                className={`rounded-2xl border p-4 text-left ${tier.min === t.min ? "border-primary bg-primary-soft" : "border-line hover:border-foreground/40"}`}
              >
                <span className="block text-sm font-semibold">{t.label}</span>
                <span className="block text-xs text-muted">{t.note}</span>
              </button>
            ))}
          </div>
        </section>
        <section>
          <h2 className="font-display text-xl font-medium">3. Berätta om dig själv</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1.5 block font-medium">Namn</span>
              <input name="name" required placeholder="Anna Andersson" className={field} />
            </label>
            <label className="text-sm">
              <span className="mb-1.5 block font-medium">E-post</span>
              <input name="email" type="email" required placeholder="anna@exempel.se" className={field} />
            </label>
            <label className="text-sm sm:col-span-2">
              <span className="mb-1.5 block font-medium">Länk eller användarnamn</span>
              <input name="handle" required placeholder="@dittkonto" className={field} />
            </label>
            <label className="text-sm sm:col-span-2">
              <span className="mb-1.5 block font-medium">Om dig och din publik</span>
              <textarea name="about" required minLength={20} rows={5} placeholder="Berätta om ditt innehåll, din målgrupp och hur du skulle vilja jobba med Metilde." className="w-full rounded-xl border border-line bg-white p-3.5 text-sm placeholder:text-muted-soft focus:border-primary focus:outline-none" />
            </label>
          </div>
        </section>
      </div>
      <aside className="h-fit rounded-card bg-sand-soft p-6 lg:sticky lg:top-24">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">Din nivå</p>
        <p className="mt-2 font-display text-3xl font-medium">{tier.min >= 25000 ? `${formatPrice(tier.fee)}+` : formatPrice(tier.fee)}</p>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Kanaler</dt>
            <dd>{selected.length ? selected.join(", ") : "Ingen vald"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Följare</dt>
            <dd>{tier.label}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Produkter</dt>
            <dd>Ingår</dd>
          </div>
        </dl>
        <Button type="submit" className="mt-5 w-full">
          Skicka förfrågan
        </Button>
        <p className="mt-3 text-xs text-muted">Ersättningen är vägledande och kan justeras utifrån omfattning, format och räckvidd. Vi svarar normalt inom fem arbetsdagar.</p>
      </aside>
    </form>
  );
}

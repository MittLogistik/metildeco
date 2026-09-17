"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui";

const amounts = [200, 300, 500, 750, 1000, 1500];
const field = "h-11 w-full rounded-xl border border-line bg-white px-3.5 text-sm placeholder:text-muted-soft focus:border-primary focus:outline-none";

export function GiftCardForm() {
  const [amount, setAmount] = useState(500);
  const [toRecipient, setToRecipient] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-5"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError(null);
        const f = new FormData(e.currentTarget);
        try {
          const res = await fetch("/api/giftcard", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount,
              recipient: toRecipient ? f.get("recipient") : "",
              from: f.get("from"),
              message: f.get("message"),
            }),
          });
          const data = (await res.json()) as { url?: string; error?: string };
          if (!res.ok || !data.url) throw new Error(data.error ?? "Kunde inte starta betalningen.");
          window.location.assign(data.url);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Något gick fel.");
          setBusy(false);
        }
      }}
    >
      <fieldset>
        <legend className="mb-2 text-sm font-medium">Värde</legend>
        <div className="grid grid-cols-3 gap-2">
          {amounts.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAmount(a)}
              aria-pressed={amount === a}
              className={`rounded-2xl border p-3 text-center text-sm font-medium ${amount === a ? "border-primary bg-primary-soft" : "border-line hover:border-foreground/40"}`}
            >
              {formatPrice(a)}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="flex items-start gap-2.5 text-sm">
        <input type="checkbox" checked={toRecipient} onChange={(e) => setToRecipient(e.target.checked)} className="mt-0.5 h-4 w-4 accent-primary" />
        <span>
          <span className="font-medium">Skicka presentkortet direkt till mottagaren</span>
          <span className="block text-xs text-muted">Annars skickas det till din e-post så att du kan ge det själv.</span>
        </span>
      </label>
      {toRecipient ? (
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Mottagarens e-post</span>
          <input name="recipient" type="email" required placeholder="mottagare@exempel.se" className={field} />
        </label>
      ) : null}
      <label className="block text-sm">
        <span className="mb-1.5 block font-medium">Från (valfritt)</span>
        <input name="from" placeholder="Ditt namn" className={field} />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block font-medium">Hälsning (valfritt)</span>
        <textarea name="message" rows={3} maxLength={300} placeholder="Grattis på födelsedagen!" className="w-full rounded-xl border border-line bg-white p-3.5 text-sm placeholder:text-muted-soft focus:border-primary focus:outline-none" />
      </label>

      <dl className="space-y-1 border-t border-line pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Värde</dt>
          <dd className="tabular-nums">{formatPrice(amount)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Frakt</dt>
          <dd>Fraktfritt</dd>
        </div>
        <div className="flex justify-between text-base font-semibold">
          <dt>Totalt</dt>
          <dd className="tabular-nums">{formatPrice(amount)}</dd>
        </div>
      </dl>
      {error ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
      <Button type="submit" size="lg" className="w-full" disabled={busy}>
        {busy ? "Förbereder säker betalning …" : `Köp presentkort · ${formatPrice(amount)}`}
      </Button>
    </form>
  );
}

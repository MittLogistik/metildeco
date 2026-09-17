"use client";

import Link from "next/link";
import { useState } from "react";
import { routes } from "@/lib/routes";
import { company } from "@/lib/site";
import { Button } from "@/components/ui";

const topics = ["Min order", "Fråga om en produkt", "Prenumeration", "Retur eller reklamation", "Samarbete", "Övrigt"];

const field =
  "h-11 w-full rounded-xl border border-line bg-white px-3.5 text-sm placeholder:text-muted-soft focus:border-primary focus:outline-none";

/**
 * Kontaktformulär. Tills backend finns öppnas ett färdigskrivet mejl i
 * användarens e-postprogram – meddelandet når alltid fram.
 */
export function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="rounded-2xl bg-primary-soft p-6">
        <h3 className="font-display text-xl font-medium">Ditt e-postprogram har öppnats</h3>
        <p className="mt-2 text-sm text-muted">
          Skicka mejlet så återkommer vi inom 1–2 arbetsdagar. Öppnades inget? Mejla oss direkt på{" "}
          <a href={`mailto:${company.email}`} className="underline">
            {company.email}
          </a>
          .
        </p>
        <button type="button" onClick={() => setSent(false)} className="mt-4 text-sm font-medium underline underline-offset-2">
          Skriv ett till meddelande
        </button>
      </div>
    );
  }

  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const subject = `${f.get("topic")}${f.get("order") ? ` – order ${f.get("order")}` : ""}`;
        const body = `${f.get("message")}\n\n—\n${f.get("name")}\n${f.get("email")}`;
        window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setSent(true);
      }}
    >
      <label className="text-sm">
        <span className="mb-1.5 block font-medium">Namn</span>
        <input name="name" required autoComplete="name" placeholder="Anna Andersson" className={field} />
      </label>
      <label className="text-sm">
        <span className="mb-1.5 block font-medium">E-post</span>
        <input name="email" type="email" required autoComplete="email" placeholder="du@exempel.se" className={field} />
      </label>
      <label className="text-sm">
        <span className="mb-1.5 block font-medium">Ordernummer (valfritt)</span>
        <input name="order" placeholder="MO-0001" className={field} />
      </label>
      <label className="text-sm">
        <span className="mb-1.5 block font-medium">Vad gäller det?</span>
        <select name="topic" className={field} defaultValue={topics[0]}>
          {topics.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
      <label className="text-sm sm:col-span-2">
        <span className="mb-1.5 block font-medium">Meddelande</span>
        <textarea
          name="message"
          required
          minLength={10}
          rows={6}
          placeholder="Beskriv ditt ärende så utförligt du kan."
          className="w-full rounded-xl border border-line bg-white p-3.5 text-sm placeholder:text-muted-soft focus:border-primary focus:outline-none"
        />
      </label>
      <div className="sm:col-span-2">
        <Button type="submit" size="lg">
          Skicka meddelande
        </Button>
        <p className="mt-3 text-xs text-muted">
          Vi använder dina uppgifter enbart för att svara på ditt ärende. Läs mer i vår{" "}
          <Link href={routes.privacy} className="underline">
            integritetspolicy
          </Link>
          .
        </p>
      </div>
    </form>
  );
}

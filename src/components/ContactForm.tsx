"use client";

import Link from "next/link";
import { useState } from "react";
import { routes } from "@/lib/routes";
import { company } from "@/lib/site";
import { Button } from "@/components/ui";

const topics = ["Min order", "Fråga om en produkt", "Prenumeration", "Retur eller reklamation", "Samarbete", "Övrigt"];

const field =
  "h-11 w-full rounded-xl border border-line bg-white px-3.5 text-sm placeholder:text-muted-soft focus:border-primary focus:outline-none";

/** Kontaktformulär. Skickas till kundservice via /api/contact; kunden får svaret direkt på sin e-post. */
export function ContactForm() {
  const [state, setState] = useState<{ status: "idle" | "sending" | "sent" | "error"; error?: string }>({ status: "idle" });

  if (state.status === "sent") {
    return (
      <div className="rounded-2xl bg-primary-soft p-6">
        <h3 className="font-display text-xl font-medium">Tack, ditt meddelande är skickat</h3>
        <p className="mt-2 text-sm text-muted">Vi svarar inom 1–2 arbetsdagar till den e-postadress du angav.</p>
        <button type="button" onClick={() => setState({ status: "idle" })} className="mt-4 text-sm font-medium underline underline-offset-2">
          Skriv ett till meddelande
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
          if (!res.ok || !data.ok) throw new Error(data.error ?? "Något gick fel.");
          setState({ status: "sent" });
        } catch (err) {
          setState({ status: "error", error: err instanceof Error ? err.message : "Något gick fel." });
        }
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
      {/* Honungsfälla för robotar – dold för människor */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" disabled={state.status === "sending"}>
          {state.status === "sending" ? "Skickar …" : "Skicka meddelande"}
        </Button>
        {state.status === "error" ? (
          <p role="alert" className="mt-3 text-sm text-danger">
            {state.error} Du kan också mejla{" "}
            <a href={`mailto:${company.email}`} className="underline">
              {company.email}
            </a>
            .
          </p>
        ) : null}
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

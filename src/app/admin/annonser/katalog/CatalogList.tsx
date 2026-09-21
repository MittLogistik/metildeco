"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export type CatalogView = {
  id: string;
  label: string;
  variantId: string;
  status: string;
  adId: string | null;
  primaryText: string | null;
  headline: string | null;
  createdAt: string;
  cards: { position: number; slug: string; headline: string; description: string | null; url: string; score: number | null }[];
};

const post = async (body: Record<string, unknown>) => {
  const res = await fetch("/api/admin/catalog", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
  if (!res.ok || !data.ok) throw new Error(data.error ?? `Serverfel (${res.status}).`);
  return data;
};

/** En katalog som den ser ut i flödet: korten i rad, primärtexten ovanför. */
export function CatalogList({ catalogs, budget }: { catalogs: CatalogView[]; budget: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function act(id: string, action: "publish" | "delete") {
    if (action === "delete" && !window.confirm("Katalogen och dess bilder tas bort för alltid. Ta bort?")) return;
    setBusy(id);
    setError(null);
    try {
      await post({ action, id, dailyBudget: budget });
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Fel");
    }
    setBusy(null);
  }

  if (!catalogs.length) return <p className="text-sm text-muted">Inga kataloger ännu.</p>;

  return (
    <div className="space-y-5">
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      {catalogs.map((c) => (
        <section key={c.id} className="rounded-card border border-line bg-white p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-lg font-medium">{c.label}</h3>
              <p className="text-xs text-muted">
                {c.cards.length} kort · {new Date(c.createdAt).toLocaleString("sv-SE", { dateStyle: "short", timeStyle: "short" })}
                {c.status === "published" ? " · publicerad (pausad)" : " · utkast"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {c.status === "published" ? (
                <span className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">Annons {c.adId}</span>
              ) : (
                <button
                  type="button"
                  onClick={() => void act(c.id, "publish")}
                  disabled={busy === c.id}
                  className="h-9 rounded-full bg-primary px-3.5 text-sm font-medium text-primary-fg hover:bg-primary-hover disabled:opacity-60"
                >
                  {busy === c.id ? "Skapar …" : "Skapa pausad annons"}
                </button>
              )}
              <button
                type="button"
                onClick={() => void act(c.id, "delete")}
                disabled={busy === c.id}
                className="h-9 rounded-full border border-danger/30 px-3.5 text-sm text-danger hover:bg-danger/5 disabled:opacity-60"
              >
                Ta bort
              </button>
            </div>
          </div>

          {c.primaryText ? <p className="mt-3 whitespace-pre-line rounded-xl bg-sand-soft p-3 text-sm">{c.primaryText}</p> : null}

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {c.cards.map((card) => (
              <figure key={card.position} className="w-48 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={card.url} alt="" className="aspect-square w-full rounded-lg object-cover" />
                <figcaption className="mt-1">
                  <span className="block truncate text-xs font-medium">{card.headline}</span>
                  <span className="block truncate text-[11px] text-muted">{card.description}</span>
                  {card.score !== null ? <span className="text-[11px] text-muted">{card.score} p</span> : null}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

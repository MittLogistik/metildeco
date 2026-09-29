"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

export type GiftCandidate = { slug: string; name: string; price: number; stock: number; trackStock: boolean; isActive: boolean; image: string | null };

/**
 * Väljare för gåvor till flerpacket: sök bland produkterna, se lagerstatus och bocka i en eller flera.
 * Den första ibockade blir standardgåvan; flera ibockade betyder att kunden får välja.
 * Skickas med formuläret som offer_gift_slug och offer_gift_choices.
 */
export function GiftPicker({ candidates, initial, excludeSlug }: { candidates: GiftCandidate[]; initial: string[]; excludeSlug: string | null }) {
  const [query, setQuery] = useState("");
  const [chosen, setChosen] = useState<string[]>(initial);
  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return candidates
      .filter((c) => c.slug !== excludeSlug)
      .filter((c) => !q || c.name.toLowerCase().includes(q) || c.slug.includes(q))
      .sort((a, b) => Number(chosen.includes(b.slug)) - Number(chosen.includes(a.slug)) || a.name.localeCompare(b.name, "sv"));
  }, [candidates, query, chosen, excludeSlug]);

  const toggle = (slug: string) => setChosen((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  const status = (c: GiftCandidate) => {
    if (!c.isActive) return { label: "Dold i butiken", tone: "text-muted" };
    if (!c.trackStock) return { label: "Lager spåras inte", tone: "text-muted" };
    if (c.stock <= 0) return { label: "Slut i lager", tone: "text-danger" };
    if (c.stock <= 10) return { label: `${c.stock} kvar`, tone: "text-accent" };
    return { label: `${c.stock} i lager`, tone: "text-success" };
  };

  return (
    <div>
      <input type="hidden" name="offer_gift_slug" value={chosen[0] ?? ""} />
      <input type="hidden" name="offer_gift_choices" value={chosen.length > 1 ? chosen.join(",") : ""} />
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Sök produkt …"
          className="h-10 w-full rounded-xl border border-line bg-white px-3 text-sm focus:border-primary focus:outline-none sm:w-64"
        />
        <p className="text-xs text-muted">
          {chosen.length === 0 ? "Ingen gåva vald." : chosen.length === 1 ? "En gåva vald: den följer med automatiskt." : `${chosen.length} gåvor valda: kunden väljer en av dem.`}
        </p>
      </div>
      <ul className="mt-3 max-h-72 divide-y divide-line overflow-y-auto rounded-xl border border-line bg-white">
        {list.length === 0 ? <li className="p-3 text-sm text-muted">Ingen produkt matchar.</li> : null}
        {list.map((c) => {
          const s = status(c);
          const checked = chosen.includes(c.slug);
          const order = chosen.indexOf(c.slug);
          return (
            <li key={c.slug}>
              <label className={`flex cursor-pointer items-center gap-3 px-3 py-2 text-sm ${checked ? "bg-primary-soft" : "hover:bg-sand"}`}>
                <input type="checkbox" checked={checked} onChange={() => toggle(c.slug)} className="h-4 w-4 accent-primary" />
                <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-sand">
                  {c.image ? <Image src={c.image} alt="" fill sizes="36px" className="object-contain p-0.5" /> : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{c.name}</span>
                  <span className={`block text-xs ${s.tone}`}>
                    {s.label} · {c.price} kr
                    {checked && order === 0 && chosen.length > 1 ? " · standardgåva" : ""}
                  </span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-xs text-muted">Gåvor som är slut i lager eller dolda visas inte för kunden, även om de är ibockade här. Lagersaldot kommer från Plocky.</p>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export type ProductOption = { slug: string; name: string; sku: string | null; image: string; stock: number; trackStock: boolean };
export type CardView = { id: string; position: number; slug: string; headline: string; description: string | null; url: string };
export type CatalogView = {
  id: string;
  label: string;
  status: string;
  adId: string | null;
  primaryText: string | null;
  headline: string | null;
  createdAt: string;
  cards: CardView[];
};

type Result = { ok?: boolean; error?: string; id?: string; card?: CardView; cards?: CardView[]; catalog?: CatalogView | null; signedUrl?: string; path?: string; primaryText?: string; headline?: string; source?: string; adId?: string };

const post = async (body: Record<string, unknown>): Promise<Result> => {
  const res = await fetch("/api/admin/catalog", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const data = (await res.json().catch(() => ({}))) as Result;
  if (!res.ok || !data.ok) throw new Error(data.error ?? `Serverfel (${res.status}).`);
  return data;
};

const extOf = (file: File) => {
  const fromName = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (/^[a-z0-9]{1,5}$/.test(fromName)) return fromName === "jpeg" ? "jpg" : fromName;
  return file.type.includes("png") ? "png" : "jpg";
};

/** Laddar upp filen direkt till lagringen och returnerar sökvägen servern ska hämta. */
async function uploadRaw(catalogId: string, file: File): Promise<string> {
  const signed = await post({ action: "sign", id: catalogId, ext: extOf(file) });
  const put = await fetch(signed.signedUrl!, { method: "PUT", body: file, headers: { "content-type": file.type || "application/octet-stream" } });
  if (!put.ok) throw new Error(`Lagringen svarade ${put.status}.`);
  return signed.path!;
}

/**
 * Bygger en katalogannons: ladda upp bilder, koppla varje bild till en produkt, bestäm
 * ordningen och godkänn annonstexten. Först därefter startas kampanjen.
 */
export function CatalogBuilder({
  catalog,
  inStock,
  outOfStock,
  maxCards,
  minCards,
  budget,
}: {
  catalog: CatalogView | null;
  inStock: ProductOption[];
  outOfStock: ProductOption[];
  maxCards: number;
  minCards: number;
  budget: number;
}) {
  const router = useRouter();
  const [cards, setCards] = useState<CardView[]>(catalog?.cards ?? []);
  const [label, setLabel] = useState(catalog?.label ?? "");
  const [slug, setSlug] = useState(inStock[0]?.slug ?? "");
  const [primaryText, setPrimaryText] = useState(catalog?.primaryText ?? "");
  const [headline, setHeadline] = useState(catalog?.headline ?? "");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const cardFile = useRef<HTMLInputElement>(null);
  const wideFile = useRef<HTMLInputElement>(null);
  const [wideSlugs, setWideSlugs] = useState<string[]>([]);

  const id = catalog?.id ?? null;
  const published = catalog?.status === "published";

  const run = async (name: string, fn: () => Promise<void>) => {
    setBusy(name);
    setError(null);
    setNote(null);
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Något gick fel.");
    }
    setBusy(null);
  };

  const ensureCatalog = async (): Promise<string> => {
    if (id) return id;
    const created = await post({ action: "create", label });
    router.refresh();
    return created.id!;
  };

  /* ------------------------------ ett kort i taget ----------------------------- */
  const addCard = () =>
    run("card", async () => {
      const file = cardFile.current?.files?.[0];
      if (!file) throw new Error("Välj en bild.");
      if (!slug) throw new Error("Välj en produkt.");
      if (cards.length >= maxCards) throw new Error(`Högst ${maxCards} kort.`);
      const catalogId = await ensureCatalog();
      const path = await uploadRaw(catalogId, file);
      const r = await post({ action: "attach", id: catalogId, path, position: cards.length + 1, slug });
      setCards((c) => [...c, r.card!]);
      if (cardFile.current) cardFile.current.value = "";
      setNote(`${r.card!.headline} lades till som kort ${r.card!.position}.`);
      router.refresh();
    });

  /* --------------------------- en bred bild som delas -------------------------- */
  const sliceWide = () =>
    run("wide", async () => {
      const file = wideFile.current?.files?.[0];
      if (!file) throw new Error("Välj en bild.");
      if (wideSlugs.length < minCards) throw new Error(`Välj minst ${minCards} produkter, i den ordning de ska visas.`);
      const catalogId = await ensureCatalog();
      const path = await uploadRaw(catalogId, file);
      const r = await post({ action: "slice", id: catalogId, path, slugs: wideSlugs });
      setCards(r.cards!);
      if (wideFile.current) wideFile.current.value = "";
      setNote(`Bilden delades i ${r.cards!.length} kort.`);
      router.refresh();
    });

  /* ---------------------------------- ordning --------------------------------- */
  const move = (index: number, dir: -1 | 1) =>
    run("order", async () => {
      const next = [...cards];
      const target = index + dir;
      if (target < 0 || target >= next.length) return;
      [next[index], next[target]] = [next[target]!, next[index]!];
      setCards(next);
      const r = await post({ action: "reorder", id: id!, cardIds: next.map((c) => c.id) });
      if (r.catalog) setCards(r.catalog.cards);
      router.refresh();
    });

  const drop = (cardId: string) =>
    run("drop", async () => {
      await post({ action: "removeCard", id: id!, cardId });
      setCards((c) => c.filter((x) => x.id !== cardId));
      router.refresh();
    });

  /* ----------------------------------- texten --------------------------------- */
  const suggest = () =>
    run("suggest", async () => {
      const r = await post({ action: "suggest", id: id! });
      setPrimaryText(r.primaryText ?? "");
      setHeadline(r.headline ?? "");
      setNote(r.source === "ai" ? "Förslag skrivet av AI. Ändra det du vill och godkänn." : "AI var inte tillgänglig, så förslaget bygger på produkternas fakta.");
    });

  const approve = () =>
    run("approve", async () => {
      await post({ action: "saveCopy", id: id!, primaryText, headline });
      setNote("Texten är godkänd. Nu kan kampanjen startas.");
      router.refresh();
    });

  const publish = () =>
    run("publish", async () => {
      const r = await post({ action: "publish", id: id!, dailyBudget: budget });
      setNote(`Kampanjen är skapad och pausad. Annons ${r.adId}.`);
      router.refresh();
    });

  const toggleWideSlug = (s: string) => setWideSlugs((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : cur.length >= maxCards ? cur : [...cur, s]));
  const input = "h-10 w-full rounded-xl border border-line bg-white px-3 text-sm focus:border-primary focus:outline-none";
  const ready = cards.length >= minCards;
  const approved = Boolean(catalog?.primaryText?.trim());

  return (
    <div className="space-y-6">
      {error ? <p className="rounded-xl bg-danger/10 p-3 text-sm text-danger">{error}</p> : null}
      {note ? <p className="rounded-xl bg-success/10 p-3 text-sm text-success">{note}</p> : null}

      <label className="block text-sm">
        <span className="mb-1 block font-medium">Namn på katalogen</span>
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Höstkampanj" disabled={Boolean(id)} className={input} />
        {id ? <span className="mt-1 block text-xs text-muted">Katalogen är skapad. Namnet används som annonsgruppens namn i Meta.</span> : null}
      </label>

      {/* Steg 1 */}
      <section className="rounded-2xl border border-line bg-white p-4">
        <h3 className="font-display text-lg font-medium">1. Bilder och produkter</h3>
        <p className="mt-1 text-sm text-muted">
          Ladda upp en bild per kort, eller en bred bild som delas i lika delar. Enskilda kort beskärs till 1080 × 1080. En bred bild sträcks till rätt
          proportion i stället för att beskäras, så att inget i kanterna försvinner.
        </p>

        <div className="mt-4 grid gap-5 lg:grid-cols-2">
          <div className="rounded-xl bg-sand-soft p-3">
            <p className="text-sm font-medium">Ett kort i taget</p>
            <div className="mt-2 space-y-2">
              <input ref={cardFile} type="file" accept="image/*" disabled={published} className="block w-full text-sm" />
              <select value={slug} onChange={(e) => setSlug(e.target.value)} disabled={published} className={input}>
                {inStock.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={addCard}
                disabled={busy !== null || published}
                className="h-10 rounded-full bg-primary px-4 text-sm font-medium text-primary-fg hover:bg-primary-hover disabled:opacity-60"
              >
                {busy === "card" ? "Lägger till …" : "Lägg till kort"}
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-sand-soft p-3">
            <p className="text-sm font-medium">En bred bild som delas</p>
            <p className="mt-1 text-xs text-muted">
              Välj produkterna i den ordning de ska visas. Bilden delas i lika många delar. Gör den {wideSlugs.length || "N"} × 1080 bred och 1080 hög
              ({wideSlugs.length ? wideSlugs.length * 1080 : "N×1080"} × 1080) så hamnar skarvarna exakt rätt.
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {inStock.map((p) => {
                const pos = wideSlugs.indexOf(p.slug);
                return (
                  <button
                    key={p.slug}
                    type="button"
                    onClick={() => toggleWideSlug(p.slug)}
                    disabled={published}
                    className={`rounded-full px-2.5 py-1 text-xs ${pos >= 0 ? "bg-primary text-primary-fg" : "border border-line bg-white text-muted hover:text-foreground"}`}
                  >
                    {pos >= 0 ? `${pos + 1}. ` : ""}
                    {p.name}
                  </button>
                );
              })}
            </div>
            <div className="mt-2 space-y-2">
              <input ref={wideFile} type="file" accept="image/*" disabled={published} className="block w-full text-sm" />
              <button
                type="button"
                onClick={sliceWide}
                disabled={busy !== null || published}
                className="h-10 rounded-full border border-line bg-white px-4 text-sm font-medium hover:bg-sand disabled:opacity-60"
              >
                {busy === "wide" ? "Delar bilden …" : `Dela i ${wideSlugs.length || "–"} kort`}
              </button>
            </div>
          </div>
        </div>

        {outOfStock.length ? (
          <p className="mt-3 text-xs text-muted">Slut i lager och därför utelämnade: {outOfStock.map((p) => p.name).join(", ")}.</p>
        ) : null}
      </section>

      {/* Steg 2 */}
      <section className="rounded-2xl border border-line bg-white p-4">
        <h3 className="font-display text-lg font-medium">2. Ordning ({cards.length} kort)</h3>
        <p className="mt-1 text-sm text-muted">Ordningen avgör hur korten möts när man swipar. Pilarna flyttar ett kort.</p>
        {cards.length === 0 ? (
          <p className="mt-3 text-sm text-muted">Inga kort ännu.</p>
        ) : (
          <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
            {cards.map((c, i) => (
              <figure key={c.id} className="w-44 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.url} alt="" className="aspect-square w-full rounded-lg object-cover" />
                <figcaption className="mt-1">
                  <span className="block truncate text-xs font-medium">
                    {i + 1}. {c.headline}
                  </span>
                  <span className="block truncate text-[11px] text-muted">{c.description}</span>
                </figcaption>
                {published ? null : (
                  <div className="mt-1 flex gap-1">
                    <button type="button" onClick={() => move(i, -1)} disabled={i === 0 || busy !== null} className="h-7 flex-1 rounded-lg border border-line text-xs disabled:opacity-40">
                      ←
                    </button>
                    <button type="button" onClick={() => move(i, 1)} disabled={i === cards.length - 1 || busy !== null} className="h-7 flex-1 rounded-lg border border-line text-xs disabled:opacity-40">
                      →
                    </button>
                    <button type="button" onClick={() => drop(c.id)} disabled={busy !== null} className="h-7 flex-1 rounded-lg border border-danger/30 text-xs text-danger disabled:opacity-40">
                      Ta bort
                    </button>
                  </div>
                )}
              </figure>
            ))}
          </div>
        )}
      </section>

      {/* Steg 3 */}
      <section className="rounded-2xl border border-line bg-white p-4">
        <h3 className="font-display text-lg font-medium">3. Annonstext</h3>
        <p className="mt-1 text-sm text-muted">Rubrik och beskrivning per kort hämtas från produkterna. Det här är texten ovanför karusellen.</p>
        <div className="mt-3 space-y-3">
          <button
            type="button"
            onClick={suggest}
            disabled={!id || !ready || busy !== null || published}
            className="h-10 rounded-full border border-line bg-white px-4 text-sm font-medium hover:bg-sand disabled:opacity-60"
          >
            {busy === "suggest" ? "Skriver …" : "Föreslå annonstext"}
          </button>
          <textarea
            value={primaryText}
            onChange={(e) => setPrimaryText(e.target.value)}
            rows={7}
            disabled={published}
            placeholder="Texten som står ovanför karusellen."
            className="w-full rounded-xl border border-line bg-white p-3 text-sm focus:border-primary focus:outline-none"
          />
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Rubrik</span>
            <input value={headline} onChange={(e) => setHeadline(e.target.value)} maxLength={40} disabled={published} className={input} />
          </label>
          <button
            type="button"
            onClick={approve}
            disabled={!id || primaryText.trim().length < 20 || busy !== null || published}
            className="h-10 rounded-full bg-primary px-4 text-sm font-medium text-primary-fg hover:bg-primary-hover disabled:opacity-60"
          >
            {busy === "approve" ? "Sparar …" : "Godkänn texten"}
          </button>
        </div>
      </section>

      {/* Steg 4 */}
      <section className="rounded-2xl border border-line bg-white p-4">
        <h3 className="font-display text-lg font-medium">4. Starta kampanjen</h3>
        {published ? (
          <p className="mt-1 text-sm text-success">Kampanjen är skapad och pausad i Meta. Annons {catalog?.adId}.</p>
        ) : (
          <>
            <p className="mt-1 text-sm text-muted">
              Skapar en pausad karusellannons med {cards.length} kort och {budget} per dag i budget. Varje kort länkar till sin produktsida.
            </p>
            <button
              type="button"
              onClick={publish}
              disabled={!id || !ready || !approved || busy !== null}
              className="mt-3 h-10 rounded-full bg-primary px-4 text-sm font-medium text-primary-fg hover:bg-primary-hover disabled:opacity-60"
            >
              {busy === "publish" ? "Startar …" : "Starta katalogannonsen"}
            </button>
            {!approved ? <p className="mt-2 text-xs text-muted">Godkänn annonstexten först.</p> : null}
            {!ready ? <p className="mt-2 text-xs text-muted">Karusellen behöver minst {minCards} kort.</p> : null}
          </>
        )}
      </section>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export type ProductOption = { slug: string; name: string; sku: string | null; image: string; stock: number; trackStock: boolean };
export type VariantOption = { id: string; label: string; description: string };

type Run = { variantId: string; label: string; status: "väntar" | "arbetar" | "klar" | "fel"; note?: string };

const post = async (body: Record<string, unknown>) => {
  const res = await fetch("/api/admin/catalog", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
  if (!res.ok || !data.ok) throw new Error(data.error ?? `Serverfel (${res.status}).`);
  return data;
};

/**
 * Bygger katalogannonser: välj produkter som finns i lager, bygg båda varianterna och
 * jämför dem. Slutsålda produkter går inte att välja.
 */
export function CatalogBuilder({
  inStock,
  outOfStock,
  variants,
  maxCards,
  minCards,
}: {
  inStock: ProductOption[];
  outOfStock: ProductOption[];
  variants: VariantOption[];
  maxCards: number;
  minCards: number;
}) {
  const router = useRouter();
  const [picked, setPicked] = useState<string[]>(inStock.slice(0, 3).map((p) => p.slug));
  const [pickedVariants, setPickedVariants] = useState<string[]>(variants.map((v) => v.id));
  const [instructions, setInstructions] = useState("");
  const [runs, setRuns] = useState<Run[]>([]);
  const [running, setRunning] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const toggleProduct = (slug: string) => {
    setPicked((cur) => {
      if (cur.includes(slug)) return cur.filter((s) => s !== slug);
      if (cur.length >= maxCards) return cur;
      return [...cur, slug];
    });
  };
  const toggleVariant = (id: string) => setPickedVariants((cur) => (cur.includes(id) ? cur.filter((v) => v !== id) : [...cur, id]));

  const ready = picked.length >= minCards && pickedVariants.length > 0;

  async function run() {
    if (!ready || running) return;
    const plan: Run[] = pickedVariants.map((id) => ({ variantId: id, label: variants.find((v) => v.id === id)?.label ?? id, status: "väntar" }));
    setRuns(plan);
    setSummary(null);
    setRunning(true);
    let ok = 0;
    let failed = 0;
    for (const r of plan) {
      setRuns((rs) => rs.map((x) => (x.variantId === r.variantId ? { ...x, status: "arbetar" } : x)));
      try {
        await post({ slugs: picked, variantId: r.variantId, customInstructions: instructions.trim() || undefined });
        ok++;
        setRuns((rs) => rs.map((x) => (x.variantId === r.variantId ? { ...x, status: "klar" } : x)));
      } catch (e) {
        failed++;
        setRuns((rs) => rs.map((x) => (x.variantId === r.variantId ? { ...x, status: "fel", note: e instanceof Error ? e.message : "Fel" } : x)));
      }
    }
    setRunning(false);
    setSummary(`${ok} kataloger klara${failed ? `, ${failed} fel` : ""}.`);
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium">
            Produkter i karusellen <span className="text-muted">({picked.length} av högst {maxCards})</span>
          </p>
          <span className="text-xs text-muted">Ordningen följer listan. Slutsålda kan inte väljas.</span>
        </div>
        <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {inStock.map((p) => {
            const on = picked.includes(p.slug);
            const full = !on && picked.length >= maxCards;
            return (
              <button
                key={p.slug}
                type="button"
                onClick={() => toggleProduct(p.slug)}
                disabled={running || full}
                className={`flex items-center gap-3 rounded-2xl border p-2.5 text-left transition-colors ${on ? "border-primary bg-primary-soft/40" : "border-line bg-white hover:border-primary/40"} ${full ? "opacity-50" : ""}`}
              >
                <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] ${on ? "border-primary bg-primary text-primary-fg" : "border-line"}`}>{on ? "✓" : ""}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt="" className="h-10 w-10 shrink-0 rounded-lg bg-sand object-contain" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{p.name}</span>
                  <span className="block truncate text-xs text-muted">
                    {p.sku ?? "utan artikelnummer"} · {p.trackStock ? `${p.stock} i lager` : "lager spåras inte"}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        {outOfStock.length ? (
          <p className="mt-2 text-xs text-muted">
            Slut i lager och därför utelämnade: {outOfStock.map((p) => p.name.replace(/ \|.*$/, "")).join(", ")}.
          </p>
        ) : null}
      </div>

      <div>
        <p className="text-sm font-medium">Varianter att jämföra</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {variants.map((v) => {
            const on = pickedVariants.includes(v.id);
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => toggleVariant(v.id)}
                disabled={running}
                className={`rounded-2xl border p-3 text-left transition-colors ${on ? "border-primary bg-primary-soft/40" : "border-line bg-white hover:border-primary/40"}`}
              >
                <span className="flex items-center gap-2">
                  <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] ${on ? "border-primary bg-primary text-primary-fg" : "border-line"}`}>{on ? "✓" : ""}</span>
                  <span className="text-sm font-medium">{v.label}</span>
                </span>
                <span className="mt-1 block text-xs text-muted">{v.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      <label className="block text-sm">
        <span className="mb-1 block font-medium">Egna instruktioner</span>
        <input
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Ljusare bakgrund, mer luft …"
          disabled={running}
          className="h-10 w-full rounded-xl border border-line bg-white px-3 text-sm focus:border-primary focus:outline-none"
        />
        <span className="mt-1 block text-xs text-muted">Påverkar miljön. Texten på korten kommer alltid från produktens verifierade fakta.</span>
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={run}
          disabled={!ready || running}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-fg hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {running ? (
            <>
              <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
              Bygger …
            </>
          ) : (
            `Bygg ${pickedVariants.length} ${pickedVariants.length === 1 ? "katalog" : "kataloger"}`
          )}
        </button>
        <p className="text-xs text-muted">
          {picked.length} kort × {pickedVariants.length} varianter. Cirka en minut per katalog.
          {picked.length < minCards ? ` Välj minst ${minCards} produkter.` : ""}
        </p>
      </div>

      {runs.length ? (
        <ul role="status" aria-live="polite" className="space-y-1 rounded-xl border border-line bg-sand-soft p-3 text-sm">
          {runs.map((r) => (
            <li key={r.variantId} className="flex items-center justify-between gap-3">
              <span>{r.label}</span>
              <span className={r.status === "klar" ? "text-success" : r.status === "fel" ? "text-danger" : "text-muted"} title={r.note}>
                {r.status === "arbetar" ? "bygger …" : r.status === "fel" ? `fel · ${r.note?.slice(0, 70)}` : r.status}
              </span>
            </li>
          ))}
          {summary ? <li className="pt-1 font-medium">{summary}</li> : null}
        </ul>
      ) : null}
    </div>
  );
}

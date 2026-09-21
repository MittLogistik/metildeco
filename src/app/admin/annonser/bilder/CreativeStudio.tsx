"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export type ConceptOption = { id: string; label: string; description: string; preview: string; wantsReview?: boolean };
export type FormatOption = { id: string; label: string; width: number; height: number };

type Row = {
  key: string;
  conceptId: string;
  concept: string;
  format: string;
  status: "väntar" | "arbetar" | "klar" | "underkänd" | "fel";
  note?: string;
  url?: string;
  id?: string;
  score?: number | null;
};

const post = async (body: Record<string, unknown>) => {
  const res = await fetch("/api/admin/creatives", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; id?: string; name?: string; url?: string; score?: number | null; rejected?: boolean; note?: string | null };
  if (!res.ok || !data.ok) throw new Error(data.error ?? `Serverfel (${res.status}).`);
  return data;
};

/**
 * Creative Studio: välj koncept och format, generera en bilduppsättning per koncept.
 * Varje bild skapas för sig så att förloppet syns och ett fel bara drabbar den bilden.
 */
export function CreativeStudio({
  slug,
  productName,
  concepts,
  formats,
  hasReview,
}: {
  slug: string;
  productName: string;
  concepts: ConceptOption[];
  formats: FormatOption[];
  hasReview: boolean;
}) {
  const router = useRouter();
  const [picked, setPicked] = useState<string[]>(concepts.map((c) => c.id));
  const [pickedFormats, setPickedFormats] = useState<string[]>(formats.map((f) => f.id));
  const [instructions, setInstructions] = useState("");
  const [review, setReview] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [running, setRunning] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const total = picked.length * pickedFormats.length;
  const update = (key: string, patch: Partial<Row>) => setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  const toggle = (list: string[], id: string, set: (v: string[]) => void) => set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  async function run() {
    if (!total || running) return;
    const plan: Row[] = [];
    const groups = new Map<string, string>();
    for (const conceptId of picked) {
      groups.set(conceptId, crypto.randomUUID());
      for (const format of pickedFormats) {
        plan.push({ key: `${conceptId}·${format}`, conceptId, concept: concepts.find((c) => c.id === conceptId)?.label ?? conceptId, format, status: "väntar" });
      }
    }
    setRows(plan);
    setSummary(null);
    setRunning(true);
    let ok = 0;
    let rejected = 0;
    let failed = 0;
    for (const row of plan) {
      update(row.key, { status: "arbetar" });
      try {
        const data = await post({
          slug,
          conceptId: row.conceptId,
          format: row.format,
          groupId: groups.get(row.conceptId),
          customInstructions: instructions.trim() || undefined,
          review: review.trim() || undefined,
        });
        if (data.rejected) rejected++;
        else ok++;
        update(row.key, { status: data.rejected ? "underkänd" : "klar", note: data.rejected ? (data.note ?? "") : data.score != null ? `${data.score} p` : "ogranskad", url: data.url, id: data.id, score: data.score ?? null });
      } catch (e) {
        failed++;
        update(row.key, { status: "fel", note: e instanceof Error ? e.message : "Fel" });
      }
    }
    setRunning(false);
    setSummary(`${ok} klara, ${rejected} underkända (dolda), ${failed} fel.`);
    router.refresh();
  }

  async function again(row: Row) {
    if (!row.id || running) return;
    setRunning(true);
    update(row.key, { status: "arbetar" });
    try {
      const data = await post({ action: "regenerate", id: row.id, customInstructions: instructions.trim() || undefined });
      update(row.key, { status: data.rejected ? "underkänd" : "klar", note: data.rejected ? (data.note ?? "") : data.score != null ? `${data.score} p` : "ogranskad", url: data.url, id: data.id, score: data.score ?? null });
    } catch (e) {
      update(row.key, { status: "fel", note: e instanceof Error ? e.message : "Fel" });
    }
    setRunning(false);
    router.refresh();
  }

  const done = rows.filter((r) => r.status !== "väntar" && r.status !== "arbetar").length;
  const pct = rows.length ? Math.round((done / rows.length) * 100) : 0;
  const needsReview = picked.some((id) => concepts.find((c) => c.id === id)?.wantsReview);

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium">Koncept</p>
          <button
            type="button"
            onClick={() => setPicked(picked.length === concepts.length ? [] : concepts.map((c) => c.id))}
            className="text-xs text-muted underline underline-offset-2 hover:text-foreground"
          >
            {picked.length === concepts.length ? "Avmarkera alla" : "Välj alla"}
          </button>
        </div>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {concepts.map((c) => {
            const on = picked.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggle(picked, c.id, setPicked)}
                disabled={running}
                className={`rounded-2xl border p-3 text-left transition-colors ${on ? "border-primary bg-primary-soft/40" : "border-line bg-white hover:border-primary/40"}`}
              >
                <span className="flex items-center gap-2">
                  <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${on ? "border-primary bg-primary text-primary-fg" : "border-line"}`}>{on ? "✓" : ""}</span>
                  <span className="text-sm font-medium">{c.label}</span>
                </span>
                <span className="mt-1 block text-xs text-muted">{c.description}</span>
                <span className="mt-1 block text-[11px] text-muted">{c.preview}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-sm font-medium">Format</p>
          <div className="mt-2 space-y-1.5">
            {formats.map((f) => (
              <label key={f.id} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={pickedFormats.includes(f.id)} onChange={() => toggle(pickedFormats, f.id, setPickedFormats)} disabled={running} className="h-4 w-4 accent-primary" />
                <span>
                  {f.label} <span className="text-xs text-muted">{f.width} × {f.height}</span>
                </span>
              </label>
            ))}
          </div>
        </div>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Egna instruktioner</span>
          <input
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Mörkare bakgrund, mer minimalistisk …"
            disabled={running}
            className="h-10 w-full rounded-xl border border-line bg-white px-3 text-sm focus:border-primary focus:outline-none"
          />
          <span className="mt-1 block text-xs text-muted">Påverkar miljön, inte texten. Används även när du gör om en enskild bild.</span>
        </label>
      </div>

      {needsReview ? (
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Omdöme att visa</span>
          <input
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder={hasReview ? "Lämna tomt så används produktens egen recension" : "Klistra in ett äkta kundomdöme, eller lämna tomt"}
            disabled={running}
            className="h-10 w-full rounded-xl border border-line bg-white px-3 text-sm focus:border-primary focus:outline-none"
          />
          <span className="mt-1 block text-xs text-muted">
            {hasReview ? "Produkten har en publicerad recension som används om fältet är tomt." : "Produkten har ingen recension. Lämnas fältet tomt visas kortet utan citat och utan stjärnor – vi hittar aldrig på ett omdöme."}
          </span>
        </label>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={run}
          disabled={running || total === 0}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-fg hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {running ? (
            <>
              <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
              Skapar {Math.min(done + 1, rows.length)} av {rows.length} …
            </>
          ) : (
            `Skapa ${total} bilder`
          )}
        </button>
        <p className="text-xs text-muted">
          {picked.length} koncept × {pickedFormats.length} format = {total} bilder för {productName}. Cirka 40 sekunder och ett par kronor per bild.
        </p>
      </div>

      {rows.length > 0 ? (
        <div role="status" aria-live="polite" className="rounded-xl border border-line bg-sand-soft p-3">
          <div className="h-2 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${pct}%` }} />
          </div>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {rows.map((r) => (
              <li key={r.key} className="flex items-center gap-3 rounded-xl bg-white p-2">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-sand">
                  {r.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-muted">{r.status === "arbetar" ? "…" : ""}</span>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">
                    {r.concept} · {r.format}
                  </span>
                  <span className={`block truncate text-xs ${r.status === "klar" ? "text-success" : r.status === "underkänd" || r.status === "fel" ? "text-danger" : "text-muted"}`} title={r.note}>
                    {r.status === "arbetar" ? "arbetar …" : r.status === "väntar" ? "väntar" : `${r.status} · ${r.note ?? ""}`}
                  </span>
                </span>
                {r.id ? (
                  <button type="button" onClick={() => void again(r)} disabled={running} className="shrink-0 rounded-full border border-line px-2.5 py-1 text-xs hover:bg-sand disabled:opacity-50">
                    Gör om
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
          {summary ? <p className="mt-3 text-sm font-medium">{summary}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

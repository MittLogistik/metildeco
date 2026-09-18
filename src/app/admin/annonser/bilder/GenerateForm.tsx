"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field, Input, Select } from "../../_components/fields";

type SceneOption = { id: string; label: string; used: boolean };
type Row = { key: string; scene: string; format: string; status: "väntar" | "genererar" | "klar" | "underkänd" | "fel"; text?: string; url?: string };

/**
 * Genererar bilder en i taget via /api/admin/ad-images och visar förloppet per bild.
 * Varje anrop är kort nog för serverns tidsgräns; totalen kan ändå ta flera minuter.
 */
export function GenerateForm({ slug, scenes, presetOptions, mediaBase }: { slug: string; scenes: SceneOption[]; presetOptions: { value: string; label: string }[]; mediaBase: string }) {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>([]);
  const [running, setRunning] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const update = (key: string, patch: Partial<Row>) => setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));

  async function run(form: HTMLFormElement) {
    const fd = new FormData(form);
    const chosen = fd.getAll("scene").map(String);
    const sceneIds = chosen.length ? chosen : scenes.filter((s) => !s.used).slice(0, 3).map((s) => s.id);
    if (sceneIds.length === 0) {
      setSummary("Alla scener finns redan. Bocka i de scener du vill göra om.");
      return;
    }
    const formats = String(fd.get("formats") ?? "1:1,9:16").split(",").filter(Boolean);
    const stil = String(fd.get("preset_id") ?? "");
    const styleId = stil.startsWith("style:") ? stil.slice(6) : undefined;
    const presetId = !styleId && stil ? stil : undefined;
    const quality = String(fd.get("quality") ?? "medium");
    const base = String(fd.get("media_base") ?? mediaBase).trim() || mediaBase;

    const plan: Row[] = [];
    const groupIds = new Map<string, string>();
    for (const id of sceneIds) {
      groupIds.set(id, crypto.randomUUID());
      for (const format of formats) plan.push({ key: `${id}·${format}`, scene: scenes.find((s) => s.id === id)?.label ?? id, format, status: "väntar" });
    }
    setRows(plan);
    setSummary(null);
    setRunning(true);
    let ok = 0;
    let rejected = 0;
    let failed = 0;
    for (const id of sceneIds) {
      for (const format of formats) {
        const key = `${id}·${format}`;
        update(key, { status: "genererar" });
        try {
          const res = await fetch("/api/admin/ad-images", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug, sceneId: id, format, groupId: groupIds.get(id), presetId, styleId, quality, mediaBase: base }),
          });
          const data = (await res.json()) as { ok?: boolean; error?: string; score?: number | null; rejected?: boolean; note?: string | null; url?: string };
          if (!res.ok || !data.ok) throw new Error(data.error ?? `Fel ${res.status}`);
          if (data.rejected) {
            rejected++;
            update(key, { status: "underkänd", text: data.note ?? "", url: data.url });
          } else {
            ok++;
            update(key, { status: "klar", text: data.score != null ? `${data.score} p` : "ogranskad", url: data.url });
          }
        } catch (e) {
          failed++;
          update(key, { status: "fel", text: e instanceof Error ? e.message : "Fel" });
        }
      }
    }
    setRunning(false);
    setSummary(`${ok} godkända, ${rejected} underkända (dolda), ${failed} fel.`);
    router.refresh();
  }

  const done = rows.filter((r) => r.status !== "väntar" && r.status !== "genererar").length;
  const pct = rows.length ? Math.round((done / rows.length) * 100) : 0;

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!running) void run(e.currentTarget);
      }}
    >
      <Field label="Scener" hint="Redan genererade scener är markerade. Välj inga så tas nästa tre oanvända.">
        <div className="grid grid-cols-2 gap-2 text-sm">
          {scenes.map((s) => (
            <label key={s.id} className="flex items-center gap-2">
              <input type="checkbox" name="scene" value={s.id} className="h-4 w-4" disabled={running} />
              <span>
                {s.label}
                {s.used ? <span className="ml-1 text-xs text-muted">(finns)</span> : null}
              </span>
            </label>
          ))}
        </div>
      </Field>
      <Field label="Stil" hint="Stilar = mall + svenskt faktamanus som enda tillåtna text (granskaren vet vilken). Rena mallar får bara produktnamn och fakta. Kräver kvaliteten high.">
        <Select name="preset_id" options={presetOptions} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Format">
          <Select name="formats" options={[{ value: "1:1,9:16", label: "Flöde 1:1 + Story 9:16" }, { value: "1:1", label: "Bara flöde 1:1" }, { value: "3:4,9:16", label: "Flöde 3:4 + Story 9:16" }]} />
        </Field>
        <Field label="Kvalitet" hint="Priset per bild: low ≈ 0,01 USD, high ≈ 0,16 USD.">
          <Select name="quality" defaultValue="medium" options={[{ value: "low", label: "Low, billigast" }, { value: "medium", label: "Medium" }, { value: "high", label: "High, dyrast" }]} />
        </Field>
        <Field label="Packshot hämtas från" hint="Bas-adressen till butiken.">
          <Input name="media_base" defaultValue={mediaBase} />
        </Field>
      </div>
      <p className="text-xs text-muted">Egna scener tar cirka en halv minut per bild, stilar och mallar cirka två minuter per bild. Lämna sidan öppen tills allt är klart.</p>
      <button type="submit" disabled={running} className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-fg hover:bg-primary-hover disabled:cursor-wait disabled:opacity-70">
        {running ? (
          <>
            <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
            Genererar {done + 1} av {rows.length} …
          </>
        ) : (
          "Generera"
        )}
      </button>

      {rows.length > 0 ? (
        <div role="status" aria-live="polite" className="rounded-xl border border-line bg-sand-soft p-3 text-sm">
          <div className="h-2 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${pct}%` }} />
          </div>
          <ul className="mt-3 space-y-1">
            {rows.map((r) => (
              <li key={r.key} className="flex items-center justify-between gap-3">
                <span>
                  {r.scene} · {r.format}
                </span>
                <span className={`tabular-nums ${r.status === "klar" ? "text-success" : r.status === "underkänd" || r.status === "fel" ? "text-danger" : "text-muted"}`} title={r.text}>
                  {r.status === "genererar" ? "genererar …" : r.status === "klar" ? `klar · ${r.text}` : r.status === "underkänd" ? `underkänd · ${r.text?.slice(0, 60)}` : r.status === "fel" ? `fel · ${r.text?.slice(0, 60)}` : "väntar"}
                </span>
              </li>
            ))}
          </ul>
          {summary ? <p className="mt-3 font-medium">{summary}</p> : null}
        </div>
      ) : null}
    </form>
  );
}

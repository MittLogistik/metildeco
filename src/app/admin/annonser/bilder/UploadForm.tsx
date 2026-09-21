"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export type UploadGroup = { groupId: string; label: string; hasFeed: boolean; hasStory: boolean };
type Row = { name: string; status: string; state: "väntar" | "laddar" | "klar" | "fel" };

const formatOptions = [
  { value: "auto", label: "Efter bildens mått" },
  { value: "1:1", label: "Flöde 1:1" },
  { value: "3:4", label: "Flöde 4:5 / 3:4" },
  { value: "9:16", label: "Story 9:16" },
];

/** Bildens proportion avgör formatet: kvadratisk → 1:1, stående → 4:5/3:4, hög → 9:16. */
const detectFormat = (file: File) =>
  new Promise<string>((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    const done = (ratio: number) => {
      URL.revokeObjectURL(url);
      resolve(ratio >= 0.95 ? "1:1" : ratio >= 0.68 ? "3:4" : "9:16");
    };
    img.onload = () => done(img.naturalWidth / Math.max(1, img.naturalHeight));
    img.onerror = () => done(1);
    img.src = url;
  });

const extOf = (file: File) => {
  const fromName = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (/^[a-z0-9]{1,5}$/.test(fromName)) return fromName === "jpeg" ? "jpg" : fromName;
  return file.type.includes("png") ? "png" : file.type.includes("webp") ? "webp" : "jpg";
};

const post = async (body: Record<string, unknown>) => {
  const res = await fetch("/api/admin/ad-uploads", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const data = (await res.json().catch(() => ({}))) as { error?: string; signedUrl?: string; path?: string; url?: string; score?: number | null; rejected?: boolean; note?: string | null };
  if (!res.ok) throw new Error(data.error ?? `Serverfel (${res.status}).`);
  return data;
};

/**
 * Laddar upp egna annonsbilder direkt till lagringen, förbi serveraktionernas storleksgräns.
 * Flera filer i samma omgång hamnar i samma grupp, så flöde och story hör ihop. Är platsen
 * upptagen börjar en ny grupp automatiskt.
 */
export function UploadForm({
  slug,
  groups,
  mediaBase,
  targetGroupId,
  compact = false,
}: {
  slug: string;
  groups: UploadGroup[];
  mediaBase: string;
  targetGroupId?: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [groupChoice, setGroupChoice] = useState(targetGroupId ?? "");
  const [formatChoice, setFormatChoice] = useState("auto");
  const [rows, setRows] = useState<Row[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(e: React.FormEvent) {
    e.preventDefault();
    const files = Array.from(fileRef.current?.files ?? []);
    if (!files.length) {
      setError("Välj minst en fil.");
      return;
    }
    const tooBig = files.find((f) => f.size > 25 * 1024 * 1024);
    if (tooBig) {
      setError(`${tooBig.name} är större än 25 MB.`);
      return;
    }
    setError(null);
    setBusy(true);
    setRows(files.map((f) => ({ name: f.name, status: "väntar", state: "väntar" })));

    // Håll reda på vilka platser som är tagna, så en ny grupp startar när flöde eller story krockar
    const filled = new Map<string, { feed: boolean; story: boolean }>();
    for (const g of groups) filled.set(g.groupId, { feed: g.hasFeed, story: g.hasStory });
    let current = groupChoice || null;
    let newGroups = 0;

    for (const [i, file] of files.entries()) {
      const setRow = (status: string, state: Row["state"]) => setRows((r) => r.map((row, idx) => (idx === i ? { ...row, status, state } : row)));
      try {
        setRow("läser mått …", "laddar");
        const format = formatChoice === "auto" ? await detectFormat(file) : formatChoice;
        const slot = format === "9:16" ? "story" : "feed";
        if (!current || filled.get(current)?.[slot]) {
          current = crypto.randomUUID();
          filled.set(current, { feed: false, story: false });
          newGroups += 1;
        }
        const groupId = current;

        setRow(`laddar upp ${format} …`, "laddar");
        const signed = await post({ step: "sign", slug, format, groupId, ext: extOf(file) });
        const put = await fetch(signed.signedUrl!, {
          method: "PUT",
          body: file,
          headers: { "content-type": file.type || "application/octet-stream", "x-upsert": "false" },
        });
        if (!put.ok) throw new Error(`Lagringen svarade ${put.status}.`);

        setRow("granskar …", "laddar");
        const done = await post({ step: "commit", slug, format, groupId, path: signed.path, mediaBase });
        filled.get(groupId)![slot] = true;
        const score = typeof done.score === "number" ? ` · ${done.score} p` : "";
        setRow(done.rejected ? `${format} underkänd: ${done.note ?? "bilden liknar inte produkten"}` : `${format} klar${score}`, done.rejected ? "fel" : "klar");
      } catch (err) {
        setRow(err instanceof Error ? err.message : "Misslyckades.", "fel");
      }
    }

    setBusy(false);
    if (fileRef.current) fileRef.current.value = "";
    if (newGroups > 1) setError("Flera bilder hade samma format, så de lades i var sin grupp.");
    router.refresh();
  }

  const groupOptions = [{ value: "", label: "Ny grupp" }].concat(
    groups.map((g) => ({ value: g.groupId, label: `${g.label} (${[g.hasFeed ? "flöde" : null, g.hasStory ? "story" : null].filter(Boolean).join(" + ") || "tom"})` })),
  );
  const select = "h-10 w-full rounded-xl border border-line bg-white px-3 text-sm focus:border-primary focus:outline-none";

  return (
    <form onSubmit={run} className={compact ? "mt-2 space-y-2" : "space-y-4"}>
      <label className="block text-sm">
        {compact ? null : <span className="mb-1 block font-medium">Bildfiler</span>}
        <input ref={fileRef} type="file" name="file" accept="image/*" multiple className="block w-full text-sm" />
        {compact ? null : (
          <span className="mt-1 block text-xs text-muted">
            JPG eller PNG, upp till 25 MB. Välj flera på en gång så hamnar de i samma grupp: flöde 1080×1080 eller 1080×1350, story 1080×1920.
          </span>
        )}
      </label>

      {compact ? null : (
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Format</span>
            <select value={formatChoice} onChange={(e) => setFormatChoice(e.target.value)} className={select}>
              {formatOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Lägg i</span>
            <select value={groupChoice} onChange={(e) => setGroupChoice(e.target.value)} className={select}>
              {groupOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      <button
        type="submit"
        disabled={busy}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-medium hover:bg-sand disabled:cursor-wait disabled:opacity-70"
      >
        {busy ? (
          <>
            <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
            Laddar upp …
          </>
        ) : compact ? (
          "Lägg till bild"
        ) : (
          "Ladda upp"
        )}
      </button>

      {error ? <p className="text-sm text-danger">{error}</p> : null}
      {rows.length ? (
        <ul className="space-y-1 text-xs" role="status" aria-live="polite">
          {rows.map((r) => (
            <li key={r.name} className={r.state === "fel" ? "text-danger" : r.state === "klar" ? "text-success" : "text-muted"}>
              {r.name} – {r.status}
            </li>
          ))}
        </ul>
      ) : null}
    </form>
  );
}

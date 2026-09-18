import "server-only";

/**
 * Higgsfield API (Marketing Studio Image). Asynkront: skicka jobb, polla status_url.
 * Kräver HF_CREDENTIALS = "key-id:key-secret" (console.higgsfield.ai). Bara på servern.
 * Utdata ligger kvar högst sju dagar hos Higgsfield, så vi laddar alltid ner dem.
 */

const BASE = "https://api.higgsfield.ai";

export const higgsfieldConfigured = () => Boolean(process.env.HF_CREDENTIALS?.includes(":"));

const headers = () => ({ Authorization: `Key ${process.env.HF_CREDENTIALS ?? ""}`, "Content-Type": "application/json" });

export type HfAspect = "auto" | "1:1" | "3:2" | "2:3" | "4:3" | "3:4" | "16:9" | "9:16" | "21:9";
export type HfResolution = "1k" | "2k" | "4k";
/** Kvalitet styr priset mer än upplösningen: low ≈ 0,013 USD, high ≈ 0,16 USD per bild (1k). Utan värde kör Higgsfield high. */
export type HfQuality = "low" | "medium" | "high";
export const defaultQuality = (): HfQuality => (["low", "medium", "high"].includes(process.env.HF_QUALITY ?? "") ? (process.env.HF_QUALITY as HfQuality) : "medium");

export type HfPreset = { id: string; type: string; name: string };

export async function listPresets(): Promise<HfPreset[]> {
  const res = await fetch(`${BASE}/marketing-studio/image/presets?size=50`, { headers: headers() });
  if (!res.ok) throw new Error(`Higgsfield presets: ${res.status} ${(await res.text()).slice(0, 200)}`);
  const data = (await res.json()) as { items?: HfPreset[] };
  return data.items ?? [];
}

type Job = { request_id: string; status_url: string; status: string; images?: { url: string }[]; error?: string | null };

/**
 * Genererar en bild. Med imageUrls redigeras/byggs scenen runt de bilderna (vår packshot).
 * Returnerar bildens URL hos Higgsfield.
 */
export async function generateImage(o: { prompt: string; imageUrls?: string[]; aspectRatio?: HfAspect; resolution?: HfResolution; quality?: HfQuality; presetId?: string; timeoutMs?: number }): Promise<string> {
  if (!higgsfieldConfigured()) throw new Error("HF_CREDENTIALS saknas.");
  const body = {
    prompt: o.prompt,
    image_urls: o.imageUrls?.length ? o.imageUrls : undefined,
    aspect_ratio: o.aspectRatio ?? "1:1",
    resolution: o.resolution ?? "1k",
    quality: o.quality ?? defaultQuality(),
    ...(o.presetId ? { enhance_prompt: true, preset_id: o.presetId } : { enhance_prompt: false }),
  };
  const res = await fetch(`${BASE}/marketing-studio/image`, { method: "POST", headers: headers(), body: JSON.stringify(body) });
  const text = await res.text();
  if (!res.ok) throw new Error(`Higgsfield: ${res.status} ${text.slice(0, 300)}`);
  let job = JSON.parse(text) as Job;
  const deadline = Date.now() + (o.timeoutMs ?? 5 * 60_000);
  while (job.status === "queued" || job.status === "in_progress") {
    if (Date.now() > deadline) throw new Error("Higgsfield: tidsgränsen passerades.");
    await new Promise((r) => setTimeout(r, 3000));
    const s = await fetch(job.status_url, { headers: headers() });
    if (!s.ok) throw new Error(`Higgsfield status: ${s.status}`);
    job = { ...job, ...((await s.json()) as Partial<Job>) };
  }
  if (job.status !== "completed") throw new Error(`Higgsfield: jobbet slutade som ${job.status}${job.error ? ` (${job.error})` : ""}`);
  const url = job.images?.[0]?.url;
  if (!url) throw new Error("Higgsfield: inget bildsvar.");
  return url;
}

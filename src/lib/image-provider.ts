import "server-only";
import sharp from "sharp";
import { generateImage, higgsfieldConfigured, type HfAspect } from "./higgsfield";

/**
 * Bildgenerering bakom ett gränssnitt, så att leverantören kan bytas utan att
 * Creative Studio byggs om. OpenAI (gpt-image-1) är standard; Higgsfield finns kvar.
 * Leverantören levererar alltid exakt begärd pixelstorlek.
 */

export type Size = { width: number; height: number };
export type ImageRequest = {
  prompt: string;
  size: Size;
  /** Referensbild som modellen ska utgå från. Utelämnas för rena miljöbilder. */
  reference?: Buffer;
  quality?: "low" | "medium" | "high";
};

export interface ImageProvider {
  id: string;
  label: string;
  configured(): boolean;
  generate(req: ImageRequest): Promise<Buffer>;
}

/** Skalar och beskär till exakt storlek – modellernas format är sällan Metas. */
const exact = (buf: Buffer, size: Size) => sharp(buf).resize(size.width, size.height, { fit: "cover", position: "centre" }).png().toBuffer();

/* --------------------------------- OpenAI --------------------------------- */

/** Närmaste storlek gpt-image-1 stöder. 9:16 görs som 2:3 och beskärs på bredden. */
const openaiSize = (size: Size) => {
  const ratio = size.width / size.height;
  if (ratio > 1.15) return "1536x1024";
  if (ratio < 0.87) return "1024x1536";
  return "1024x1024";
};

const openaiModel = () => process.env.AD_IMAGE_MODEL ?? "gpt-image-1";

export const openaiProvider: ImageProvider = {
  id: "openai",
  label: "ChatGPT (gpt-image-1)",
  configured: () => Boolean(process.env.OPENAI_API_KEY),
  async generate(req) {
    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error("OPENAI_API_KEY saknas.");
    const size = openaiSize(req.size);
    // Kvaliteten styr priset mest. AD_IMAGE_QUALITY kan sänka den för billigare utkast.
    const quality = req.quality ?? (process.env.AD_IMAGE_QUALITY ?? "high");
    let res: Response;
    if (req.reference) {
      // Redigering med referens: input_fidelity high håller förpackningen så nära originalet som möjligt
      const fd = new FormData();
      fd.append("model", openaiModel());
      fd.append("prompt", req.prompt);
      fd.append("size", size);
      fd.append("quality", quality);
      fd.append("input_fidelity", "high");
      fd.append("n", "1");
      fd.append("image", new Blob([new Uint8Array(req.reference)], { type: "image/png" }), "reference.png");
      res = await fetch("https://api.openai.com/v1/images/edits", { method: "POST", headers: { authorization: `Bearer ${key}` }, body: fd });
    } else {
      res = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
        body: JSON.stringify({ model: openaiModel(), prompt: req.prompt, size, quality, n: 1 }),
      });
    }
    const text = await res.text();
    if (!res.ok) {
      const msg = (() => {
        try {
          return (JSON.parse(text) as { error?: { message?: string } }).error?.message;
        } catch {
          return null;
        }
      })();
      throw new Error(`OpenAI bild: ${msg ?? `${res.status} ${text.slice(0, 200)}`}`);
    }
    const data = JSON.parse(text) as { data?: { b64_json?: string; url?: string }[] };
    const first = data.data?.[0];
    const raw = first?.b64_json ? Buffer.from(first.b64_json, "base64") : first?.url ? Buffer.from(await (await fetch(first.url)).arrayBuffer()) : null;
    if (!raw) throw new Error("OpenAI gav ingen bild.");
    return exact(raw, req.size);
  },
};

/* ------------------------------- Higgsfield ------------------------------- */

const hfAspect = (size: Size): HfAspect => {
  const r = size.width / size.height;
  if (r > 1.6) return "16:9";
  if (r > 1.15) return "3:2";
  if (r < 0.6) return "9:16";
  if (r < 0.87) return "3:4";
  return "1:1";
};

export const higgsfieldProvider: ImageProvider = {
  id: "higgsfield",
  label: "Higgsfield",
  configured: higgsfieldConfigured,
  async generate(req) {
    if (req.reference) throw new Error("Higgsfield tar referensbilder som adress, inte som fil.");
    const url = await generateImage({ prompt: req.prompt, aspectRatio: hfAspect(req.size), resolution: "1k", quality: req.quality });
    const raw = Buffer.from(await (await fetch(url)).arrayBuffer());
    return exact(raw, req.size);
  },
};

const providers: ImageProvider[] = [openaiProvider, higgsfieldProvider];

/** Vald leverantör: AD_IMAGE_PROVIDER, annars den första som är konfigurerad. */
export function imageProvider(id?: string): ImageProvider {
  const wanted = id ?? process.env.AD_IMAGE_PROVIDER ?? "openai";
  const picked = providers.find((p) => p.id === wanted);
  if (picked?.configured()) return picked;
  const fallback = providers.find((p) => p.configured());
  if (!fallback) throw new Error("Ingen bildleverantör är konfigurerad (OPENAI_API_KEY eller HF_CREDENTIALS).");
  return fallback;
}

export const providerOptions = () => providers.map((p) => ({ id: p.id, label: p.label, configured: p.configured() }));

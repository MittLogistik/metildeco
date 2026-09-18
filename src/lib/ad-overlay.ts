import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import satori from "satori";
import sharp from "sharp";

/**
 * Lägger text på en annonsbild i kod: Metildes typsnitt, exakt stavning, bara godkända
 * formuleringar. AI:n får aldrig skriva texten själv. Renderas med satori (HTML → SVG) och
 * komponeras ovanpå bilden med sharp.
 */

type Font = { name: string; data: ArrayBuffer; weight: 400 | 500 | 600; style: "normal" };
let fontCache: Font[] | null = null;
async function fonts(): Promise<Font[]> {
  if (fontCache) return fontCache;
  const dir = path.join(process.cwd(), "src", "assets", "fonts");
  const load = async (file: string, name: string, weight: Font["weight"]): Promise<Font> => {
    const buf = await readFile(path.join(dir, file));
    return { name, data: buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer, weight, style: "normal" };
  };
  fontCache = await Promise.all([load("Outfit-SemiBold.ttf", "Outfit", 600), load("Figtree-Medium.ttf", "Figtree", 500), load("Figtree-Regular.ttf", "Figtree", 400)]);
  return fontCache;
}

export type OverlaySpec = {
  headline: string;
  subline?: string;
  /** Liten etikett ovanför rubriken, t.ex. "Metilde". */
  eyebrow?: string;
  /** Var textblocket sitter. "auto" väljer den lugnaste ytan (minst detaljer) av topp och botten. */
  position?: "top" | "bottom" | "auto";
  /** Färgtema: mörk text på ljus platta, eller ljus text på grön platta. */
  theme?: "sand" | "green";
};

const colors = {
  sand: { bg: "rgba(239,233,223,0.92)", fg: "#1f3d33", muted: "#4a5f57" },
  green: { bg: "rgba(31,61,51,0.92)", fg: "#f6f1e8", muted: "#d9d2c5" },
};

/** Mäter hur "stökig" en horisontell remsa är (medelvärde av standardavvikelsen per kanal). */
async function busyness(image: Buffer, top: number, height: number, width: number): Promise<number> {
  const st = await sharp(image).extract({ left: 0, top, width, height }).stats();
  return st.channels.reduce((a, c) => a + c.stdev, 0) / st.channels.length;
}

/** Returnerar en ny JPEG med texten pålagd. Bildens storlek behålls. */
export async function overlayText(image: Buffer, o: OverlaySpec): Promise<Buffer> {
  const meta = await sharp(image).metadata();
  const W = meta.width ?? 1024;
  const H = meta.height ?? 1024;
  const tall = H > W * 1.3;
  const c = colors[o.theme ?? "sand"];
  const pad = Math.round(W * 0.06);
  const headSize = Math.round(W * (tall ? 0.085 : 0.075));
  const subSize = Math.round(W * (tall ? 0.04 : 0.036));
  const eyeSize = Math.round(W * 0.028);
  let position: "top" | "bottom" = o.position === "bottom" ? "bottom" : "top";
  if (!o.position || o.position === "auto") {
    const band = Math.round(H * 0.32);
    const [t, b] = await Promise.all([busyness(image, 0, band, W), busyness(image, H - band, band, W)]);
    position = t <= b ? "top" : "bottom";
  }
  const offset = Math.round(H * (tall ? 0.09 : 0.06));

  const el = (type: string, style: Record<string, unknown>, children?: unknown) => ({ type, props: { style, children } });
  const block = el(
    "div",
    { display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: c.bg, borderRadius: Math.round(W * 0.03), padding: `${Math.round(pad * 0.7)}px ${pad}px`, maxWidth: W - pad * 2, textAlign: "center" },
    [
      o.eyebrow ? el("div", { fontFamily: "Figtree", fontWeight: 500, fontSize: eyeSize, letterSpacing: eyeSize * 0.18, textTransform: "uppercase", color: c.muted, marginBottom: Math.round(eyeSize * 0.6) }, o.eyebrow) : null,
      el("div", { fontFamily: "Outfit", fontWeight: 600, fontSize: headSize, lineHeight: 1.1, color: c.fg }, o.headline),
      o.subline ? el("div", { fontFamily: "Figtree", fontWeight: 400, fontSize: subSize, lineHeight: 1.3, color: c.muted, marginTop: Math.round(subSize * 0.5) }, o.subline) : null,
    ].filter(Boolean),
  );
  const root = el("div", { display: "flex", width: W, height: H, flexDirection: "column", alignItems: "center", justifyContent: position === "top" ? "flex-start" : "flex-end", paddingTop: position === "top" ? offset : 0, paddingBottom: position === "bottom" ? offset : 0 }, [block]);

  // satori vill ha ett React-liknande element; formen ovan räcker
  const svg = await satori(root as unknown as Parameters<typeof satori>[0], { width: W, height: H, fonts: await fonts() });
  const layer = await sharp(Buffer.from(svg)).png().toBuffer();
  return sharp(image).composite([{ input: layer }]).jpeg({ quality: 92 }).toBuffer();
}

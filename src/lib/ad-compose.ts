import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import satori from "satori";
import sharp from "sharp";
import type { Concept, ConceptCopy, Format } from "@/content/ad-concepts";
import { formatById } from "@/content/ad-concepts";

/**
 * Sätter ihop den färdiga annonsbilden: genererad miljö, produktens riktiga packshot och
 * text som vi ritar själva. Bildmodellen får aldrig skriva texten – dels för att svensk
 * text blir felstavad, dels för att all faktatext måste komma från produktdatan.
 *
 * Textlagret vet var burken står (se Geo) och lägger aldrig text ovanpå den.
 */

const C = { ink: "#1f3d33", inkSoft: "#4a5f57", card: "rgba(253,251,247,0.94)", green: "#1f3d33", cream: "#fdfbf7", gold: "#b8a44a" };

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

type El = { type: string; props: { style: Record<string, unknown>; children?: unknown } };
const box = (style: Record<string, unknown>, children?: unknown): El => ({ type: "div", props: { style: { display: "flex", ...style }, children } });
const txt = (style: Record<string, unknown>, value: string): El => ({ type: "div", props: { style: { display: "flex", fontFamily: "Figtree", ...style }, children: value } });

/** Burkens plats i bilden, i pixlar. */
type Geo = { left: number; right: number; top: number; bottom: number };

/* ------------------------------- produktlager ------------------------------- */

async function placeProduct(scene: Buffer, packshot: Buffer, size: { width: number; height: number }, place: { x: number; baseY: number; height: number }): Promise<{ image: Buffer; geo: Geo }> {
  const h = Math.round(size.height * place.height);
  const bottle = await sharp(packshot).resize({ height: h, fit: "inside" }).png().toBuffer();
  const meta = await sharp(bottle).metadata();
  const w = meta.width ?? h;
  const left = Math.max(0, Math.min(size.width - w, Math.round(size.width * place.x - w / 2)));
  const top = Math.max(0, Math.min(size.height - h, Math.round(size.height * place.baseY - h)));

  // Skugga: burkens siluett som alfamask på en mörk platta, mjukad och nedtonad
  const blur = Math.max(6, Math.round(h * 0.025));
  const mask = await sharp(bottle).extractChannel("alpha").blur(blur).linear(0.45, 0).raw().toBuffer();
  const shadow = await sharp({ create: { width: w, height: h, channels: 3, background: { r: 58, g: 54, b: 42 } } })
    .joinChannel(mask, { raw: { width: w, height: h, channels: 1 } })
    .png()
    .toBuffer();

  const dx = Math.round(h * 0.035);
  const dy = Math.round(h * 0.025);
  const image = await sharp(scene)
    .composite([
      { input: shadow, left: Math.min(size.width - w, left + dx), top: Math.min(size.height - h, top + dy) },
      { input: bottle, left, top },
    ])
    .png()
    .toBuffer();
  return { image, geo: { left, right: left + w, top, bottom: top + h } };
}

/* -------------------------------- textlager -------------------------------- */

type Sizes = { head: number; body: number; small: number; padX: number; safeTop: number; safeBottom: number; gap: number };

const chip = (label: string, s: number, maxWidth: number) =>
  box({ backgroundColor: C.card, borderRadius: s * 0.55, padding: `${Math.round(s * 0.34)}px ${Math.round(s * 0.62)}px`, maxWidth }, [
    txt({ fontWeight: 500, fontSize: s, color: C.ink, lineHeight: 1.25 }, label),
  ]);

const check = (label: string, s: number, maxWidth: number) =>
  box({ alignItems: "center", marginBottom: Math.round(s * 0.5), maxWidth }, [
    box({ width: s * 1.2, height: s * 1.2, borderRadius: s, backgroundColor: C.green, alignItems: "center", justifyContent: "center", marginRight: Math.round(s * 0.55), flexShrink: 0 }, [
      txt({ fontFamily: "Outfit", fontWeight: 600, fontSize: Math.round(s * 0.66), color: C.cream }, "✓"),
    ]),
    txt({ fontWeight: 500, fontSize: s, color: C.ink, lineHeight: 1.25 }, label),
  ]);

const ctaChip = (label: string, s: number) =>
  txt({ fontWeight: 500, fontSize: s, color: C.cream, letterSpacing: s * 0.06, backgroundColor: C.green, borderRadius: s * 2, padding: `${Math.round(s * 0.62)}px ${Math.round(s * 1.5)}px` }, label);

// satori kraschar på odefinierade stilvärden, så maxWidth tas bara med när det finns
const headline = (label: string, s: number, opts: { upper?: boolean; maxWidth?: number; center?: boolean } = {}) =>
  txt(
    { fontFamily: "Outfit", fontWeight: 600, fontSize: s, color: C.ink, lineHeight: 1.08, textTransform: opts.upper ? "uppercase" : "none", ...(opts.center ? { textAlign: "center" } : {}), ...(opts.maxWidth ? { maxWidth: opts.maxWidth } : {}) },
    label,
  );

/** Ruta förankrad mot bildens underkant, när innehållets höjd inte går att räkna ut i förväg. */
const atBottom = (rect: { left: number; bottom: number; width: number }, style: Record<string, unknown>, children: unknown) =>
  box({ position: "absolute", left: rect.left, bottom: rect.bottom, width: rect.width, flexDirection: "column", ...style }, children);

/** Absolut placerad ruta – enklast sättet att hålla texten borta från burken. */
const at = (rect: { left: number; top: number; width: number; height?: number }, style: Record<string, unknown>, children: unknown) =>
  box({ position: "absolute", left: rect.left, top: rect.top, width: rect.width, ...(rect.height ? { height: rect.height } : {}), flexDirection: "column", ...style }, children);

function layout(concept: string, copy: ConceptCopy, W: number, H: number, format: Format, geo: Geo): El {
  const tall = format === "9:16";
  const s: Sizes = {
    padX: Math.round(W * 0.07),
    safeTop: Math.round(H * (tall ? 0.14 : 0.055)),
    safeBottom: Math.round(H * (tall ? 0.19 : 0.055)),
    head: Math.round(W * (tall ? 0.075 : 0.072)),
    body: Math.round(W * (tall ? 0.036 : 0.034)),
    small: Math.round(W * (tall ? 0.029 : 0.027)),
    gap: Math.round(H * 0.03),
  };
  const inner = W - s.padX * 2;
  const topZone = { left: s.padX, top: s.safeTop, width: inner, height: Math.max(0, geo.top - s.gap - s.safeTop) };
  const bottomTop = geo.bottom + s.gap;
  const bottomZone = { left: s.padX, top: bottomTop, width: inner, height: Math.max(0, H - s.safeBottom - bottomTop) };
  const children: unknown[] = [];

  // Stories staplas alltid: rubrik ovanför burken, fakta under. Då krockar inget.
  if (tall) {
    const heading = box({ flexDirection: "column", justifyContent: "flex-end", height: topZone.height }, [
      copy.eyebrow ? txt({ fontWeight: 500, fontSize: s.small, color: C.inkSoft, letterSpacing: s.small * 0.14, textTransform: "uppercase", marginBottom: Math.round(s.small * 0.5) }, copy.eyebrow) : null,
      copy.headline ? headline(copy.headline, s.head, { upper: concept === "simple-routine" }) : null,
      copy.subline ? txt({ fontWeight: 500, fontSize: s.body, color: C.inkSoft, marginTop: Math.round(s.body * 0.45) }, copy.subline) : null,
    ].filter(Boolean));
    children.push(at(topZone, {}, [heading]));

    const facts =
      concept === "product-facts"
        ? box({ flexDirection: "column" }, copy.facts.map((f) => check(f, s.body, inner)))
        : box({ flexWrap: "wrap" }, copy.facts.map((f) => box({ marginRight: Math.round(s.small * 0.55), marginBottom: Math.round(s.small * 0.5) }, [chip(f, s.small, inner)])));
    const quote = copy.quote
      ? box({ backgroundColor: C.card, borderRadius: Math.round(W * 0.04), padding: Math.round(W * 0.045), flexDirection: "column", marginBottom: s.gap }, [
          txt({ fontSize: Math.round(s.body * 1.05), color: C.gold, letterSpacing: s.body * 0.1, marginBottom: Math.round(s.body * 0.35) }, "★★★★★"),
          headline(`”${copy.quote}”`, Math.round(s.head * 0.62), { maxWidth: inner - Math.round(W * 0.09) }),
          copy.quoteBy ? txt({ fontWeight: 400, fontSize: s.small, color: C.inkSoft, marginTop: Math.round(s.small * 0.5) }, copy.quoteBy) : null,
        ].filter(Boolean))
      : null;
    children.push(at(bottomZone, { justifyContent: "flex-start" }, [quote, facts, copy.cta ? box({ marginTop: s.gap }, [ctaChip(copy.cta, s.small)]) : null].filter(Boolean)));
    if (concept === "comparison") {
      children.push(
        at({ left: s.padX, top: Math.round(H * 0.055), width: inner }, { flexDirection: "row", justifyContent: "space-between" }, [
          txt({ fontFamily: "Outfit", fontWeight: 600, fontSize: Math.round(s.head * 0.5), color: C.ink, backgroundColor: C.card, borderRadius: s.small * 2, padding: `${Math.round(s.small * 0.45)}px ${Math.round(s.small * 1)}px` }, copy.compareLeft ?? "Krånglig rutin"),
          txt({ fontFamily: "Outfit", fontWeight: 600, fontSize: Math.round(s.head * 0.5), color: C.cream, backgroundColor: C.green, borderRadius: s.small * 2, padding: `${Math.round(s.small * 0.45)}px ${Math.round(s.small * 1)}px` }, copy.compareRight ?? "Enkel rutin"),
        ]),
      );
    }
    return box({ width: W, height: H, position: "relative" }, children);
  }

  // 1:1 – varje koncept har sin egen komposition, men alltid utanför burkens yta
  const rightCol = { left: geo.right + s.gap, top: s.safeTop, width: Math.max(160, W - s.padX - (geo.right + s.gap)) };
  const leftGutter = Math.max(0, geo.left - s.gap - s.padX);
  const rightGutter = Math.max(0, W - s.padX - (geo.right + s.gap));

  if (concept === "product-facts") {
    children.push(
      at({ ...rightCol, top: Math.round(H * 0.1) }, { justifyContent: "flex-start" }, [
        headline(copy.headline, s.head, { maxWidth: rightCol.width }),
        box({ flexDirection: "column", marginTop: Math.round(s.head * 0.55) }, copy.facts.map((f) => check(f, s.body, rightCol.width))),
      ]),
    );
    if (copy.cta) children.push(at({ left: s.padX, top: H - s.safeBottom - Math.round(s.small * 3), width: inner }, { alignItems: "flex-end" }, [box({}, [ctaChip(copy.cta, s.small)])]));
    return box({ width: W, height: H, position: "relative" }, children);
  }

  if (concept === "notification") {
    const card = box({ backgroundColor: C.card, borderRadius: Math.round(W * 0.045), padding: Math.round(W * 0.04), alignItems: "center", width: inner }, [
      box({ width: Math.round(W * 0.1), height: Math.round(W * 0.1), borderRadius: Math.round(W * 0.026), backgroundColor: C.green, alignItems: "center", justifyContent: "center", marginRight: Math.round(W * 0.035), flexShrink: 0 }, [
        txt({ fontFamily: "Outfit", fontWeight: 600, fontSize: Math.round(W * 0.05), color: C.cream }, "M"),
      ]),
      box({ flexDirection: "column", flexGrow: 1 }, [
        txt({ fontWeight: 500, fontSize: s.small, color: C.inkSoft, letterSpacing: s.small * 0.12, textTransform: "uppercase", marginBottom: Math.round(s.small * 0.3) }, copy.eyebrow ?? "Påminnelse"),
        headline(copy.headline, Math.round(s.body * 1.3), { maxWidth: inner - Math.round(W * 0.2) }),
        copy.subline ? txt({ fontWeight: 400, fontSize: s.body, color: C.inkSoft, marginTop: Math.round(s.body * 0.2) }, copy.subline) : null,
      ].filter(Boolean)),
    ]);
    children.push(at({ left: s.padX, top: s.safeTop, width: inner }, {}, [card]));
    if (copy.cta) children.push(at({ left: s.padX, top: H - s.safeBottom - Math.round(s.small * 3), width: inner }, { alignItems: "center" }, [box({}, [ctaChip(copy.cta, s.small)])]));
    return box({ width: W, height: H, position: "relative" }, children);
  }

  if (concept === "simple-routine") {
    children.push(
      at({ left: s.padX, top: s.safeTop, width: inner }, { alignItems: "center" }, [
        headline(copy.headline, Math.round(s.head * 0.95), { upper: true, maxWidth: inner, center: true }),
        copy.subline ? txt({ fontWeight: 500, fontSize: s.body, color: C.inkSoft, marginTop: Math.round(s.body * 0.4) }, copy.subline) : null,
      ].filter(Boolean)),
    );
    const half = Math.ceil(copy.facts.length / 2);
    const cols: [string[], string[]] = [copy.facts.slice(0, half), copy.facts.slice(half)];
    const colTop = Math.round(geo.top + (geo.bottom - geo.top) * 0.12);
    if (leftGutter > 120) children.push(at({ left: s.padX, top: colTop, width: leftGutter }, { alignItems: "flex-start" }, cols[0].map((f) => box({ marginBottom: Math.round(s.small * 0.7) }, [chip(f, s.small, leftGutter)]))));
    if (rightGutter > 120) children.push(at({ left: geo.right + s.gap, top: colTop, width: rightGutter }, { alignItems: "flex-end" }, cols[1].map((f) => box({ marginBottom: Math.round(s.small * 0.7) }, [chip(f, s.small, rightGutter)]))));
    if (copy.cta) children.push(at({ left: s.padX, top: H - s.safeBottom - Math.round(s.small * 3), width: inner }, { alignItems: "center" }, [box({}, [ctaChip(copy.cta, s.small)])]));
    return box({ width: W, height: H, position: "relative" }, children);
  }

  if (concept === "comparison") {
    const colW = Math.round(inner / 2) - s.gap;
    children.push(
      at({ left: s.padX, top: s.safeTop, width: inner }, { flexDirection: "row", justifyContent: "space-between" }, [
        txt({ fontFamily: "Outfit", fontWeight: 600, fontSize: Math.round(s.head * 0.55), color: C.ink, backgroundColor: C.card, borderRadius: s.small * 2, padding: `${Math.round(s.small * 0.5)}px ${Math.round(s.small * 1.1)}px` }, copy.compareLeft ?? "Krånglig rutin"),
        txt({ fontFamily: "Outfit", fontWeight: 600, fontSize: Math.round(s.head * 0.55), color: C.cream, backgroundColor: C.green, borderRadius: s.small * 2, padding: `${Math.round(s.small * 0.5)}px ${Math.round(s.small * 1.1)}px` }, copy.compareRight ?? "Enkel rutin"),
      ]),
    );
    // Plats mellan kolumnrubrikerna och burken avgör hur många fakta som får plats
    const factsTop = Math.round(H * 0.19);
    const room = Math.max(0, geo.top - s.gap - factsTop);
    const perChip = Math.round(s.small * 3.4);
    const shown = copy.facts.slice(0, Math.max(1, Math.floor(room / perChip)));
    children.push(
      at({ left: W - s.padX - colW, top: factsTop, width: colW }, { alignItems: "flex-end" }, shown.map((f) => box({ marginBottom: Math.round(s.small * 0.6) }, [chip(f, s.small, colW)]))),
    );
    if (copy.cta) children.push(at({ left: s.padX, top: H - s.safeBottom - Math.round(s.small * 3), width: inner }, { alignItems: "center" }, [box({}, [ctaChip(copy.cta, s.small)])]));
    return box({ width: W, height: H, position: "relative" }, children);
  }

  // social-proof
  if (copy.eyebrow) {
    children.push(
      at({ left: s.padX, top: s.safeTop, width: inner }, { alignItems: "center" }, [
        txt({ fontWeight: 500, fontSize: s.small, color: C.cream, letterSpacing: s.small * 0.16, textTransform: "uppercase", backgroundColor: "rgba(31,61,51,0.88)", borderRadius: s.small * 2, padding: `${Math.round(s.small * 0.45)}px ${Math.round(s.small * 1.1)}px` }, copy.eyebrow),
      ]),
    );
  }
  children.push(
    atBottom({ left: s.padX, bottom: s.safeBottom, width: inner }, {}, [
      box({ backgroundColor: C.card, borderRadius: Math.round(W * 0.04), padding: Math.round(W * 0.045), flexDirection: "column", width: inner }, [
        copy.quote ? txt({ fontSize: Math.round(s.body * 1.05), color: C.gold, letterSpacing: s.body * 0.1, marginBottom: Math.round(s.body * 0.3) }, "★★★★★") : null,
        copy.quote ? headline(`”${copy.quote}”`, Math.round(s.head * 0.6), { maxWidth: inner - Math.round(W * 0.09) }) : headline(copy.headline, Math.round(s.head * 0.85), { maxWidth: inner - Math.round(W * 0.09) }),
        copy.quoteBy ? txt({ fontWeight: 400, fontSize: s.small, color: C.inkSoft, marginTop: Math.round(s.small * 0.45) }, copy.quoteBy) : null,
        box({ marginTop: Math.round(s.body * 0.75), flexWrap: "wrap" }, copy.facts.map((f) => box({ marginRight: Math.round(s.small * 0.5), marginBottom: Math.round(s.small * 0.35) }, [chip(f, Math.round(s.small * 0.92), inner)]))),
      ].filter(Boolean)),
    ]),
  );
  return box({ width: W, height: H, position: "relative" }, children);
}

/* --------------------------------- publikt --------------------------------- */

export type ComposeInput = { scene: Buffer; packshot: Buffer; concept: Concept; copy: ConceptCopy; format: Format };

/** Miljö + riktig packshot + vår text = färdig annonsbild i exakt Meta-storlek. */
export async function composeCreative({ scene, packshot, concept, copy, format }: ComposeInput): Promise<Buffer> {
  const f = formatById(format);
  const size = { width: f?.width ?? 1080, height: f?.height ?? 1080 };
  const base = await sharp(scene).resize(size.width, size.height, { fit: "cover", position: "centre" }).png().toBuffer();
  const { image, geo } = await placeProduct(base, packshot, size, concept.placement[format]);
  const svg = await satori(layout(concept.id, copy, size.width, size.height, format, geo) as unknown as Parameters<typeof satori>[0], {
    width: size.width,
    height: size.height,
    fonts: await fonts(),
  });
  const textLayer = await sharp(Buffer.from(svg)).png().toBuffer();
  return sharp(image).composite([{ input: textLayer }]).jpeg({ quality: 92 }).toBuffer();
}

/**
 * Provar textmotorn en gång per process. Satori laddar sin wasm vid första anropet, och
 * misslyckas det vill vi veta det innan vi betalar för en bild – inte efteråt.
 */
let warmed: Promise<void> | null = null;
export function warmupTextEngine(): Promise<void> {
  warmed ??= (async () => {
    const probe = box({ width: 8, height: 8 }, [txt({ fontSize: 8, color: "#000" }, "M")]);
    await satori(probe as unknown as Parameters<typeof satori>[0], { width: 8, height: 8, fonts: await fonts() });
  })().catch((e: unknown) => {
    warmed = null;
    throw new Error(`Textmotorn kunde inte starta: ${e instanceof Error ? e.message : e}`);
  });
  return warmed;
}

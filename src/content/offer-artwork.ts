/**
 * Friställda packshots (transparent bakgrund) för köprutans flerpack-kort. Saknas en produkt här
 * används produktens vanliga första bild. Lägg filen under public/media/gava/<slug>.png.
 */
export const offerArtwork: Record<string, string> = {
  "fadogia-agrestis": "/media/gava/fadogia-agrestis.png",
};

/** Flerpack (flera burkar i samma bild, transparent bakgrund) per produkt. */
export const packArtwork: Record<string, string> = {
  "tongkat-ali-elite": "/media/gava/tongkat-ali-elite-3pack.png",
};

export const artworkFor = (slug: string, fallback: string) => offerArtwork[slug] ?? fallback;
export const packArtworkFor = (slug: string) => packArtwork[slug] ?? null;
/** Friställda bilder kan läggas direkt på kortets färg; övriga har vit bakgrund och blandas bort. */
export const isCutout = (src: string) => src.startsWith("/media/gava/");

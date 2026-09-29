/**
 * Friställda packshots (transparent bakgrund) för köprutans flerpack-kort. Saknas en produkt här
 * används produktens vanliga första bild. Lägg filen under public/media/gava/<slug>.png.
 */
export const offerArtwork: Record<string, string> = {
  "fadogia-agrestis": "/media/gava/fadogia-agrestis.png",
};

export const artworkFor = (slug: string, fallback: string) => offerArtwork[slug] ?? fallback;

/**
 * Mediafiler exporterades från gamla butiken med sökvägar under
 * /api/public/media/ – de ligger nu lokalt under /public/media/.
 */
export const PLACEHOLDER = "/media/placeholder.svg";

export const mediaUrl = (src: string | null | undefined): string => {
  if (!src) return PLACEHOLDER;
  const clean = src.split("?")[0] ?? src;
  if (clean.startsWith("/api/public/media/")) {
    return clean.replace("/api/public/media/", "/media/");
  }
  return clean;
};

export const isVideo = (src: string) => /\.(mp4|webm|mov)$/i.test(src);

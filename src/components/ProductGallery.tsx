"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import { PlayIcon } from "@/components/icons";

export type Media = { type: "image"; src: string } | { type: "video"; src: string; poster: string };

type Fit = "cover" | "contain";

/**
 * Foton fyller hela ytan (cover). Packshots med genomskinlig bakgrund visas hela
 * (contain) mot produktens bakgrundsfärg. Avgörs genom att läsa hörnpixlarnas
 * genomskinlighet när bilden laddats.
 */
const detectFit = (img: HTMLImageElement): Fit => {
  try {
    const c = document.createElement("canvas");
    c.width = 8;
    c.height = 8;
    const ctx = c.getContext("2d");
    if (!ctx) return "cover";
    ctx.drawImage(img, 0, 0, 8, 8);
    const d = ctx.getImageData(0, 0, 8, 8).data;
    const corners = [0, 7, 56, 63].map((i) => d[i * 4 + 3] ?? 255);
    return corners.some((a) => a < 250) ? "contain" : "cover";
  } catch {
    return "cover";
  }
};

/**
 * Ljudlös video som startar av sig själv. Mobiler blockerar ibland automatisk uppspelning
 * (Instagrams och Facebooks inbyggda webbläsare, energisparläge på iPhone) – då syns bara
 * stillbilden. I så fall visas en uppspelningsknapp; ett tryck räknas som användaråtgärd och tillåts alltid.
 */
function GalleryVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [blocked, setBlocked] = useState(false);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => setBlocked(true));
    // Vissa webbläsare avvisar inte play() utan står bara still – kontrollera efter en stund
    const t = window.setTimeout(() => {
      if (v.paused) setBlocked(true);
    }, 1500);
    return () => window.clearTimeout(t);
  }, []);
  const start = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    void v.play().then(() => setBlocked(false)).catch(() => setBlocked(true));
  };
  return (
    <>
      <video ref={ref} src={src} poster={poster} className="h-full w-full object-cover" autoPlay muted loop playsInline preload="metadata" disablePictureInPicture onPlaying={() => setBlocked(false)} />
      {blocked ? (
        <button type="button" onClick={start} aria-label="Spela upp videon" className="absolute inset-0 flex items-center justify-center bg-black/10">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-foreground shadow-lg">
            <PlayIcon size={28} />
          </span>
        </button>
      ) : null}
    </>
  );
}

export function ProductGallery({ media, name, bg }: { media: Media[]; name: string; bg: string }) {
  const [index, setIndex] = useState(0);
  const [fit, setFit] = useState<Record<string, Fit>>({});
  const current = media[index] ?? media[0]!;

  const onLoad = (src: string) => (e: SyntheticEvent<HTMLImageElement>) => {
    if (fit[src]) return;
    const result = detectFit(e.currentTarget);
    setFit((f) => (f[src] ? f : { ...f, [src]: result }));
  };
  const cls = (src: string, pad: string) => (fit[src] === "contain" ? `object-contain ${pad}` : "object-cover");

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[5rem_minmax(0,1fr)]">
      <div
        className="relative aspect-square min-w-0 overflow-hidden rounded-card lg:col-start-2 lg:row-start-1"
        style={{ backgroundColor: bg || "#f2efe8" }}
      >
        {current.type === "video" ? (
          <GalleryVideo key={current.src} src={current.src} poster={current.poster} />
        ) : (
          <Image
            key={current.src}
            src={current.src}
            alt={`${name} – bild ${index + 1}`}
            fill
            priority={index === 0}
            sizes="(max-width: 1024px) 100vw, 50vw"
            onLoad={onLoad(current.src)}
            className={cls(current.src, "p-8")}
          />
        )}
      </div>
      {media.length > 1 ? (
        <ul
          className="flex min-w-0 gap-2 overflow-x-auto scrollbar-none lg:col-start-1 lg:row-start-1 lg:flex-col lg:overflow-visible"
          aria-label="Fler bilder"
        >
          {media.map((m, i) => {
            const src = m.type === "video" ? m.poster : m.src;
            return (
              <li key={m.src + i} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={m.type === "video" ? "Visa video" : `Visa bild ${i + 1}`}
                  aria-current={i === index}
                  className={`relative h-20 w-20 overflow-hidden rounded-xl border-2 transition-colors ${
                    i === index ? "border-primary" : "border-transparent hover:border-line"
                  }`}
                  style={{ backgroundColor: bg || "#f2efe8" }}
                >
                  <Image src={src} alt="" fill sizes="80px" onLoad={onLoad(src)} className={cls(src, "p-1.5")} />
                  {m.type === "video" ? (
                    <span className="absolute inset-0 flex items-center justify-center text-white drop-shadow">
                      <PlayIcon size={22} />
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

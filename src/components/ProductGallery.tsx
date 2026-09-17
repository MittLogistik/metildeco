"use client";

import Image from "next/image";
import { useState } from "react";
import { PlayIcon } from "@/components/icons";

export type Media = { type: "image"; src: string } | { type: "video"; src: string; poster: string };

export function ProductGallery({ media, name, bg }: { media: Media[]; name: string; bg: string }) {
  const [index, setIndex] = useState(0);
  const current = media[index] ?? media[0]!;

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[5rem_minmax(0,1fr)]">
      <div
        className="relative aspect-square min-w-0 overflow-hidden rounded-card lg:col-start-2 lg:row-start-1"
        style={{ backgroundColor: bg || "#f2efe8" }}
      >
        {current.type === "video" ? (
          <video
            key={current.src}
            src={current.src}
            poster={current.poster}
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            controls
          />
        ) : (
          <Image
            key={current.src}
            src={current.src}
            alt={`${name} – bild ${index + 1}`}
            fill
            priority={index === 0}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain p-8"
          />
        )}
      </div>
      {media.length > 1 ? (
        <ul
          className="flex min-w-0 gap-2 overflow-x-auto scrollbar-none lg:col-start-1 lg:row-start-1 lg:flex-col lg:overflow-visible"
          aria-label="Fler bilder"
        >
          {media.map((m, i) => (
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
                <Image
                  src={m.type === "video" ? m.poster : m.src}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-contain p-2"
                />
                {m.type === "video" ? (
                  <span className="absolute inset-0 flex items-center justify-center text-white drop-shadow">
                    <PlayIcon size={22} />
                  </span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

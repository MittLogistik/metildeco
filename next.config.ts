import type { NextConfig } from "next";
import { localizedRewrites } from "./src/lib/routes";

/** Språk som fanns i gamla butiken men inte är byggda ännu – skickas tills vidare till svenska. */
const pendingLocales = ["en", "no", "nb", "de", "be", "it", "fr", "es", "pl", "pt", "lv", "lt", "ee", "et", "at", "ch", "ie", "uk", "gb", "us", "eu"];

const nextConfig: NextConfig = {
  // satori och harfbuzzjs letar upp sina egna filer i körningen. Buntas de av Next hittar
  // de inte hb.wasm, och all text på annonsbilder misslyckas. Därför externa + medskickade.
  serverExternalPackages: ["satori", "harfbuzzjs", "@shuding/opentype.js"],
  // Typsnitten och wasm-filerna läses från disk i serverless-funktionerna
  outputFileTracingIncludes: {
    "/**": ["./src/assets/fonts/*", "./node_modules/harfbuzzjs/hb.wasm", "./node_modules/harfbuzzjs/hb.js", "./node_modules/satori/yoga.wasm"],
  },
  // Serveraktioner tar emot 1 MB som standard – bilduppladdningar i admin är större.
  // Riktigt stora filer går förbi aktionerna, direkt till lagringen (se ad-uploads).
  // globalNotFound: butiken (app/[lang]) och admin har var sin rotlayout, så 404 utanför dem behöver en egen sida
  experimental: { serverActions: { bodySizeLimit: "4mb" }, globalNotFound: true },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 640, 828, 1080, 1200, 1600],
    imageSizes: [56, 64, 80, 128, 256],
    qualities: [70, 80],
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" }],
  },
  // Förhandsdomänerna hos Vercel får aldrig indexeras: de är kopior av butiken och kan läsas som dubbletter
  async headers() {
    return [{ source: "/:path*", has: [{ type: "host", value: "(?<host>.*\.vercel\.app)" }], headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
  // Lokala slugar (/fi/tuotteet) visar de svenska mapparna (/fi/produkter). Före filsystemet,
  // annars fångas adressen av den dynamiska [doc]-sidan.
  async rewrites() {
    return { beforeFiles: localizedRewrites().rewrites, afterFiles: [], fallback: [] };
  },
  async redirects() {
    return [
      ...localizedRewrites().redirects,
      // Danmark med landskoden i stället för språkkoden
      { source: "/dk", destination: "/da", permanent: true },
      { source: "/dk/:path*", destination: "/da/:path*", permanent: true },
      // Rotadressen "/" väljer marknad efter besökarens land i src/proxy.ts (behåller parametrarna)
      // Gamla adresser från förra butiken – behåll länkkraft och undvik 404 vid domänbytet
      { source: "/sv/products", destination: "/sv/produkter", permanent: true },
      // Quizet frågar om sömn och fokus och rekommenderar produkter utifrån det (antydda effekter) – av tills det byggts om
      { source: "/sv/quiz", destination: "/sv/mal", permanent: false },
      // Övriga språk aktiveras ett i taget – tills dess svenska (tillfällig omdirigering)
      ...pendingLocales.flatMap((l) => [
        { source: `/${l}`, destination: "/sv", permanent: false },
        { source: `/${l}/:path*`, destination: "/sv", permanent: false },
      ]),
    ];
  },
};

export default nextConfig;

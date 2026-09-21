import type { NextConfig } from "next";

/** Språk som fanns i gamla butiken men inte är byggda ännu – skickas tills vidare till svenska. */
const pendingLocales = ["en", "fi", "da", "no", "de", "nl", "it", "fr", "es", "pl"];

const nextConfig: NextConfig = {
  // Typsnitten för text på annonsbilder läses från disk i serverless-funktionerna
  outputFileTracingIncludes: { "/**": ["./src/assets/fonts/*"] },
  // Serveraktioner tar emot 1 MB som standard – bilduppladdningar i admin är större.
  // Riktigt stora filer går förbi aktionerna, direkt till lagringen (se ad-uploads).
  experimental: { serverActions: { bodySizeLimit: "4mb" } },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 640, 828, 1080, 1200, 1600],
    imageSizes: [56, 64, 80, 128, 256],
    qualities: [70, 80],
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" }],
  },
  async redirects() {
    return [
      // Gamla adresser från förra butiken – behåll länkkraft och undvik 404 vid domänbytet
      { source: "/sv/products", destination: "/sv/produkter", permanent: true },
      // Övriga språk aktiveras ett i taget – tills dess svenska (tillfällig omdirigering)
      ...pendingLocales.flatMap((l) => [
        { source: `/${l}`, destination: "/sv", permanent: false },
        { source: `/${l}/:path*`, destination: "/sv", permanent: false },
      ]),
    ];
  },
};

export default nextConfig;

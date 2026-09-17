import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 640, 828, 1080, 1200, 1600],
    imageSizes: [56, 64, 80, 128, 256],
    qualities: [70, 80],
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" }],
  },
  async redirects() {
    return [
      // Gamla sökvägar från förra butiken – behåll länkkraft och feeds
      { source: "/sv/products", destination: "/sv/produkter", permanent: true },
    ];
  },
};

export default nextConfig;

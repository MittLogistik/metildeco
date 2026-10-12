import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { routesOf } from "@/lib/routes";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (!site.indexable) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    // Kassan och tacksidan på alla språk (lokala slugar från routes)
    rules: [{ userAgent: "*", allow: "/", disallow: [...locales.flatMap((l) => [routesOf(l).checkout, routesOf(l).thanks]), "/api/"] }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}

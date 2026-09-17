import type { MetadataRoute } from "next";
import { articles } from "@/lib/articles";
import { getCatalog } from "@/lib/catalog";
import { legalDocs } from "@/content/legal";
import { routes } from "@/lib/routes";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { products, bundles } = await getCatalog();
  const abs = (p: string) => `${site.url}${p}`;
  const now = new Date();
  return [
    { url: abs(routes.home), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: abs(routes.products), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    ...products.map((p) => ({ url: abs(routes.product(p.slug)), lastModified: new Date(p.updatedAt), changeFrequency: "weekly" as const, priority: 0.8 })),
    ...bundles.map((b) => ({ url: abs(routes.bundle(b.slug)), lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 })),
    { url: abs(routes.goals), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: abs(routes.subscription), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: abs(routes.articles), lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    ...articles.map((a) => ({ url: abs(routes.article(a.slug)), lastModified: new Date(a.updatedAt), changeFrequency: "monthly" as const, priority: 0.5 })),
    { url: abs(routes.story), lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: abs(routes.faq), lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: abs(routes.contact), lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    ...Object.keys(legalDocs).map((slug) => ({ url: abs(`/sv/${slug}`), lastModified: now, changeFrequency: "yearly" as const, priority: 0.3 })),
  ];
}

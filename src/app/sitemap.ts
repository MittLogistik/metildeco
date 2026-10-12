import type { MetadataRoute } from "next";
import { articles } from "@/lib/articles";
import { getCatalog } from "@/lib/catalog";
import { legalDocs } from "@/content/legal";
import { locales, markets, type Locale } from "@/lib/i18n";
import { docSlugFor, hasPage, routesOf, translatePath, type RouteKey } from "@/lib/routes";
import { site } from "@/lib/site";

type Entry = MetadataRoute.Sitemap[number];
type Freq = NonNullable<Entry["changeFrequency"]>;

/** Alla språkversioner av en svensk sökväg, för hreflang i sitemapen. */
function languages(svPath: string, only: Locale[]): Record<string, string> {
  return Object.fromEntries(only.map((l) => [markets[l].hreflang, `${site.url}${translatePath(svPath, l)}`]));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const catalogs = await Promise.all(locales.map((l) => getCatalog(l)));
  const out: MetadataRoute.Sitemap = [];

  /** En post per språk där sidan finns, med hreflang till de andra. */
  const add = (svPath: string, opts: { key?: RouteKey; only?: Locale[]; freq: Freq; priority: number; lastModified?: Date }) => {
    const langs = locales.filter((l) => (!opts.key || hasPage(opts.key, l)) && (!opts.only || opts.only.includes(l)));
    const alternates = { languages: languages(svPath, langs) };
    for (const l of langs) {
      out.push({ url: `${site.url}${translatePath(svPath, l)}`, lastModified: opts.lastModified ?? now, changeFrequency: opts.freq, priority: opts.priority, alternates });
    }
  };
  const sv = routesOf("sv");
  const sellsIn = (pick: (i: number) => boolean) => locales.filter((_, i) => pick(i));

  add(sv.home, { freq: "weekly", priority: 1 });
  add(sv.products, { freq: "weekly", priority: 0.9 });
  for (const p of catalogs[0]!.products) {
    add(sv.product(p.slug), { freq: "weekly", priority: 0.8, lastModified: new Date(p.updatedAt), only: sellsIn((i) => catalogs[i]!.products.some((x) => x.slug === p.slug)) });
  }
  for (const b of catalogs[0]!.bundles) {
    add(sv.bundle(b.slug), { freq: "weekly", priority: 0.7, only: sellsIn((i) => catalogs[i]!.bundles.some((x) => x.slug === b.slug)) });
  }
  add(sv.goals, { key: "goals", freq: "monthly", priority: 0.6 });
  add(sv.subscription, { key: "subscription", freq: "monthly", priority: 0.6 });
  add(sv.articles, { key: "articles", freq: "weekly", priority: 0.6 });
  for (const a of articles) add(sv.article(a.slug), { key: "articles", freq: "monthly", priority: 0.5, lastModified: new Date(a.updatedAt) });
  add(sv.story, { key: "story", freq: "yearly", priority: 0.4 });
  add(sv.faq, { key: "faq", freq: "monthly", priority: 0.4 });
  add(sv.contact, { key: "contact", freq: "yearly", priority: 0.4 });
  for (const slug of Object.keys(legalDocs)) {
    // Informationssidorna har egna slugar per språk – translatePath känner igen dem via routeSlugs
    add(`/sv/${docSlugFor(slug, "sv")}`, { freq: "yearly", priority: 0.3 });
  }
  return out;
}

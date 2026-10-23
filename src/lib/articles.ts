/**
 * Artiklar (Journalen). Källa: /data/articles.json (svenska, publicerade). Finska och danska
 * översättningar ligger i content/i18n/<språk>/articles.ts med samma slug; en artikel utan
 * översättning visas inte på det språket.
 */
import articlesJson from "../../data/articles.json";
import { articleText } from "@/content/i18n/articles";
import { defaultLocale, type Locale } from "./i18n";
import { mediaUrl } from "./media";
import { NOVEL_FOOD_ARTICLES, novelFoodsClosed } from "./novel-foods";

export type ArticleBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "image"; src: string; caption?: string }
  | { type: "quote"; text: string; source?: string }
  | { type: "list"; items: string[] }
  | { type: "products"; heading?: string; intro?: string; slugs: string[] };

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage: string | null;
  lead: string;
  blocks: ArticleBlock[];
  seoTitle: string | null;
  seoDescription: string | null;
  readMinutes: number;
  publishedAt: string | null;
  updatedAt: string;
};

type Raw = (typeof articlesJson)[number];

const normalizeBlock = (b: Record<string, unknown>): ArticleBlock | null => {
  switch (b.type) {
    case "paragraph":
    case "heading":
      return { type: b.type, text: String(b.text ?? "") };
    case "image":
      return {
        type: "image",
        src: mediaUrl(String(b.src ?? "")),
        caption: b.caption ? String(b.caption) : undefined,
      };
    case "quote":
      return {
        type: "quote",
        text: String(b.text ?? ""),
        source: b.source ? String(b.source) : undefined,
      };
    case "list":
      return { type: "list", items: Array.isArray(b.items) ? b.items.map(String) : [] };
    case "products":
      return {
        type: "products",
        heading: b.heading ? String(b.heading) : undefined,
        intro: b.intro ? String(b.intro) : undefined,
        slugs: Array.isArray(b.slugs) ? b.slugs.map(String) : [],
      };
    default:
      return null;
  }
};

export const articles: Article[] = (articlesJson as Raw[])
  .filter((a) => a.locale === "sv" && a.status === "published")
  .map((a) => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    category: a.category,
    coverImage: a.cover_image ? mediaUrl(a.cover_image) : null,
    lead: a.lead,
    blocks: (a.blocks as Record<string, unknown>[])
      .map(normalizeBlock)
      .filter((b): b is ArticleBlock => b !== null),
    seoTitle: a.seo_title,
    seoDescription: a.seo_description,
    readMinutes: a.read_minutes,
    publishedAt: a.published_at,
    updatedAt: a.updated_at,
  }))
  .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));

/** Artiklarna på ett språk: svenska som grund, översatta texter ovanpå (bilder och datum delas). */
const byLocale = new Map<Locale, Article[]>();
export function articlesFor(locale: Locale): Article[] {
  const cached = byLocale.get(locale);
  if (cached) return cached;
  const texts = articleText[locale] ?? {};
  const list = articles.flatMap((a) => {
    // Artiklar om novel food-produkter döljs där produkterna är stängda (lib/novel-foods)
    if (novelFoodsClosed(locale) && NOVEL_FOOD_ARTICLES.has(a.slug)) return [];
    if (locale === defaultLocale) return [a];
    const t = texts[a.slug];
    if (!t) return [];
    return [{
      ...a,
      title: t.title,
      excerpt: t.excerpt,
      category: t.category,
      lead: t.lead,
      seoTitle: t.seoTitle,
      seoDescription: t.seoDescription,
      blocks: t.blocks.map(normalizeBlock).filter((b): b is ArticleBlock => b !== null),
    }];
  });
  byLocale.set(locale, list);
  return list;
}

export const getArticle = (slug: string, locale: Locale = defaultLocale) => articlesFor(locale).find((a) => a.slug === slug);

export const articleCategoriesFor = (locale: Locale) => Array.from(new Set(articlesFor(locale).map((a) => a.category)));

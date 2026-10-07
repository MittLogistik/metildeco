import "server-only";
import { unstable_cache } from "next/cache";
import { legalDocs, type LegalBlock, type LegalDoc } from "@/content/legal";
import { supabaseAdmin, supabaseConfigured } from "./supabase";

/**
 * Redigerbara sidor (villkor, policyer, informationssidor). Standardtexten finns i
 * src/content/legal.ts; det som sparats i admin ligger i tabellen page_overrides och vinner.
 * Designen är densamma – bara innehållet byts (LegalDocView).
 */
export const PAGES_TAG = "pages";

type OverrideRow = {
  slug: string;
  title: string;
  intro: string;
  updated_label: string;
  meta_title: string;
  meta_description: string;
  blocks: unknown;
  updated_at: string;
};

const loadOverrides = unstable_cache(
  async (): Promise<Record<string, OverrideRow>> => {
    if (!supabaseConfigured()) return {};
    const { data, error } = await supabaseAdmin().from("page_overrides").select("*");
    if (error) {
      console.error("[sidor]", error.message);
      return {};
    }
    return Object.fromEntries(((data ?? []) as OverrideRow[]).map((r) => [r.slug, r]));
  },
  ["page-overrides-v1"],
  { tags: [PAGES_TAG], revalidate: 3600 },
);

const str = (v: unknown, max = 5000) => (typeof v === "string" ? v.slice(0, max) : "");

/** Tvättar block från databasen eller admin. Ogiltiga block hoppas över. */
export function cleanBlocks(input: unknown): LegalBlock[] {
  if (!Array.isArray(input)) return [];
  const out: LegalBlock[] = [];
  for (const raw of input.slice(0, 200)) {
    const b = (raw ?? {}) as Record<string, unknown>;
    switch (b.type) {
      case "h2":
      case "h3":
      case "p": {
        const text = str(b.text).trim();
        if (text) out.push({ type: b.type, text });
        break;
      }
      case "ul": {
        const items = (Array.isArray(b.items) ? b.items : []).map((i) => str(i, 2000).trim()).filter(Boolean);
        if (items.length) out.push({ type: "ul", items });
        break;
      }
      case "table": {
        const head = (Array.isArray(b.head) ? b.head : []).map((h) => str(h, 200).trim());
        const rows = (Array.isArray(b.rows) ? b.rows : []).map((r) => (Array.isArray(r) ? r.map((c) => str(c, 500).trim()) : [])).filter((r) => r.some(Boolean));
        if (head.some(Boolean) || rows.length) out.push({ type: "table", head, rows });
        break;
      }
      case "shippingTable":
      case "companyInfo":
        out.push({ type: b.type });
        break;
    }
  }
  return out;
}

export type EditablePage = LegalDoc & { edited: boolean; editedAt: string | null };

/** Sidan som den visas: sparad version om den finns, annars standardtexten. */
export async function getPage(slug: string): Promise<EditablePage | undefined> {
  const base = legalDocs[slug];
  if (!base) return undefined;
  const o = (await loadOverrides())[slug];
  if (!o) return { ...base, edited: false, editedAt: null };
  const blocks = cleanBlocks(o.blocks);
  return {
    slug,
    title: o.title || base.title,
    intro: o.intro,
    updated: o.updated_label,
    metaTitle: o.meta_title || base.metaTitle,
    metaDescription: o.meta_description || base.metaDescription,
    blocks: blocks.length ? blocks : base.blocks,
    edited: true,
    editedAt: o.updated_at,
  };
}

export async function listPages(): Promise<EditablePage[]> {
  return Promise.all(Object.keys(legalDocs).map(async (slug) => (await getPage(slug))!));
}

export async function savePage(slug: string, doc: { title: string; intro: string; updated: string; metaTitle: string; metaDescription: string; blocks: unknown }) {
  if (!legalDocs[slug]) throw new Error("Okänd sida.");
  const title = str(doc.title, 200).trim();
  if (!title) throw new Error("Sidan behöver en rubrik.");
  const blocks = cleanBlocks(doc.blocks);
  if (!blocks.length) throw new Error("Sidan behöver minst ett textblock.");
  const { error } = await supabaseAdmin()
    .from("page_overrides")
    .upsert({
      slug,
      title,
      intro: str(doc.intro, 2000).trim(),
      updated_label: str(doc.updated, 200).trim(),
      meta_title: str(doc.metaTitle, 200).trim(),
      meta_description: str(doc.metaDescription, 500).trim(),
      blocks,
      updated_at: new Date().toISOString(),
    });
  if (error) throw new Error(error.message);
}

/** Tar bort den sparade versionen så att standardtexten visas igen. */
export async function resetPage(slug: string) {
  const { error } = await supabaseAdmin().from("page_overrides").delete().eq("slug", slug);
  if (error) throw new Error(error.message);
}

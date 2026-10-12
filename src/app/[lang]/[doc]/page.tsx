import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { legalDocs, type LegalDoc } from "@/content/legal";
import { legalDocFor } from "@/content/i18n";
import { alternates } from "@/i18n/server";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { getPage } from "@/lib/pages";
import { docKeyForSlug, docSlugFor } from "@/lib/routes";
import { LegalDocView } from "@/components/LegalDocView";

/**
 * Juridiska sidor och informationssidor: integritetspolicy, köpvillkor, cookies, kvalitetsgaranti, frakt, returer, hållbarhet.
 * Svenska kan redigeras i admin (/admin/sidor); sparade ändringar visas direkt (revalidateTag på PAGES_TAG).
 * Övriga språk har egna slugar (content/i18n/<språk>/legal) och redigeras inte i admin.
 */
export function generateStaticParams({ params }: { params: { lang: string } }) {
  const locale: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  // Både den lokala slugen och den svenska: next.config skriver om /fi/ostoehdot till /fi/kopvillkor
  const slugs = new Set(Object.keys(legalDocs).flatMap((key) => [key, docSlugFor(key, locale)]));
  return [...slugs].map((doc) => ({ doc }));
}

export const dynamicParams = false;

/** Den interna (svenska) nyckeln för en slug – lokal slug eller, efter omskrivningen, den svenska. */
const keyFor = (doc: string, locale: Locale) => docKeyForSlug(doc, locale) ?? docKeyForSlug(doc, defaultLocale);

async function load(lang: string, doc: string): Promise<{ locale: Locale; key: string; page: LegalDoc } | null> {
  if (!isLocale(lang)) return null;
  const key = keyFor(doc, lang);
  if (!key) return null;
  const page = lang === defaultLocale ? await getPage(key) : legalDocFor(key, lang);
  return page ? { locale: lang, key, page } : null;
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[doc]">): Promise<Metadata> {
  const { lang, doc } = await params;
  const d = await load(lang, doc);
  if (!d) return {};
  return {
    title: d.page.metaTitle,
    description: d.page.metaDescription,
    alternates: alternates(`/${d.locale}/${docSlugFor(d.key, d.locale)}`),
  };
}

export default async function DocPage({ params }: PageProps<"/[lang]/[doc]">) {
  const { lang, doc } = await params;
  const d = await load(lang, doc);
  if (!d) notFound();
  return <LegalDocView doc={d.page} locale={d.locale} />;
}

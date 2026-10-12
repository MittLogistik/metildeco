/**
 * Översatt innehåll per språk. Svenska ligger i content/*.ts och databasen; här finns bara
 * övriga språk. Saknas en text på ett språk visas inte sidan/produkten där (aldrig svensk reserv
 * på en finsk sida).
 */
import type { FaqGroup } from "@/content/faq";
import { faqGroups as svFaq } from "@/content/faq";
import type { LegalDoc } from "@/content/legal";
import { legalDocs as svLegal } from "@/content/legal";
import type { ProductContent } from "@/content/product-content";
import { productContent as svProductContent } from "@/content/product-content";
import type { Locale } from "@/lib/i18n";
import { catalog as daCatalog } from "./da/catalog";
import { faqGroups as daFaq } from "./da/faq";
import { legalDocs as daLegal } from "./da/legal";
import { productContent as daProductContent } from "./da/product-content";
import { catalog as fiCatalog } from "./fi/catalog";
import { faqGroups as fiFaq } from "./fi/faq";
import { legalDocs as fiLegal } from "./fi/legal";
import { productContent as fiProductContent } from "./fi/product-content";
import { catalog as nlCatalog } from "./nl/catalog";
import { faqGroups as nlFaq } from "./nl/faq";
import { legalDocs as nlLegal } from "./nl/legal";
import { productContent as nlProductContent } from "./nl/product-content";
import type { CatalogText } from "./types";

/** Katalogtexter för språk utöver svenska (svenska kommer från databasen). */
export const catalogText: Partial<Record<Locale, CatalogText>> = { fi: fiCatalog, da: daCatalog, nl: nlCatalog };

const productContentByLocale: Record<Locale, Record<string, ProductContent>> = { sv: svProductContent, fi: fiProductContent, da: daProductContent, nl: nlProductContent };
const legalByLocale: Record<Locale, Record<string, LegalDoc>> = { sv: svLegal, fi: fiLegal, da: daLegal, nl: nlLegal };
const faqByLocale: Record<Locale, FaqGroup[]> = { sv: svFaq, fi: fiFaq, da: daFaq, nl: nlFaq };

export const productContentFor = (slug: string, locale: Locale): ProductContent | undefined => productContentByLocale[locale][slug];
export const legalDocFor = (key: string, locale: Locale): LegalDoc | undefined => legalByLocale[locale][key];
export const faqFor = (locale: Locale): FaqGroup[] => faqByLocale[locale];

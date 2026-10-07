import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { legalDocs } from "@/content/legal";
import { getPage } from "@/lib/pages";
import { site } from "@/lib/site";
import { LegalDocView } from "@/components/LegalDocView";

/**
 * Juridiska sidor och informationssidor: integritetspolicy, köpvillkor, cookies, kvalitetsgaranti, frakt, returer, hållbarhet.
 * Innehållet kan redigeras i admin (/admin/sidor); sparade ändringar visas direkt (revalidateTag på PAGES_TAG).
 */
export function generateStaticParams() {
  return Object.keys(legalDocs).map((doc) => ({ doc }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/sv/[doc]">): Promise<Metadata> {
  const { doc } = await params;
  const d = await getPage(doc);
  if (!d) return {};
  return {
    title: d.metaTitle,
    description: d.metaDescription,
    alternates: { canonical: `${site.url}/sv/${doc}` },
  };
}

export default async function DocPage({ params }: PageProps<"/sv/[doc]">) {
  const { doc } = await params;
  const d = await getPage(doc);
  if (!d) notFound();
  return <LegalDocView doc={d} />;
}

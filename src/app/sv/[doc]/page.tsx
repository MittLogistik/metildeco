import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLegalDoc, legalDocs } from "@/content/legal";
import { site } from "@/lib/site";
import { LegalDocView } from "@/components/LegalDocView";

/** Juridiska sidor och informationssidor: integritetspolicy, köpvillkor, cookies, kvalitetsgaranti, frakt, returer, hållbarhet. */
export function generateStaticParams() {
  return Object.keys(legalDocs).map((doc) => ({ doc }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/sv/[doc]">): Promise<Metadata> {
  const { doc } = await params;
  const d = getLegalDoc(doc);
  if (!d) return {};
  return {
    title: d.metaTitle,
    description: d.metaDescription,
    alternates: { canonical: `${site.url}/sv/${doc}` },
  };
}

export default async function DocPage({ params }: PageProps<"/sv/[doc]">) {
  const { doc } = await params;
  const d = getLegalDoc(doc);
  if (!d) notFound();
  return <LegalDocView doc={d} />;
}

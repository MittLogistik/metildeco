import type { Metadata } from "next";
import Link from "next/link";
import { faqFor } from "@/content/i18n";
import { alternates, getI18n } from "@/i18n/server";
import { info } from "@/i18n/messages/info";
import { hasPage } from "@/lib/routes";
import { company } from "@/lib/site";
import { Accordion } from "@/components/Accordion";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, r } = await getI18n();
  const t = info[locale].faq;
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: alternates(r.faq),
  };
}

export default async function FaqPage() {
  const { locale, r } = await getI18n();
  const t = info[locale].faq;
  const faqGroups = faqFor(locale);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqGroups.flatMap((g) =>
      g.items.map((it) => ({
        "@type": "Question",
        name: it.q,
        acceptedAnswer: { "@type": "Answer", text: it.a },
      })),
    ),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <Container className="py-8 sm:py-12">
        <Breadcrumbs items={[{ label: t.title }]} />
        <SectionHeading as="h1" eyebrow={t.eyebrow} title={t.title} intro={t.intro} className="mt-6" />
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
          <nav aria-label={t.categories} className="lg:sticky lg:top-24 lg:self-start">
            <ul className="flex gap-2 overflow-x-auto scrollbar-none lg:flex-col">
              {faqGroups.map((g) => (
                <li key={g.id} className="shrink-0">
                  <a href={`#${g.id}`} className="block rounded-full border border-line px-4 py-2 text-sm font-medium hover:border-foreground/40 lg:border-0 lg:px-0 lg:py-1.5 lg:text-muted lg:hover:text-foreground">
                    {g.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-12">
            {faqGroups.map((g) => (
              <section key={g.id} id={g.id} className="scroll-mt-24">
                <h2 className="font-display text-2xl font-medium">{g.title}</h2>
                <div className="mt-4">
                  <Accordion items={g.items} name={`faq-${g.id}`} />
                </div>
              </section>
            ))}
            <section className="rounded-card bg-sand-soft p-8">
              <h2 className="font-display text-2xl font-medium">{t.moreTitle}</h2>
              <p className="mt-2 text-muted">
                {t.moreBefore}{" "}
                <a href={`mailto:${company.email}`} className="underline">
                  {company.email}
                </a>{" "}
                {t.moreOr}{" "}
                <a href={company.phoneHref} className="underline">
                  {company.phone}
                </a>
                .{t.languages ? ` ${t.languages}` : null}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <ButtonLink href={r.contact}>{t.contact}</ButtonLink>
                {hasPage("trackOrder", locale) ? (
                  <Link href={r.trackOrder} className="inline-flex h-11 items-center px-2 text-sm font-medium underline underline-offset-2">
                    {t.trackOrder}
                  </Link>
                ) : null}
              </div>
            </section>
          </div>
        </div>
      </Container>
    </>
  );
}

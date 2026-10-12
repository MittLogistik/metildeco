import type { Metadata } from "next";
import { alternates, getI18n } from "@/i18n/server";
import { info } from "@/i18n/messages/info";
import { hoursFor } from "@/lib/page-text";
import { company } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ButtonLink, Container, Eyebrow, SectionHeading } from "@/components/ui";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, r } = await getI18n();
  const t = info[locale].story;
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: alternates(r.story),
  };
}

export default async function StoryPage() {
  const { locale, r } = await getI18n();
  const t = info[locale].story;
  const c = info[locale].company;
  return (
    <>
      <section className="bg-sand-soft">
        <Container className="py-12 sm:py-16">
          <Breadcrumbs items={[{ label: t.title }]} />
          <div className="mt-6 max-w-2xl">
            <Eyebrow>{t.eyebrow}</Eyebrow>
            <h1 className="mt-3 font-display text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl">{t.title}</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">{t.intro}</p>
          </div>
        </Container>
      </section>

      <Container className="py-16">
        <div className="mx-auto max-w-3xl space-y-14">
          {t.sections.map((s) => (
            <section key={s.title}>
              <h2 className="font-display text-3xl font-medium">{s.title}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="mt-4 leading-relaxed text-muted">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </Container>

      <section className="bg-sand-soft">
        <Container className="py-16">
          <SectionHeading eyebrow={t.valuesEyebrow} title={t.valuesTitle} />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {t.values.map(([title, d]) => (
              <li key={title} className="rounded-card bg-white p-6 shadow-card">
                <h3 className="font-display text-lg font-medium">{title}</h3>
                <p className="mt-2 text-sm text-muted">{d}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Container className="py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow={t.companyEyebrow} title={t.companyTitle} intro={t.companyIntro(company.legalName)} />
          </div>
          <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            {[
              [t.legalName, company.legalName],
              [company.idLabel === "Org.nr" ? c.orgNumber : company.idLabel, company.orgNumber],
              [c.address, company.address.replace(/, Sverige$/, `, ${c.sweden}`)],
              [c.email, company.email],
              [c.phone, company.phone],
              [t.customerService, hoursFor(locale)],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-line p-4">
                <dt className="text-muted">{k}</dt>
                <dd className="mt-1 font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="mt-16 rounded-card bg-primary p-8 text-primary-fg sm:p-12">
          <h2 className="font-display text-3xl font-medium">{t.ctaTitle}</h2>
          <p className="mt-3 max-w-2xl text-primary-fg/80">{t.ctaText}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href={r.products} variant="white">
              {t.ctaProducts}
            </ButtonLink>
            <ButtonLink href={r.subscription} variant="ghost" className="text-primary-fg hover:bg-white/10">
              {t.ctaSubscription}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </>
  );
}

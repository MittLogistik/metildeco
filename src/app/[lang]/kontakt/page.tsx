import type { Metadata } from "next";
import Link from "next/link";
import { alternates, getI18n } from "@/i18n/server";
import { info } from "@/i18n/messages/info";
import { hoursFor } from "@/lib/page-text";
import { hasPage } from "@/lib/routes";
import { company } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactForm } from "@/components/ContactForm";
import { MailIcon, PhoneIcon, PinIcon } from "@/components/icons";
import { Container, SectionHeading } from "@/components/ui";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, r } = await getI18n();
  const t = info[locale].contact;
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: alternates(r.contact),
  };
}

export default async function ContactPage() {
  const { locale, r } = await getI18n();
  const t = info[locale].contact;
  // Svenska öppettider får "(svensk tid)" här; övriga språk har tidszonen i själva texten där den behövs
  const hours = locale === "sv" ? `${company.hours} (${t.swedishTime})` : hoursFor(locale);
  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs items={[{ label: t.title }]} />
      <SectionHeading as="h1" eyebrow={t.eyebrow} title={t.title} intro={t.intro} className="mt-6" />
      {t.languages ? <p className="mt-3 max-w-2xl text-sm text-muted">{t.languages}</p> : null}
      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-card border border-line p-6 sm:p-8">
          <h2 className="font-display text-2xl font-medium">{t.formTitle}</h2>
          <div className="mt-6">
            <ContactForm />
          </div>
        </section>
        <aside className="space-y-6">
          <section className="rounded-card bg-sand-soft p-6">
            <h2 className="font-display text-xl font-medium">{t.otherWays}</h2>
            <dl className="mt-4 space-y-4 text-sm">
              <div className="flex gap-3">
                <MailIcon size={18} className="mt-0.5 shrink-0 text-primary" />
                <div>
                  <dt className="text-muted">{t.email}</dt>
                  <dd>
                    <a href={`mailto:${company.email}`} className="font-medium hover:underline">
                      {company.email}
                    </a>
                  </dd>
                </div>
              </div>
              <div className="flex gap-3">
                <PhoneIcon size={18} className="mt-0.5 shrink-0 text-primary" />
                <div>
                  <dt className="text-muted">{t.phone}</dt>
                  <dd>
                    <a href={company.phoneHref} className="font-medium hover:underline">
                      {company.phone}
                    </a>
                    <span className="block text-muted">{hours}</span>
                  </dd>
                </div>
              </div>
              <div className="flex gap-3">
                <PinIcon size={18} className="mt-0.5 shrink-0 text-primary" />
                <div>
                  <dt className="text-muted">{t.companyInfo}</dt>
                  <dd>
                    {company.legalName}
                    <br />
                    {company.idLabel} {company.orgNumber}
                    <br />
                    {company.street}
                    <br />
                    {company.postalCode} {company.city}
                  </dd>
                </div>
              </div>
            </dl>
          </section>
          {hasPage("trackOrder", locale) ? (
            <section className="rounded-card border border-line p-6">
              <h2 className="font-display text-xl font-medium">{t.trackTitle}</h2>
              <p className="mt-2 text-sm text-muted">{t.trackText}</p>
              <Link href={r.trackOrder} className="mt-3 inline-block text-sm font-medium underline underline-offset-2">
                {t.trackLink}
              </Link>
            </section>
          ) : null}
          <section className="rounded-card border border-line p-6">
            <h2 className="font-display text-xl font-medium">{t.faqTitle}</h2>
            <p className="mt-2 text-sm text-muted">{t.faqText}</p>
            <Link href={r.faq} className="mt-3 inline-block text-sm font-medium underline underline-offset-2">
              {t.faqLink}
            </Link>
          </section>
        </aside>
      </div>
    </Container>
  );
}

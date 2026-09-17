import type { Metadata } from "next";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { company, site } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactForm } from "@/components/ContactForm";
import { MailIcon, PhoneIcon, PinIcon } from "@/components/icons";
import { Container, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Kontakta oss",
  description:
    "Har du en fråga om din order, en produkt eller din prenumeration? Metildes kundservice svarar inom 1–2 arbetsdagar.",
  alternates: { canonical: `${site.url}${routes.contact}` },
};

export default function ContactPage() {
  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Kontakta oss" }]} />
      <SectionHeading
        as="h1"
        eyebrow="Kundservice"
        title="Kontakta oss"
        intro="Vi svarar normalt inom 1–2 arbetsdagar, helgfria vardagar. Gäller det en pågående order är det snabbast om du anger ditt ordernummer."
        className="mt-6"
      />
      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-card border border-line p-6 sm:p-8">
          <h2 className="font-display text-2xl font-medium">Skicka ett meddelande</h2>
          <div className="mt-6">
            <ContactForm />
          </div>
        </section>
        <aside className="space-y-6">
          <section className="rounded-card bg-sand-soft p-6">
            <h2 className="font-display text-xl font-medium">Andra vägar till oss</h2>
            <dl className="mt-4 space-y-4 text-sm">
              <div className="flex gap-3">
                <MailIcon size={18} className="mt-0.5 shrink-0 text-primary" />
                <div>
                  <dt className="text-muted">E-post</dt>
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
                  <dt className="text-muted">Telefon</dt>
                  <dd>
                    <a href={company.phoneHref} className="font-medium hover:underline">
                      {company.phone}
                    </a>
                    <span className="block text-muted">{company.hours}</span>
                  </dd>
                </div>
              </div>
              <div className="flex gap-3">
                <PinIcon size={18} className="mt-0.5 shrink-0 text-primary" />
                <div>
                  <dt className="text-muted">Företagsuppgifter</dt>
                  <dd>
                    {company.legalName}
                    <br />
                    Org.nr {company.orgNumber}
                    <br />
                    {company.street}
                    <br />
                    {company.postalCode} {company.city}
                  </dd>
                </div>
              </div>
            </dl>
          </section>
          <section className="rounded-card border border-line p-6">
            <h2 className="font-display text-xl font-medium">Vill du bara veta var paketet är?</h2>
            <p className="mt-2 text-sm text-muted">Spåra din leverans direkt med ordernummer och e-post.</p>
            <Link href={routes.trackOrder} className="mt-3 inline-block text-sm font-medium underline underline-offset-2">
              Spåra din order
            </Link>
          </section>
          <section className="rounded-card border border-line p-6">
            <h2 className="font-display text-xl font-medium">Snabba svar</h2>
            <p className="mt-2 text-sm text-muted">Många frågor om frakt, retur och prenumeration besvaras redan i våra vanliga frågor.</p>
            <Link href={routes.faq} className="mt-3 inline-block text-sm font-medium underline underline-offset-2">
              Till vanliga frågor
            </Link>
          </section>
        </aside>
      </div>
    </Container>
  );
}

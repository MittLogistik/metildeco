import type { Metadata } from "next";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { company, site } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container, SectionHeading } from "@/components/ui";
import { TrackForm } from "./TrackForm";

export const metadata: Metadata = {
  title: "Spåra din order",
  description: "Ange ditt ordernummer och din e-postadress för att se var din Metilde-leverans befinner sig just nu.",
  alternates: { canonical: `${site.url}${routes.trackOrder}` },
};

export default function TrackOrderPage() {
  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Spåra order" }]} />
      <SectionHeading
        as="h1"
        eyebrow="Leverans"
        title="Spåra din order"
        intro="Ange ordernumret från din orderbekräftelse tillsammans med e-postadressen du handlade med, så visar vi var paketet befinner sig."
        className="mt-6"
      />
      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <TrackForm />
        <aside className="space-y-4">
          <section className="rounded-card bg-sand-soft p-6">
            <h2 className="font-display text-lg font-medium">Har du ett konto?</h2>
            <p className="mt-1 text-sm text-muted">Logga in så ser du alla dina ordrar och prenumerationer samlade på ett ställe.</p>
            <Link href={routes.account} className="mt-3 inline-block text-sm font-medium underline underline-offset-2">
              Till Mitt konto
            </Link>
          </section>
          <section className="rounded-card border border-line p-6">
            <h2 className="font-display text-lg font-medium">Något som inte stämmer?</h2>
            <p className="mt-1 text-sm text-muted">
              Hör av dig så tittar vi på din leverans. Mejla{" "}
              <a href={`mailto:${company.email}`} className="underline">
                {company.email}
              </a>{" "}
              eller ring {company.phone}.
            </p>
          </section>
        </aside>
      </div>
    </Container>
  );
}

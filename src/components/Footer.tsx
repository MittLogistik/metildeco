import Image from "next/image";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { company, site } from "@/lib/site";
import { Container } from "@/components/ui";
import { MailIcon, PhoneIcon, PinIcon } from "@/components/icons";
import { PaymentMethods } from "@/components/PaymentMethods";

const columns = [
  {
    title: "Kundservice",
    links: [
      { href: routes.shipping, label: "Frakt & leverans" },
      { href: routes.returns, label: "Returer & byten" },
      { href: routes.faq, label: "Vanliga frågor" },
      { href: routes.trackOrder, label: "Spåra order" },
      { href: routes.contact, label: "Kontakta oss" },
    ],
  },
  {
    title: "Om Metilde",
    links: [
      { href: routes.story, label: "Vår historia" },
      { href: routes.quality, label: "Kvalitetsgaranti" },
      { href: routes.sustainability, label: "Hållbarhet" },
      { href: routes.terms, label: "Köpvillkor" },
      { href: routes.privacy, label: "Integritetspolicy" },
    ],
  },
  {
    title: "Handla",
    links: [
      { href: routes.products, label: "Alla produkter" },
      { href: routes.goals, label: "Handla efter mål" },
      { href: routes.subscription, label: "Prenumeration" },
      { href: routes.category("Tongkat Ali"), label: "Tongkat Ali" },
      { href: routes.articles, label: "Journalen" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-sand-soft">
      <Container className="grid grid-cols-1 gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
        <div>
          <Link href={routes.home} className="flex items-center gap-2.5">
            <Image src="/logo-mark.png" alt="" width={44} height={32} className="h-8 w-auto" />
            <span className="font-display text-2xl font-medium tracking-tight">Metilde</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            Standardiserade ört- och svampextrakt tillverkade i Sverige. Utan onödiga tillsatser, tredjepartstestat batch för batch.
          </p>
          <address className="mt-6 space-y-2 text-sm not-italic">
            <p className="flex items-center gap-2">
              <MailIcon size={16} className="text-primary" />
              <a href={`mailto:${company.email}`} className="hover:underline">
                {company.email}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <PhoneIcon size={16} className="text-primary" />
              <a href={company.phoneHref} className="hover:underline">
                {company.phone}
              </a>
              <span className="text-muted">({company.hours})</span>
            </p>
            <p className="flex items-start gap-2">
              <PinIcon size={16} className="mt-0.5 shrink-0 text-primary" />
              <span>
                {company.legalName}, {company.street}, {company.postalCode} {company.city}
              </span>
            </p>
          </address>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em]">{col.title}</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {col.links.map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href} className="text-muted transition-colors hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <div className="border-t border-line">
        <Container className="flex flex-col gap-4 py-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {company.legalName} · Org.nr {company.orgNumber} · Alla rättigheter förbehållna.
          </p>
          <PaymentMethods size="sm" />
          <ul className="flex flex-wrap gap-4">
            <li>
              <Link href={routes.privacy} className="hover:text-foreground">
                Integritetspolicy
              </Link>
            </li>
            <li>
              <Link href={routes.terms} className="hover:text-foreground">
                Köpvillkor
              </Link>
            </li>
            <li>
              <Link href={routes.cookies} className="hover:text-foreground">
                Cookies
              </Link>
            </li>
            <li>
              <a href={site.social.facebook} rel="noopener" target="_blank" className="hover:text-foreground">
                Facebook
              </a>
            </li>
          </ul>
        </Container>
      </div>
    </footer>
  );
}

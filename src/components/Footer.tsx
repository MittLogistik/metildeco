import Image from "next/image";
import Link from "next/link";
import { getI18n } from "@/i18n/server";
import { layout } from "@/i18n/messages/layout";
import { hasPage, type RouteKey } from "@/lib/routes";
import { company, site } from "@/lib/site";
import { hoursFor } from "@/lib/page-text";
import { Container } from "@/components/ui";
import { MailIcon, PhoneIcon, PinIcon } from "@/components/icons";
import { PaymentMethods } from "@/components/PaymentMethods";
import { CookieSettingsLink } from "@/components/consent/CookieBanner";

type FooterLink = { href: string; label: string; key?: RouteKey };

/** `adSafe`: utan länken till Tongkat Ali (kampanjsidorna för Google Ads, se lib/ad-safe). */
export async function Footer({ adSafe = false }: { adSafe?: boolean } = {}) {
  const { locale, r } = await getI18n();
  const t = layout[locale].footer;
  const year = new Date().getFullYear();
  const columns: { title: string; links: FooterLink[] }[] = [
    {
      title: t.customerService,
      links: [
        { href: r.shipping, label: t.shipping },
        { href: r.returns, label: t.returns },
        { href: r.faq, label: t.faq },
        { href: r.trackOrder, label: t.trackOrder, key: "trackOrder" },
        { href: r.contact, label: t.contact },
      ],
    },
    {
      title: t.about,
      links: [
        { href: r.story, label: t.story },
        { href: r.quality, label: t.quality },
        { href: r.sustainability, label: t.sustainability },
        { href: r.terms, label: t.terms },
        { href: r.privacy, label: t.privacy },
      ],
    },
    {
      title: t.shop,
      links: [
        { href: r.products, label: t.allProducts },
        { href: r.goals, label: t.goals, key: "goals" },
        { href: r.subscription, label: t.subscription },
        ...(adSafe ? [] : [{ href: r.category("Tongkat Ali"), label: "Tongkat Ali" }]),
        { href: r.articles, label: t.articles, key: "articles" },
      ],
    },
  ];

  return (
    <footer className="border-t border-line bg-sand-soft">
      <Container className="grid grid-cols-1 gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
        <div>
          <Link href={r.home} className="flex items-center gap-2.5">
            <Image src="/logo-mark.png" alt="" width={44} height={32} className="h-8 w-auto" />
            <span className="font-display text-2xl font-medium tracking-tight">Metilde</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">{t.blurb}</p>
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
              <span className="text-muted">({hoursFor(locale)})</span>
            </p>
            {company.addressInFooter ? (
              <p className="flex items-start gap-2">
                <PinIcon size={16} className="mt-0.5 shrink-0 text-primary" />
                <span>
                  {company.legalName}, {company.street}, {company.postalCode} {company.city}
                </span>
              </p>
            ) : null}
          </address>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em]">{col.title}</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {col.links
                .filter((l) => !l.key || hasPage(l.key, locale))
                .map((l) => (
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
            © {year} {company.legalName} · {company.idLabel} {company.orgNumber} · {t.rights}
          </p>
          <PaymentMethods size="sm" />
          <ul className="flex flex-wrap gap-4">
            <li>
              <Link href={r.privacy} className="hover:text-foreground">
                {t.privacy}
              </Link>
            </li>
            <li>
              <Link href={r.terms} className="hover:text-foreground">
                {t.terms}
              </Link>
            </li>
            <li>
              <Link href={r.cookies} className="hover:text-foreground">
                {t.cookies}
              </Link>
            </li>
            <li>
              <CookieSettingsLink className="hover:text-foreground" />
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

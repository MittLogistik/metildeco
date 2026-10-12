import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { Figtree, Outfit } from "next/font/google";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Analytics } from "@/components/Analytics";
import { ClickTracker } from "@/components/affiliate/ClickTracker";
import { CookieBanner } from "@/components/consent/CookieBanner";
import { MetaPixel } from "@/components/consent/MetaPixel";
import { GoogleTag } from "@/components/consent/GoogleTag";
import { JsonLd } from "@/components/JsonLd";
import { LocaleProvider } from "@/i18n/client";
import { common } from "@/i18n/messages/common";
import { getCatalogSnapshot } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { isLocale, locales, markets } from "@/lib/i18n";
import { freeShippingOver } from "@/lib/shipping";
import { company, site } from "@/lib/site";

/** Typsnitten deklareras i varje rotlayout (en delad modul fick bygget hos Vercel att fallera). */
const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], display: "swap" });
const figtree = Figtree({ variable: "--font-figtree", subsets: ["latin"], weight: ["300", "400", "500", "600"], display: "swap" });
const fontClasses = `${outfit.variable} ${figtree.variable} h-full`;


/** Bara de byggda språken – övriga ger 404 (eller omdirigeras i next.config). */
export const dynamicParams = false;
export const generateStaticParams = () => locales.map((lang) => ({ lang }));

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = common[lang];
  const m = markets[lang];
  return {
    metadataBase: new URL(site.url),
    title: { default: t.siteTitle, template: "%s | Metilde" },
    description: t.siteDescription(formatPrice(freeShippingOver(lang), m.currency)),
    openGraph: { siteName: "Metilde", type: "website", locale: m.ogLocale },
    robots: site.indexable ? { index: true, follow: true } : { index: false, follow: false },
    other: { "facebook-domain-verification": "6mbl1dqomix8d4ri5ufmx9lqoau62k" },
  };
}

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  legalName: company.legalName,
  url: site.url,
  logo: `${site.url}/logo-mark.png`,
  ...(company.vatId ? { vatID: company.vatId } : {}),
  taxID: company.orgNumber,
  address: {
    "@type": "PostalAddress",
    streetAddress: company.street,
    postalCode: company.postalCode,
    addressLocality: company.city,
    addressCountry: company.countryCode,
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: company.email,
      telephone: company.phone.replace(/\s/g, ""),
      // Kundtjänsten svarar på svenska och engelska, oavsett butikens språk
      availableLanguage: ["sv", "en"],
    },
  ],
  sameAs: [site.social.facebook],
};

/** Butikens rotlayout. Språket i URL:en styr text, valuta, frakt och kassa. */
export default async function ShopLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const catalog = await getCatalogSnapshot(lang);
  return (
    <html lang={lang} className={fontClasses}>
      <body className="flex min-h-full flex-col">
        <LocaleProvider locale={lang}>
          <CartProvider catalog={catalog}>
            <Analytics />
            <ClickTracker />
            <JsonLd data={organization} />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
            <CookieBanner />
            <MetaPixel />
            <GoogleTag />
          </CartProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}

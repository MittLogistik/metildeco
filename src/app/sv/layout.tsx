import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { company, site } from "@/lib/site";

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  legalName: company.legalName,
  url: site.url,
  logo: `${site.url}/logo-mark.png`,
  vatID: `SE${company.orgNumber.replace("-", "")}01`,
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
      availableLanguage: ["sv", "en"],
    },
  ],
  sameAs: [site.social.facebook],
};

export default function SwedishLayout({ children }: LayoutProps<"/sv">) {
  return (
    <CartProvider>
      <JsonLd data={organization} />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </CartProvider>
  );
}

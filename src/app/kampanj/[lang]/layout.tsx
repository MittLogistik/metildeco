import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Figtree, Outfit } from "next/font/google";
import "../../globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Header } from "@/components/Header";
import { MarketHint } from "@/components/MarketHint";
import { Footer } from "@/components/Footer";
import { Analytics } from "@/components/Analytics";
import { ClickTracker } from "@/components/affiliate/ClickTracker";
import { CookieBanner } from "@/components/consent/CookieBanner";
import { MetaPixel } from "@/components/consent/MetaPixel";
import { GoogleTag } from "@/components/consent/GoogleTag";
import { MicrosoftTag } from "@/components/consent/MicrosoftTag";
import { LocaleProvider } from "@/i18n/client";
import { getCatalogSnapshot } from "@/lib/catalog";
import { isAdSafe } from "@/lib/ad-safe";
import { isLocale, locales, markets } from "@/lib/i18n";
import { site } from "@/lib/site";

/**
 * Rotlayout för kampanjsidorna till Google Ads (/sv/kampanj, /fi/kampanja, /da/kampagne, /nl/actie –
 * omskrivna hit i next.config). Samma butik som app/[lang], men korgens produktdata och sidfoten
 * innehåller inget som Google räknar som otillåtet ämne (lib/ad-safe). Annars underkänns målsidan
 * även om själva sidan inte nämner det.
 */
const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], display: "swap" });
const figtree = Figtree({ variable: "--font-figtree", subsets: ["latin"], weight: ["300", "400", "500", "600"], display: "swap" });

export const dynamicParams = false;
export const generateStaticParams = () => locales.map((lang) => ({ lang }));

export async function generateMetadata({ params }: LayoutProps<"/kampanj/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return {
    metadataBase: new URL(site.url),
    title: { default: "Metilde", template: "%s | Metilde" },
    openGraph: { siteName: "Metilde", type: "website", locale: markets[lang].ogLocale },
    // Annonsmålsida – ska inte konkurrera med de vanliga sidorna i sök
    robots: { index: false, follow: true },
  };
}

export default async function CampaignLayout({ children, params }: LayoutProps<"/kampanj/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const full = await getCatalogSnapshot(lang);
  const catalog = { ...full, products: full.products.filter((p) => isAdSafe({ ...p, short: "" })), bundles: [] };
  return (
    <html lang={lang} className={`${outfit.variable} ${figtree.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <LocaleProvider locale={lang}>
          <CartProvider catalog={catalog}>
            <Analytics />
            <ClickTracker />
            <MarketHint />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer adSafe />
            <CartDrawer />
            <CookieBanner />
            <MetaPixel />
            <GoogleTag />
            <MicrosoftTag />
          </CartProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}

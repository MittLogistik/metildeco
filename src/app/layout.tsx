import type { Metadata } from "next";
import { Figtree, Outfit } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Metilde – Rena botaniska kosttillskott tillverkade i Sverige",
    template: "%s | Metilde",
  },
  description:
    "Standardiserade örtextrakt och svampextrakt utan onödiga tillsatser. Tredjepartstestat, tillverkat i Sverige. Fri frakt över 499 kr.",
  openGraph: {
    siteName: "Metilde",
    type: "website",
    locale: "sv_SE",
  },
  robots: site.indexable ? { index: true, follow: true } : { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="sv" className={`${outfit.variable} ${figtree.variable} h-full`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}

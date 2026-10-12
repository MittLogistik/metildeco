import { Figtree, Outfit } from "next/font/google";

/** Typsnitten delas av butikens och adminens rotlayouter. */
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

export const fontClasses = `${outfit.variable} ${figtree.variable} h-full`;

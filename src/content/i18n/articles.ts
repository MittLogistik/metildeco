/** Översatta artiklar per språk (svenska ligger i data/articles.json). Egen modul så att katalogen inte drar med artiklarna. */
import type { Locale } from "@/lib/i18n";
import { articles as daArticles } from "./da/articles";
import { articles as fiArticles } from "./fi/articles";
import type { ArticleText } from "./types";

export const articleText: Partial<Record<Locale, Record<string, ArticleText>>> = { fi: fiArticles, da: daArticles };

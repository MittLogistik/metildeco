/** Översatta artiklar per språk (svenska ligger i data/articles.json). Egen modul så att katalogen inte drar med artiklarna. */
import type { Locale } from "@/lib/i18n";
import { articles as daArticles } from "./da/articles";
import { articles as fiArticles } from "./fi/articles";
import { articles as nlArticles } from "./nl/articles";
import { articles as deArticles } from "./de/articles";
import { articles as frArticles } from "./fr/articles";
import { articles as enArticles } from "./en/articles";
import { articles as plArticles } from "./pl/articles";
import type { ArticleText } from "./types";

export const articleText: Partial<Record<Locale, Record<string, ArticleText>>> = { fi: fiArticles, da: daArticles, nl: nlArticles, de: deArticles, fr: frArticles, en: enArticles, pl: plArticles };

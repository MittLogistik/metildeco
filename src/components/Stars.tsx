import { StarIcon } from "@/components/icons";
import { defaultLocale, markets, type Locale } from "@/lib/i18n";
import { catalog } from "@/i18n/messages/catalog";

export function Stars({ rating, count, size = 14, locale = defaultLocale }: { rating: number; count?: number; size?: number; locale?: Locale }) {
  const rounded = Math.round(rating);
  const value = new Intl.NumberFormat(markets[locale].intl, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(rating);
  return (
    <span className="inline-flex items-center gap-1.5" aria-label={catalog[locale].rating(value)}>
      <span className="inline-flex text-star">
        {[1, 2, 3, 4, 5].map((n) => (
          <StarIcon key={n} size={size} filled={n <= rounded} />
        ))}
      </span>
      <span className="text-xs text-muted tabular-nums">
        {value}
        {count !== undefined ? ` (${count})` : ""}
      </span>
    </span>
  );
}

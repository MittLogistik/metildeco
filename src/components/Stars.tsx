import { StarIcon } from "@/components/icons";

export function Stars({ rating, count, size = 14 }: { rating: number; count?: number; size?: number }) {
  const rounded = Math.round(rating);
  return (
    <span className="inline-flex items-center gap-1.5" aria-label={`Betyg ${rating.toFixed(1)} av 5`}>
      <span className="inline-flex text-star">
        {[1, 2, 3, 4, 5].map((n) => (
          <StarIcon key={n} size={size} filled={n <= rounded} />
        ))}
      </span>
      <span className="text-xs text-muted tabular-nums">
        {rating.toFixed(1).replace(".", ",")}
        {count !== undefined ? ` (${count})` : ""}
      </span>
    </span>
  );
}

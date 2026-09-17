/** Prisformat på svenska: "1 099 kr", "239 kr". */
export const formatPrice = (amount: number, currency = "SEK"): string => {
  const rounded = Math.round(amount * 100) / 100;
  const hasDecimals = Math.abs(rounded - Math.round(rounded)) > 0.004;
  const formatted = new Intl.NumberFormat("sv-SE", {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0,
  }).format(rounded);
  const suffix = currency === "SEK" ? "kr" : currency;
  return `${formatted} ${suffix}`;
};

export const formatDate = (iso: string | null | undefined): string => {
  if (!iso) return "";
  return new Intl.DateTimeFormat("sv-SE", { dateStyle: "long" }).format(new Date(iso));
};

export const percentOff = (price: number, oldPrice?: number | null): number | null => {
  if (!oldPrice || oldPrice <= price) return null;
  return Math.round((1 - price / oldPrice) * 100);
};

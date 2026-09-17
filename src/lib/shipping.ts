/** Fraktzoner och priser. Källa: /data/shipping_zones.json + shipping_rates.json. */
import zonesJson from "../../data/shipping_zones.json";
import ratesJson from "../../data/shipping_rates.json";

export type ShippingRate = {
  zone: string;
  method: string;
  label: string;
  description: string;
  price: number;
  freeOver: number | null;
  sortOrder: number;
};

const methodLabels: Record<string, { label: string; description: string }> = {
  varubrev: { label: "Varubrev", description: "Levereras i brevlådan, 1–3 arbetsdagar" },
  "tracked-letter": { label: "Spårbart brev", description: "Spårbar leverans i brevlådan, 1–3 arbetsdagar" },
  ombud: { label: "Paket till ombud", description: "Hämtas hos närmaste ombud, 1–3 arbetsdagar" },
};

type RawZone = { code: string; name: string; countries: string[]; active: boolean; sort_order: number };
type RawRate = {
  zone_code: string;
  method: string;
  currency: string;
  price: number;
  free_over: number | null;
  sort_order: number;
  active: boolean;
};

export const shippingZones = (zonesJson as RawZone[])
  .filter((z) => z.active)
  .sort((a, b) => a.sort_order - b.sort_order);

export const ratesForZone = (zone: string, currency = "SEK"): ShippingRate[] =>
  (ratesJson as RawRate[])
    .filter((r) => r.active && r.zone_code === zone && r.currency === currency)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((r) => ({
      zone: r.zone_code,
      method: r.method,
      label: methodLabels[r.method]?.label ?? r.method,
      description: methodLabels[r.method]?.description ?? "",
      price: Number(r.price),
      freeOver: r.free_over === null ? null : Number(r.free_over),
      sortOrder: r.sort_order,
    }));

export const swedenRates = ratesForZone("se");

export const cheapestSwedenRate: ShippingRate = swedenRates.reduce((best, r) =>
  r.price < best.price ? r : best,
);

/** Fraktkostnad för ett valt fraktsätt givet varuvärde. */
export const shippingCost = (rate: ShippingRate, subtotal: number): number =>
  rate.freeOver !== null && subtotal >= rate.freeOver ? 0 : rate.price;

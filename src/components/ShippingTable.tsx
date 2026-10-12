import { info } from "@/i18n/messages/info";
import { formatPrice } from "@/lib/format";
import { markets, type Locale } from "@/lib/i18n";
import { ratesFor, ratesForZone, shippingZones } from "@/lib/shipping";

const deliveryTimes: Record<string, string> = {
  se: "1–3 arbetsdagar",
  nordic: "2–5 arbetsdagar",
  eu: "3–7 arbetsdagar",
  world: "5–12 arbetsdagar",
};

type Row = { zone: string; method: string; time: string; cost: string };

/**
 * Frakttabell som alltid speglar databasens fraktzoner och priser. På svenska alla zoner i SEK
 * (som tidigare); på övriga språk bara marknadens land, i marknadens valuta.
 */
export function ShippingTable({ locale = "sv" }: { locale?: Locale }) {
  const t = info[locale].shippingTable;
  const m = markets[locale];
  const rows: Row[] =
    locale === "sv"
      ? shippingZones.flatMap((zone) =>
          ratesForZone(zone.code).map((r) => ({
            zone: zone.name,
            method: r.label,
            time: deliveryTimes[zone.code] ?? "",
            cost: r.freeOver !== null ? t.freeOver(formatPrice(r.price), formatPrice(r.freeOver)) : formatPrice(r.price),
          })),
        )
      : ratesFor(locale).map((r) => ({
          zone: m.countryName,
          method: r.label,
          time: t.days(m.deliveryDays[0], m.deliveryDays[1]),
          cost:
            r.freeOver !== null
              ? t.freeOver(formatPrice(r.price, m.currency), formatPrice(r.freeOver, m.currency))
              : formatPrice(r.price, m.currency),
        }));
  return (
    <table>
      <thead>
        <tr>
          <th>{t.destination}</th>
          <th>{t.method}</th>
          <th>{t.time}</th>
          <th>{t.cost}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            <td>{r.zone}</td>
            <td>{r.method}</td>
            <td>{r.time}</td>
            <td>{r.cost}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

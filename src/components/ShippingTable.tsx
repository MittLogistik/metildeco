import { formatPrice } from "@/lib/format";
import { ratesForZone, shippingZones } from "@/lib/shipping";

const deliveryTimes: Record<string, string> = {
  se: "1–3 arbetsdagar",
  nordic: "2–5 arbetsdagar",
  eu: "3–7 arbetsdagar",
  world: "5–12 arbetsdagar",
};

/** Frakttabell som alltid speglar databasens fraktzoner och priser. */
export function ShippingTable() {
  const rows = shippingZones.flatMap((zone) =>
    ratesForZone(zone.code).map((r) => ({
      zone: zone.name,
      method: r.label,
      time: deliveryTimes[zone.code] ?? "",
      cost: r.freeOver !== null ? `${formatPrice(r.price)} – fri frakt över ${formatPrice(r.freeOver)}` : formatPrice(r.price),
    })),
  );
  return (
    <table>
      <thead>
        <tr>
          <th>Destination</th>
          <th>Fraktsätt</th>
          <th>Leveranstid</th>
          <th>Kostnad</th>
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

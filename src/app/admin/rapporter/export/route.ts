import { getAdminUser } from "@/lib/auth";
import { countryLabel, getSalesReport, kindLabel, resolveRange } from "@/lib/reports";
import type { Env } from "@/lib/stats";

/** CSV-export av försäljningsrapporten: en rad per produkt (typ=produkter) eller per order (typ=ordrar). */
export async function GET(request: Request) {
  if (!(await getAdminUser())) return new Response("Inte inloggad", { status: 401 });
  const sp = new URL(request.url).searchParams;
  const env: Env = sp.get("env") === "test" ? "sandbox" : "live";
  const typ = sp.get("typ") === "ordrar" ? "ordrar" : "produkter";
  const range = resolveRange({ period: sp.get("period") ?? undefined, from: sp.get("from") ?? undefined, to: sp.get("to") ?? undefined });
  const report = await getSalesReport(range, env);

  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const num = (v: number) => String(Math.round(v * 100) / 100).replace(".", ",");
  const rows: string[] = [];
  if (typ === "produkter") {
    rows.push(["produkt", "artikelnummer", "slug", "typ", "ordrar", "antal", "omsattning_sek", "andel_procent"].join(";"));
    for (const r of report.products) rows.push([r.label, r.sku, r.slug, r.isBundle ? "paket" : "produkt", r.orders, r.units, num(r.revenue), num(r.share)].map(esc).join(";"));
  } else {
    rows.push(["ordernummer", "datum", "status", "typ", "e-post", "land", "fraktsatt", "rabattkod", "varor", "rabatt", "frakt", "total", "valuta", "antal", "prenumeration"].join(";"));
    for (const o of report.orders) {
      const units = (o.order_items ?? []).reduce((s, i) => s + Number(i.qty), 0);
      rows.push(
        [
          o.order_number,
          new Date(o.created_at).toLocaleString("sv-SE", { timeZone: "Europe/Stockholm", dateStyle: "short", timeStyle: "short" }),
          o.status,
          kindLabel[o.kind] ?? o.kind,
          o.email,
          countryLabel(o.shipping_country),
          o.shipping_method,
          o.discount_code,
          num(Number(o.subtotal)),
          num(Number(o.discount)),
          num(Number(o.shipping)),
          num(Number(o.total)),
          o.currency,
          units,
          o.has_subscription || o.kind === "renewal" ? "ja" : "nej",
        ]
          .map(esc)
          .join(";"),
      );
    }
  }
  const name = `metilde-${typ}-${range.from ?? "allt"}-${range.to}${env === "sandbox" ? "-test" : ""}.csv`;
  return new Response("﻿" + rows.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${name}"`,
    },
  });
}

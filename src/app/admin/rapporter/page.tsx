import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { getSalesReport, reportPeriods, resolveRange, type Row } from "@/lib/reports";
import type { Env } from "@/lib/stats";
import { Card } from "../_components/fields";
import { TrendChart } from "../_components/TrendChart";

const fmtCount = (v: number) => new Intl.NumberFormat("sv-SE").format(Math.round(v));
const fmtShare = (v: number) => `${v.toFixed(1).replace(".", ",")} %`;
const fmtDay = (day: string) => new Date(day + "T00:00:00").toLocaleDateString("sv-SE", { day: "numeric", month: "long", year: "numeric" });

function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 font-display text-2xl font-medium tabular-nums">{value}</p>
      {hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

/** Tabell över en fördelning: rader med ordrar, enheter, omsättning och andel. */
function Breakdown({ title, rows, unitLabel = "Enheter", empty }: { title: string; rows: Row[]; unitLabel?: string; empty: string }) {
  return (
    <Card title={title}>
      {rows.length === 0 ? (
        <p className="text-sm text-muted">{empty}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="py-2 pr-3"> </th>
                <th className="py-2 pr-3 text-right">Ordrar</th>
                <th className="py-2 pr-3 text-right">{unitLabel}</th>
                <th className="py-2 pr-3 text-right">Omsättning</th>
                <th className="py-2 text-right">Andel</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key} className="border-t border-line">
                  <td className="py-2 pr-3">{r.label}</td>
                  <td className="py-2 pr-3 text-right tabular-nums">{fmtCount(r.orders)}</td>
                  <td className="py-2 pr-3 text-right tabular-nums">{fmtCount(r.units)}</td>
                  <td className="py-2 pr-3 text-right tabular-nums">{formatPrice(Math.round(r.revenue))}</td>
                  <td className="py-2 text-right tabular-nums text-muted">{fmtShare(r.share)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

export default async function ReportsPage({ searchParams }: PageProps<"/admin/rapporter">) {
  await requireAdmin();
  const sp = await searchParams;
  const env: Env = sp.env === "test" ? "sandbox" : "live";
  const range = resolveRange(sp);
  const report = await getSalesReport(range, env);
  const t = report.totals;
  const envQuery = env === "sandbox" ? "&env=test" : "";
  const href = (period: string) => `/admin/rapporter?period=${period}${envQuery}`;
  const rangeQuery = range.period === "egen" ? `from=${range.from}&to=${range.to}` : `period=${range.period}`;
  const exportHref = (typ: string) => `/admin/rapporter/export?${rangeQuery}&typ=${typ}${envQuery}`;
  const periodText = range.from ? `${fmtDay(range.from)} – ${fmtDay(range.to)}` : `alla ordrar till och med ${fmtDay(range.to)}`;
  const test = env === "sandbox";

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium">Rapporter</h1>
          <p className="mt-1 text-sm text-muted">
            Vad som sålts {periodText}
            {test ? " (testdata)" : ""}. Avbrutna, återbetalda och obetalda ordrar räknas inte.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <nav className="inline-flex rounded-full border border-line bg-white p-1" aria-label="Period">
            {reportPeriods.map((p) => (
              <Link key={p.id} href={href(p.id)} className={`rounded-full px-3 py-1.5 text-sm ${range.period === p.id ? "bg-foreground text-white" : "text-muted hover:text-foreground"}`}>
                {p.label}
              </Link>
            ))}
          </nav>
          <nav className="inline-flex rounded-full border border-line bg-white p-1" aria-label="Miljö">
            <Link href={`/admin/rapporter?${rangeQuery}`} className={`rounded-full px-3 py-1.5 text-sm ${!test ? "bg-foreground text-white" : "text-muted hover:text-foreground"}`}>
              Skarpt
            </Link>
            <Link href={`/admin/rapporter?${rangeQuery}&env=test`} className={`rounded-full px-3 py-1.5 text-sm ${test ? "bg-foreground text-white" : "text-muted hover:text-foreground"}`}>
              Testdata
            </Link>
          </nav>
        </div>
      </div>

      <form method="get" action="/admin/rapporter" className="flex flex-wrap items-end gap-3 rounded-2xl border border-line bg-white p-4">
        {test ? <input type="hidden" name="env" value="test" /> : null}
        <label className="text-sm">
          <span className="mb-1 block text-xs text-muted">Från</span>
          <input type="date" name="from" defaultValue={range.from ?? ""} required className="h-10 rounded-xl border border-line bg-white px-3 text-sm focus:border-primary focus:outline-none" />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-xs text-muted">Till</span>
          <input type="date" name="to" defaultValue={range.to} required className="h-10 rounded-xl border border-line bg-white px-3 text-sm focus:border-primary focus:outline-none" />
        </label>
        <button type="submit" className="h-10 rounded-xl bg-primary px-4 text-sm font-medium text-primary-fg">
          Visa period
        </button>
        <span className="ml-auto flex flex-wrap gap-3 text-sm">
          <a href={exportHref("produkter")} className="underline underline-offset-2">
            Exportera produkter (CSV)
          </a>
          <a href={exportHref("ordrar")} className="underline underline-offset-2">
            Exportera ordrar (CSV)
          </a>
        </span>
      </form>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <Kpi label="Omsättning" value={formatPrice(Math.round(t.revenue))} hint="inkl. moms och frakt" />
        <Kpi label="Ordrar" value={fmtCount(t.orders)} hint={`${fmtCount(t.units)} sålda enheter`} />
        <Kpi label="Snittorder" value={t.orders ? formatPrice(Math.round(t.average)) : "–"} hint="omsättning per order" />
        <Kpi label="Varor" value={formatPrice(Math.round(t.goods))} hint={t.discount ? `efter ${formatPrice(Math.round(t.discount))} i rabatt` : "efter rabatt, utan frakt"} />
        <Kpi label="Frakt" value={formatPrice(Math.round(t.shipping))} hint="betald av kund" />
        <Kpi label="Kunder" value={fmtCount(t.newCustomers + t.returningCustomers)} hint={`${fmtCount(t.newCustomers)} nya, ${fmtCount(t.returningCustomers)} återkommande`} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="text-sm text-muted">Omsättning per {report.granularity === "day" ? "dag" : "månad"}</h2>
          <p className="mt-1 font-display text-3xl font-medium tabular-nums">{formatPrice(Math.round(t.revenue))}</p>
          <div className="mt-3">
            <TrendChart points={report.revenueByBucket} unit="sek" height={140} />
          </div>
        </section>
        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="text-sm text-muted">Ordrar per {report.granularity === "day" ? "dag" : "månad"}</h2>
          <p className="mt-1 font-display text-3xl font-medium tabular-nums">{fmtCount(t.orders)}</p>
          <div className="mt-3">
            <TrendChart points={report.ordersByBucket} unit="count" height={140} />
          </div>
        </section>
      </div>

      <Card title="Sålt per produkt">
        {report.products.length === 0 ? (
          <p className="text-sm text-muted">Inga sålda produkter under perioden.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="py-2 pr-3">Produkt</th>
                  <th className="py-2 pr-3">Art.nr</th>
                  <th className="py-2 pr-3 text-right">Ordrar</th>
                  <th className="py-2 pr-3 text-right">Antal</th>
                  <th className="py-2 pr-3 text-right">Omsättning</th>
                  <th className="py-2 text-right">Andel</th>
                </tr>
              </thead>
              <tbody>
                {report.products.map((r) => (
                  <tr key={r.key} className="border-t border-line">
                    <td className="py-2 pr-3">
                      <Link href={r.isBundle ? `/admin/paket/${r.slug}` : `/admin/produkter/${r.slug}`} className="hover:underline">
                        {r.label}
                      </Link>
                      {r.isBundle ? <span className="ml-1 text-xs text-muted">paket</span> : null}
                    </td>
                    <td className="py-2 pr-3 text-muted">{r.sku ?? "–"}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{fmtCount(r.orders)}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{fmtCount(r.units)}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{formatPrice(Math.round(r.revenue))}</td>
                    <td className="py-2 text-right tabular-nums text-muted">{fmtShare(r.share)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="text-xs text-muted">
                <tr className="border-t border-line">
                  <td className="py-2 pr-3" colSpan={3}>
                    Omsättning per rad är varuvärdet inkl. moms, efter rabatt. Andel av varor totalt.
                  </td>
                  <td className="py-2 pr-3 text-right tabular-nums">{fmtCount(t.units)}</td>
                  <td className="py-2 pr-3 text-right tabular-nums">{formatPrice(Math.round(report.products.reduce((s, r) => s + r.revenue, 0)))}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Burkar som lämnat lagret">
          {report.shipped.length === 0 ? (
            <p className="text-sm text-muted">Inget skickat under perioden.</p>
          ) : (
            <>
              <p className="mb-3 text-xs text-muted">Paketens innehåll räknas som egna produkter, så här syns vad som faktiskt plockats.</p>
              <ul className="divide-y divide-line text-sm">
                {report.shipped.map((r) => (
                  <li key={r.key} className="flex items-center justify-between py-2">
                    <Link href={`/admin/produkter/${r.key}`} className="hover:underline">
                      {r.label}
                    </Link>
                    <span className="tabular-nums">{fmtCount(r.units)} st</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>
        <div className="grid gap-3 sm:grid-cols-2">
          <Kpi label="Prenumerationsordrar" value={fmtCount(t.subscriptionOrders)} hint={t.orders ? `${fmtShare((t.subscriptionOrders / t.orders) * 100)} av ordrarna` : undefined} />
          <Kpi label="Avbrutna och återbetalda" value={fmtCount(t.cancelled.orders)} hint={`${formatPrice(Math.round(t.cancelled.amount))}, ej medräknat ovan`} />
          <Kpi label="Rabatter" value={formatPrice(Math.round(t.discount))} hint="totalt avdraget belopp" />
          <Kpi label="Enheter per order" value={t.orders ? (t.units / t.orders).toFixed(1).replace(".", ",") : "–"} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Breakdown title="Per källa" rows={report.sources} empty="Inga ordrar under perioden." />
        <Breakdown title="Per land" rows={report.countries} empty="Inga ordrar under perioden." />
        <Breakdown title="Per fraktsätt" rows={report.shippingMethods} empty="Inga ordrar under perioden." />
        <Breakdown title="Per ordertyp" rows={report.kinds} empty="Inga ordrar under perioden." />
        <Breakdown title="Per rabattkod" rows={report.discountCodes} empty="Ingen rabattkod har använts under perioden." />
      </div>
    </div>
  );
}

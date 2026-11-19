import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getCatalog } from "@/lib/catalog";
import { customerHref } from "@/lib/customers";
import {
  getDashboard,
  type Breakdown,
  type Dashboard,
  type StockWarning,
} from "@/lib/dashboard";
import { formatPrice } from "@/lib/format";
import { RENEWAL_DELIVERY_LEAD_DAYS } from "@/lib/orders";
import { site } from "@/lib/site";
import {
  getStats,
  periods,
  type Env,
  type Period,
  type Series,
} from "@/lib/stats";
import {
  CHARGE_WINDOW_DAYS,
  getSubscriptionOverview,
  UPCOMING_DAYS,
  type SubscriptionOverview,
  type UpcomingShipment,
} from "@/lib/subscription-stats";
import { supabaseAdmin } from "@/lib/supabase";
import { StatusBadge } from "./_components/fields";
import { SourceBadge } from "./_components/SourceBadge";
import { TrendChart } from "./_components/TrendChart";

type OrderRow = {
  id: string;
  order_number: string;
  created_at: string;
  email: string | null;
  shipping_name: string | null;
  shipping_country: string | null;
  total: number;
  currency: string;
  status: string;
  kind: string;
  source: string | null;
  source_detail: string | null;
};

const fmtCount = (v: number) =>
  new Intl.NumberFormat("sv-SE").format(Math.round(v));
const fmtPct = (v: number, digits = 1) =>
  `${v.toFixed(digits).replace(".", ",")} %`;
const fmtDay = (iso: string) =>
  new Date(iso).toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "short",
    timeZone: "Europe/Stockholm",
  });
const fmtUsd = (v: number, cur: string) =>
  new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: cur,
    maximumFractionDigits: v < 100 ? 2 : 0,
  }).format(v);
const rate = (part: number, whole: number) =>
  whole > 0 ? (part / whole) * 100 : 0;
/** Flagga ur landskoden (regional indicator symbols). */
const flag = (code: string) =>
  /^[A-Z]{2}$/.test(code)
    ? String.fromCodePoint(
        ...[...code].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65),
      )
    : "🌐";

/** De tio största länderna (ordrar först, sedan besökare); resten summeras på en rad. */
const topCountries = (rows: Breakdown[], n = 10): Breakdown[] => {
  if (rows.length <= n + 1) return rows;
  const rest = rows.slice(n);
  const sum = (k: "visitors" | "orders" | "revenue") => rest.reduce((s, r) => s + r[k], 0);
  return [...rows.slice(0, n), { key: "OTHER", label: `Övriga ${rest.length} länder`, visitors: sum("visitors"), orders: sum("orders"), revenue: sum("revenue") }];
};

function Panel({
  title,
  action,
  children,
  className = "",
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`min-w-0 rounded-2xl border border-line bg-white p-5 ${className}`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-lg font-medium">{title}</h2>
        {action}
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Kpi({
  label,
  value,
  note,
  href,
  tone,
}: {
  label: string;
  value: string;
  note?: string;
  href?: string;
  tone?: "danger";
}) {
  const cls = `block rounded-2xl border p-4 ${tone === "danger" ? "border-danger/40 bg-danger/5" : "border-line bg-white"} ${href ? "transition-colors hover:border-primary" : ""}`;
  const body = (
    <>
      <p className="text-xs text-muted">{label}</p>
      <p
        className={`mt-1 font-display text-2xl font-medium tabular-nums ${tone === "danger" ? "text-danger" : ""}`}
      >
        {value}
      </p>
      {note ? <p className="text-xs text-muted">{note}</p> : null}
    </>
  );
  return href ? (
    <Link href={href} className={cls}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

/** Säljtratten: besökare → varukorg → kassa → köp, med andel som går vidare i varje steg. */
function Funnel({ steps }: { steps: { label: string; value: number }[] }) {
  const max = Math.max(1, ...steps.map((s) => s.value));
  return (
    <ol className="grid gap-3 sm:grid-cols-4">
      {steps.map((s, i) => {
        const prev = i > 0 ? steps[i - 1]!.value : null;
        return (
          <li key={s.label} className="rounded-xl bg-sand-soft p-3">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-xs text-muted">{s.label}</span>
              {prev !== null ? (
                <span className="text-xs font-semibold tabular-nums text-primary">
                  {prev ? fmtPct(rate(s.value, prev)) : "–"}
                </span>
              ) : null}
            </div>
            <p className="mt-1 font-display text-2xl font-medium tabular-nums">
              {fmtCount(s.value)}
            </p>
            <div className="mt-2 h-1.5 rounded-full bg-white">
              <div
                className="h-1.5 rounded-full bg-primary"
                style={{ width: `${Math.max(2, (s.value / max) * 100)}%` }}
              />
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** Tabell med besökare, ordrar, omsättning och konvertering per rad (källa eller land), med stapel för andelen. */
function BreakdownTable({
  rows,
  first,
  empty,
}: {
  rows: Breakdown[];
  first: string;
  empty: string;
}) {
  if (rows.length === 0) return <p className="text-sm text-muted">{empty}</p>;
  const maxVisitors = Math.max(1, ...rows.map((r) => r.visitors));
  return (
    <div className="-mx-1 overflow-x-auto">
      <table className="w-full min-w-[30rem] text-sm">
        <thead className="text-left text-xs uppercase tracking-wider text-muted">
          <tr>
            <th className="px-1 py-1.5">{first}</th>
            <th className="px-1 py-1.5 text-right">Besökare</th>
            <th className="px-1 py-1.5 text-right">Ordrar</th>
            <th className="px-1 py-1.5 text-right">Omsättning</th>
            <th className="px-1 py-1.5 text-right">Konv.</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key} className="border-t border-line">
              <td className="px-1 py-2">
                <span className="block">{r.label}</span>
                <span className="mt-1 block h-1 max-w-40 rounded-full bg-sand">
                  <span
                    className="block h-1 rounded-full bg-primary/70"
                    style={{ width: `${(r.visitors / maxVisitors) * 100}%` }}
                  />
                </span>
              </td>
              <td className="px-1 py-2 text-right tabular-nums">
                {r.visitors ? fmtCount(r.visitors) : "–"}
              </td>
              <td className="px-1 py-2 text-right tabular-nums">
                {r.orders ? fmtCount(r.orders) : "–"}
              </td>
              <td className="px-1 py-2 text-right tabular-nums">
                {r.revenue ? formatPrice(Math.round(r.revenue)) : "–"}
              </td>
              <td className="px-1 py-2 text-right tabular-nums">
                {r.visitors && r.orders
                  ? fmtPct(rate(r.orders, r.visitors))
                  : "–"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Slut sedan länge = slut och inget sålt senaste 30 dagarna; de varnas inte för, bara listas. */
const longGone = (s: StockWarning) => s.level === "out" && s.sold30 === 0;

function StockList({ items: all }: { items: StockWarning[] }) {
  const items = all.filter((s) => !longGone(s));
  const gone = all.filter(longGone);
  if (all.length === 0)
    return (
      <p className="text-sm text-muted">
        Inga varningar – allt aktivt har mer än 10 i lager och räcker över en
        månad.
      </p>
    );
  if (items.length === 0)
    return (
      <>
        <p className="text-sm text-muted">Inget är på väg att ta slut.</p>
        <p className="mt-3 text-xs text-muted">
          Slut sedan länge (inget sålt senaste 30 dagarna):{" "}
          {gone.map((s) => s.name).join(", ")}.
        </p>
      </>
    );
  const badge = (s: StockWarning) =>
    s.level === "out" ? (
      <span className="rounded-full bg-danger/10 px-2 py-0.5 text-xs font-semibold text-danger">
        Slut
      </span>
    ) : s.level === "critical" ? (
      <span className="rounded-full bg-[#fff2df] px-2 py-0.5 text-xs font-semibold text-[#9a5a00]">
        Snart slut
      </span>
    ) : (
      <span className="rounded-full bg-sand px-2 py-0.5 text-xs font-semibold text-muted">
        Lågt
      </span>
    );
  return (
    <>
      <ul className="divide-y divide-line text-sm">
        {items.map((s) => (
          <li
            key={s.slug}
            className="flex items-center justify-between gap-3 py-2.5"
          >
            <div className="min-w-0">
              <Link
                href={`/admin/produkter/${s.slug}`}
                className="hover:underline"
              >
                {s.name}
              </Link>
              <span className="block text-xs text-muted">
                {s.sold30
                  ? `${fmtCount(s.sold30)} sålda senaste 30 dagarna`
                  : "Inget sålt senaste 30 dagarna"}
                {s.daysLeft !== null && s.stock > 0
                  ? ` · räcker ca ${s.daysLeft} dagar`
                  : ""}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span
                className={`tabular-nums ${s.stock <= 0 ? "font-semibold text-danger" : ""}`}
              >
                {s.stock} st
              </span>
              {badge(s)}
            </div>
          </li>
        ))}
      </ul>
      {gone.length ? (
        <p className="mt-3 text-xs text-muted">
          Slut sedan länge (inget sålt senaste 30 dagarna):{" "}
          {gone.map((s) => s.name).join(", ")}.
        </p>
      ) : null}
    </>
  );
}

function MetaPanel({ d }: { d: Dashboard }) {
  const m = d.meta;
  if (!m)
    return (
      <Panel title="Meta-annonser">
        <p className="text-sm text-muted">
          {d.metaError
            ? `Kunde inte hämta från Meta: ${d.metaError}`
            : "Meta-kopplingen är inte konfigurerad."}
        </p>
      </Panel>
    );
  const roas = m.spend > 0 ? m.revenue / m.spend : 0;
  return (
    <Panel
      title="Meta-annonser"
      action={
        <Link
          href="/admin/annonser"
          className="text-sm underline underline-offset-2"
        >
          Annonser
        </Link>
      }
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Kpi label="Kostnad" value={fmtUsd(m.spend, m.currency)} />
        <Kpi label="Visningar" value={fmtCount(m.impressions)} />
        <Kpi label="Länkklick" value={fmtCount(m.clicks)} />
        <Kpi
          label="CTR (länk)"
          value={fmtPct(m.ctr, 2)}
          note="klick per visning"
        />
        <Kpi
          label="Köp enligt Meta"
          value={fmtCount(m.purchases)}
          note={
            m.clicks
              ? `${fmtPct(rate(m.purchases, m.clicks))} av klicken`
              : undefined
          }
        />
        <Kpi
          label="ROAS"
          value={roas ? roas.toFixed(2).replace(".", ",") : "–"}
          note="köpvärde per krona i kostnad"
        />
      </div>
      {m.campaigns.length ? (
        <div className="-mx-1 mt-4 overflow-x-auto">
          <table className="w-full min-w-[34rem] text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-1 py-1.5">Kampanj</th>
                <th className="px-1 py-1.5 text-right">Kostnad</th>
                <th className="px-1 py-1.5 text-right">Visningar</th>
                <th className="px-1 py-1.5 text-right">CTR</th>
                <th className="px-1 py-1.5 text-right">Klick</th>
                <th className="px-1 py-1.5 text-right">Köp</th>
              </tr>
            </thead>
            <tbody>
              {m.campaigns.map((c) => (
                <tr key={c.id} className="border-t border-line">
                  <td className="max-w-64 truncate px-1 py-2" title={c.name}>
                    {c.name}
                  </td>
                  <td className="px-1 py-2 text-right tabular-nums">
                    {fmtUsd(c.spend, m.currency)}
                  </td>
                  <td className="px-1 py-2 text-right tabular-nums">
                    {fmtCount(c.impressions)}
                  </td>
                  <td className="px-1 py-2 text-right tabular-nums">
                    {c.impressions ? fmtPct(c.ctr, 2) : "–"}
                  </td>
                  <td className="px-1 py-2 text-right tabular-nums">
                    {fmtCount(c.clicks)}
                  </td>
                  <td className="px-1 py-2 text-right tabular-nums">
                    {c.purchases ? fmtCount(c.purchases) : "–"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted">
          Inga visningar under perioden.
        </p>
      )}
      <p className="mt-3 text-xs text-muted">
        Siffror från Metas rapport, i annonskontots valuta. Google Ads-siffror
        finns i Google Ads (inget API kopplat).
      </p>
    </Panel>
  );
}

function PaymentBadge({ s }: { s: UpcomingShipment }) {
  if (s.state === "paid")
    return (
      <span className="inline-flex rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-accent">
        Betald {fmtDay(s.chargeAt)}
      </span>
    );
  if (s.state === "failed")
    return (
      <span className="inline-flex rounded-full bg-danger/10 px-2.5 py-0.5 text-xs font-semibold text-danger">
        Misslyckades {fmtDay(s.chargeAt)}
      </span>
    );
  return (
    <span className="inline-flex rounded-full bg-sand px-2.5 py-0.5 text-xs font-semibold text-muted">
      Dras {fmtDay(s.chargeAt)}
    </span>
  );
}

function SubscriptionSection({
  overview: o,
  env,
  productName,
}: {
  overview: SubscriptionOverview;
  env: Env;
  productName: (slug: string | null) => string;
}) {
  const paidCount = o.upcoming.filter((s) => s.state === "paid").length;
  return (
    <Panel
      title={`Prenumerationer${env === "sandbox" ? " (test)" : ""}`}
      action={
        <Link
          href="/admin/kunder"
          className="text-sm underline underline-offset-2"
        >
          Alla kunder
        </Link>
      }
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <Kpi
          label="Aktiva prenumeranter"
          value={fmtCount(o.active)}
          note="dras och skickas som vanligt"
        />
        <Kpi
          label="Återkommande värde"
          value={formatPrice(Math.round(o.recurring30))}
          note="per 30 dagar, inkl. moms"
        />
        <Kpi
          label="Pausade"
          value={fmtCount(o.paused)}
          note="inga dragningar just nu"
        />
        <Kpi
          label="Avslutas"
          value={fmtCount(o.ending)}
          note="sista perioden pågår"
        />
        <Kpi
          label="Misslyckade dragningar"
          value={fmtCount(o.failed)}
          note={o.failed ? "Stripe försöker igen" : "allt betalt"}
          tone={o.failed ? "danger" : undefined}
        />
      </div>

      <div
        className={`mt-4 rounded-xl px-4 py-3 text-sm ${o.missingRenewals.length ? "bg-danger/10 text-danger" : "bg-sand"}`}
      >
        <p>
          <strong className="font-semibold">
            {fmtCount(o.charges.count)} dragningar
          </strong>{" "}
          på {formatPrice(Math.round(o.charges.sum))} de senaste{" "}
          {CHARGE_WINDOW_DAYS} dagarna.
        </p>
        {o.missingRenewals.length ? (
          <ul className="mt-2 list-disc pl-5">
            {o.missingRenewals.map((m) => (
              <li key={m.stripeSubscriptionId}>
                {m.email ?? m.stripeSubscriptionId}: förnyad i Stripe{" "}
                {fmtDay(m.periodStart)} men ingen förnyelseorder här.
                Kontrollera fakturan i Stripe och webhooken.
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-xs text-muted">
            Avstämning: alla aktiva prenumerationer som förnyats har en betald
            förnyelseorder.
          </p>
        )}
      </div>

      <div className="mt-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-medium">Kommande utskick</h3>
          <p className="text-xs text-muted">
            {o.upcoming.length} de närmaste {UPCOMING_DAYS} dagarna ·{" "}
            {paidCount} redan betalda
          </p>
        </div>
        {o.upcoming.length === 0 ? (
          <p className="mt-2 text-sm text-muted">
            Inga utskick planerade de närmaste {UPCOMING_DAYS} dagarna.
          </p>
        ) : (
          <ul className="mt-2 divide-y divide-line text-sm">
            {o.upcoming.map((s) => {
              const who = s.name ?? s.email ?? "Okänd kund";
              const href = s.orderId
                ? `/admin/ordrar/${s.orderId}`
                : customerHref(s.email);
              return (
                <li
                  key={s.key}
                  className="grid grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-3 py-2.5"
                >
                  <span className="tabular-nums font-medium">
                    {fmtDay(s.deliverAt)}
                  </span>
                  <span className="min-w-0">
                    {href ? (
                      <Link href={href} className="hover:underline">
                        {who}
                      </Link>
                    ) : (
                      who
                    )}
                    <span className="block truncate text-xs text-muted">
                      {s.qty > 1 ? `${s.qty} × ` : ""}
                      {productName(s.productSlug)} ·{" "}
                      {formatPrice(s.amount, s.currency)}
                    </span>
                  </span>
                  <PaymentBadge s={s} />
                </li>
              );
            })}
          </ul>
        )}
        <p className="mt-2 text-xs text-muted">
          Datumet är planerad leverans. Stripe drar pengarna vid periodens slut
          och leveransen planeras {RENEWAL_DELIVERY_LEAD_DAYS} dagar senare.
        </p>
      </div>
    </Panel>
  );
}

function StatCard({ s, env }: { s: Series; env?: Env }) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-sm text-muted">{s.label}</h2>
        {env === "sandbox" && s.unit === "sek" ? (
          <span className="rounded bg-sand px-1.5 text-[10px] uppercase text-muted">
            test
          </span>
        ) : null}
      </div>
      <p className="mt-1 font-display text-3xl font-medium tabular-nums">
        {s.unit === "sek"
          ? formatPrice(Math.round(s.total))
          : fmtCount(s.total)}
      </p>
      <div className="mt-3">
        <TrendChart points={s.points} unit={s.unit} height={110} />
      </div>
    </section>
  );
}

export default async function AdminDashboard({
  searchParams,
}: PageProps<"/admin">) {
  await requireAdmin();
  const sp = await searchParams;
  const period = (periods.find((p) => p.id === sp.period)?.id ??
    "30") as Period;
  const env: Env = sp.env === "test" ? "sandbox" : "live";
  const db = supabaseAdmin();
  const [stats, dash, latest, catalog, subs] = await Promise.all([
    getStats(period, env),
    getDashboard(period, env),
    db
      .from("orders")
      .select(
        "id,order_number,created_at,email,shipping_name,shipping_country,total,currency,status,kind,source,source_detail",
      )
      .eq("environment", env)
      .order("created_at", { ascending: false })
      .limit(8),
    getCatalog(undefined, true),
    getSubscriptionOverview(env),
  ]);
  const orders = (latest.data ?? []) as OrderRow[];
  const names = new Map<string, string>(
    [...catalog.allProducts, ...catalog.allBundles].map((p) => [
      p.slug,
      p.name,
    ]),
  );
  const productName = (slug: string | null) =>
    slug ? (names.get(slug) ?? slug) : "–";
  const href = (p: Period, e: Env) =>
    `/admin?period=${p}${e === "sandbox" ? "&env=test" : ""}`;
  const today = new Date().toLocaleDateString("sv-SE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const periodLabel = periods.find((p) => p.id === period)!.label.toLowerCase();

  const visitors = stats.visitors.total;
  // Varningen gäller det som nyss sålt slut eller snart tar slut, inte varor som legat slut länge
  const outOfStock = dash.stock.filter(
    (s) => s.level === "out" && !longGone(s),
  );
  const critical = dash.stock.filter((s) => s.level === "critical");
  const conversion = rate(dash.checkoutOrders, visitors);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium">Översikt</h1>
          <p className="mt-1 text-sm text-muted">
            {today[0]!.toUpperCase() + today.slice(1)} · {periodLabel}
            {stats.granularity === "hour"
              ? " · diagrammen timma för timma, svensk tid"
              : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <nav
            className="inline-flex flex-wrap rounded-full border border-line bg-white p-1"
            aria-label="Period"
          >
            {periods.map((p) => (
              <Link
                key={p.id}
                href={href(p.id, env)}
                className={`rounded-full px-3 py-1.5 text-sm ${period === p.id ? "bg-foreground text-white" : "text-muted hover:text-foreground"}`}
              >
                {p.label}
              </Link>
            ))}
          </nav>
          <nav
            className="inline-flex rounded-full border border-line bg-white p-1"
            aria-label="Miljö"
          >
            <Link
              href={href(period, "live")}
              className={`rounded-full px-3 py-1.5 text-sm ${env === "live" ? "bg-foreground text-white" : "text-muted hover:text-foreground"}`}
            >
              Skarpt
            </Link>
            <Link
              href={href(period, "sandbox")}
              className={`rounded-full px-3 py-1.5 text-sm ${env === "sandbox" ? "bg-foreground text-white" : "text-muted hover:text-foreground"}`}
            >
              Testdata
            </Link>
          </nav>
        </div>
      </div>

      {outOfStock.length || critical.length ? (
        <a
          href="#lager"
          className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger"
        >
          <strong className="font-semibold">Lagervarning</strong>
          {outOfStock.length ? (
            <span>
              {outOfStock.length} slut:{" "}
              {outOfStock.map((s) => s.name).join(", ")}
            </span>
          ) : null}
          {critical.length ? (
            <span>
              {outOfStock.length ? "· " : ""}{critical.length} snart slut:{" "}
              {critical.map((s) => `${s.name} (${s.stock})`).join(", ")}
            </span>
          ) : null}
        </a>
      ) : null}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
        <Kpi
          label="Omsättning"
          value={formatPrice(Math.round(stats.revenue.total))}
          note={`inkl. moms${env === "sandbox" ? " · test" : ""}`}
        />
        <Kpi
          label="Ordrar"
          value={fmtCount(stats.orders.total)}
          note={`${fmtCount(dash.checkoutOrders)} köp i kassan`}
          href="/admin/ordrar"
        />
        <Kpi
          label="Besökare"
          value={fmtCount(visitors)}
          note="unika per dygn"
        />
        <Kpi
          label="Konvertering"
          value={fmtPct(conversion)}
          note="köp per besökare"
        />
        <Kpi
          label="Snittorder"
          value={
            stats.orders.total
              ? formatPrice(
                  Math.round(stats.revenue.total / stats.orders.total),
                )
              : "–"
          }
        />
        <Kpi
          label="Marginal"
          value={
            stats.revenue.total
              ? `${Math.round((stats.netProfit.total / (stats.revenue.total / 1.12)) * 100)} %`
              : "–"
          }
          note={`netto ${formatPrice(Math.round(stats.netProfit.total))}`}
        />
        <Kpi
          label="Övergivna korgar"
          value={fmtCount(stats.abandonedOpen)}
          note={`${stats.abandonedWithEmail} med e-post`}
          href="/admin/korgar"
        />
      </div>

      <Panel title="Säljtratt">
        <Funnel
          steps={[
            { label: "Besökare", value: visitors },
            { label: "Lade i varukorgen", value: stats.addToCart.total },
            { label: "Gick till kassan", value: stats.beginCheckout.total },
            { label: "Köpte", value: dash.checkoutOrders },
          ]}
        />
        <p className="mt-2 text-xs text-muted">
          Procenten = andel av föregående steg. Köp räknar inte
          prenumerationsförnyelser.
        </p>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel
          title="Källor"
          action={
            <Link
              href="/admin/rapporter"
              className="text-sm underline underline-offset-2"
            >
              Rapporter
            </Link>
          }
        >
          <BreakdownTable
            rows={dash.sources}
            first="Källa"
            empty="Ingen trafik eller försäljning under perioden."
          />
          <p className="mt-2 text-xs text-muted">
            Besökare: källan vid dygnets första besök. Ordrar: senaste källan
            som inte var direkt, inom 30 dagar före köpet.
            {dash.hasVisitorSources
              ? ""
              : " Besökarnas källa räknas när databasmigreringen körts."}
          </p>
        </Panel>
        <Panel title="Länder">
          <BreakdownTable
            rows={topCountries(dash.countries).map((c) => ({
              ...c,
              label: `${flag(c.key)} ${c.label}`,
            }))}
            first="Land"
            empty="Ingen trafik eller försäljning under perioden."
          />
          <p className="mt-2 text-xs text-muted">
            Besökare efter IP-land, ordrar efter leveransland.
          </p>
        </Panel>
      </div>

      <MetaPanel d={dash} />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Panel
          title="Senaste ordrarna"
          action={
            <Link
              href="/admin/ordrar"
              className="text-sm underline underline-offset-2"
            >
              Alla ordrar
            </Link>
          }
        >
          {orders.length === 0 ? (
            <p className="text-sm text-muted">
              Inga {env === "sandbox" ? "test" : "skarpa "}ordrar ännu.
            </p>
          ) : (
            <ul className="divide-y divide-line text-sm">
              {orders.map((o) => (
                <li
                  key={o.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-2.5"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <Link
                        href={`/admin/ordrar/${o.id}`}
                        className="font-medium hover:underline"
                      >
                        {o.order_number}
                      </Link>
                      <span className="truncate text-muted">
                        {o.shipping_name ?? o.email}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                      <span>
                        {new Date(o.created_at).toLocaleString("sv-SE", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </span>
                      {o.shipping_country ? (
                        <span title={o.shipping_country}>
                          {flag(o.shipping_country)}
                        </span>
                      ) : null}
                      <SourceBadge source={o.source} kind={o.kind} compact />
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className="tabular-nums">
                      {formatPrice(Number(o.total), o.currency)}
                    </span>
                    <StatusBadge status={o.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel
          title="Lager"
          className="scroll-mt-6"
          action={
            <span id="lager" className="text-xs text-muted">
              takt = sålt senaste 30 dagarna
            </span>
          }
        >
          <StockList items={dash.stock} />
        </Panel>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard s={stats.visitors} />
        <StatCard s={stats.addToCart} />
        <StatCard s={stats.beginCheckout} />
        <StatCard s={stats.orders} env={env} />
        <StatCard s={stats.revenue} env={env} />
        <StatCard s={stats.netProfit} env={env} />
      </div>
      <p className="text-xs text-muted">
        Nettovinst = intäkt exkl. 12 % moms − inköpspris − fraktkostnad −{" "}
        {stats.handlingFee} kr hantering per order.
        {stats.missingPurchasePrice > 0 ? (
          <>
            {" "}
            <Link href="/admin/produkter" className="underline">
              {stats.missingPurchasePrice} produkter saknar inköpspris
            </Link>
            , så nettot är för högt tills de fylls i.
          </>
        ) : null}
      </p>

      <SubscriptionSection
        overview={subs}
        env={env}
        productName={productName}
      />

      <p className="text-xs text-muted">
        Produktfeed till Google Merchant Center:{" "}
        <code className="rounded bg-sand px-1.5 py-0.5">
          {site.url}/feeds/google.xml
        </code>{" "}
        (och google-fi, -dk, -nl, -de, -fr, -ie, -pl).
      </p>
    </div>
  );
}

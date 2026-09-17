import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getCatalog } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";
import { getStats, periods, type Env, type Period, type Series } from "@/lib/stats";
import { supabaseAdmin } from "@/lib/supabase";
import { StatusBadge } from "./_components/fields";
import { TrendChart } from "./_components/TrendChart";

type OrderRow = { id: string; order_number: string; created_at: string; email: string | null; shipping_name: string | null; total: number; status: string; kind: string };

const fmtCount = (v: number) => new Intl.NumberFormat("sv-SE").format(Math.round(v));

function StatCard({ s, env }: { s: Series; env?: Env }) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-sm text-muted">{s.label}</h2>
        {env === "sandbox" && s.unit === "sek" ? <span className="rounded bg-sand px-1.5 text-[10px] uppercase text-muted">test</span> : null}
      </div>
      <p className="mt-1 font-display text-3xl font-medium tabular-nums">{s.unit === "sek" ? formatPrice(Math.round(s.total)) : fmtCount(s.total)}</p>
      <div className="mt-3">
        <TrendChart points={s.points} unit={s.unit} height={110} />
      </div>
    </section>
  );
}

export default async function AdminDashboard({ searchParams }: PageProps<"/admin">) {
  await requireAdmin();
  const sp = await searchParams;
  const period = (periods.find((p) => p.id === sp.period)?.id ?? "30") as Period;
  const env: Env = sp.env === "test" ? "sandbox" : "live";
  const stats = await getStats(period, env);
  const db = supabaseAdmin();
  const [latest, catalog] = await Promise.all([
    db.from("orders").select("id,order_number,created_at,email,shipping_name,total,status,kind").eq("environment", env).order("created_at", { ascending: false }).limit(6),
    getCatalog(),
  ]);
  const orders = (latest.data ?? []) as OrderRow[];
  const lowStock = catalog.allProducts.filter((p) => p.isActive && p.trackStock && p.stock <= 10).sort((a, b) => a.stock - b.stock);
  const href = (p: Period, e: Env) => `/admin?period=${p}${e === "sandbox" ? "&env=test" : ""}`;
  const today = new Date().toLocaleDateString("sv-SE", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium">Översikt</h1>
          <p className="mt-1 text-sm text-muted">Så går butiken just nu – {today}.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <nav className="inline-flex rounded-full border border-line bg-white p-1" aria-label="Period">
            {periods.map((p) => (
              <Link key={p.id} href={href(p.id, env)} className={`rounded-full px-3 py-1.5 text-sm ${period === p.id ? "bg-foreground text-white" : "text-muted hover:text-foreground"}`}>
                {p.label}
              </Link>
            ))}
          </nav>
          <nav className="inline-flex rounded-full border border-line bg-white p-1" aria-label="Miljö">
            <Link href={href(period, "live")} className={`rounded-full px-3 py-1.5 text-sm ${env === "live" ? "bg-foreground text-white" : "text-muted hover:text-foreground"}`}>
              Skarpt
            </Link>
            <Link href={href(period, "sandbox")} className={`rounded-full px-3 py-1.5 text-sm ${env === "sandbox" ? "bg-foreground text-white" : "text-muted hover:text-foreground"}`}>
              Testdata
            </Link>
          </nav>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-xs text-muted">Konvertering</p>
          <p className="mt-1 font-display text-2xl font-medium tabular-nums">{stats.conversion.toFixed(1).replace(".", ",")} %</p>
          <p className="text-xs text-muted">ordrar per besökare</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-xs text-muted">Snittorder</p>
          <p className="mt-1 font-display text-2xl font-medium tabular-nums">{stats.orders.total ? formatPrice(Math.round(stats.revenue.total / stats.orders.total)) : "–"}</p>
          <p className="text-xs text-muted">intäkt per order</p>
        </div>
        <Link href="/admin/korgar" className="rounded-2xl border border-line bg-white p-4 transition-colors hover:border-primary">
          <p className="text-xs text-muted">Övergivna korgar</p>
          <p className="mt-1 font-display text-2xl font-medium tabular-nums">{stats.abandonedOpen}</p>
          <p className="text-xs text-muted">{stats.abandonedWithEmail} med e-post att följa upp</p>
        </Link>
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-xs text-muted">Marginal</p>
          <p className="mt-1 font-display text-2xl font-medium tabular-nums">
            {stats.revenue.total ? `${Math.round((stats.netProfit.total / (stats.revenue.total / 1.12)) * 100)} %` : "–"}
          </p>
          <p className="text-xs text-muted">netto av intäkt exkl. moms</p>
        </div>
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
        Nettovinst = intäkt exkl. 12 % moms − inköpspris − fraktkostnad − {stats.handlingFee} kr hantering per order.
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

      <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <section className="rounded-2xl border border-line bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-medium">Senaste ordrarna</h2>
            <Link href="/admin/ordrar" className="text-sm underline underline-offset-2">
              Alla ordrar
            </Link>
          </div>
          {orders.length === 0 ? (
            <p className="mt-3 text-sm text-muted">Inga {env === "sandbox" ? "test" : "skarpa "}ordrar ännu.</p>
          ) : (
            <ul className="mt-3 divide-y divide-line text-sm">
              {orders.map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <Link href={`/admin/ordrar/${o.id}`} className="font-medium hover:underline">
                      {o.order_number}
                    </Link>
                    <span className="ml-2 text-muted">{o.shipping_name ?? o.email}</span>
                    <span className="block text-xs text-muted">{new Date(o.created_at).toLocaleString("sv-SE", { dateStyle: "short", timeStyle: "short" })}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="tabular-nums">{formatPrice(Number(o.total))}</span>
                    <StatusBadge status={o.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="font-display text-lg font-medium">Lågt lager</h2>
          {lowStock.length === 0 ? (
            <p className="mt-3 text-sm text-muted">Alla aktiva produkter har mer än 10 i lager.</p>
          ) : (
            <ul className="mt-3 divide-y divide-line text-sm">
              {lowStock.map((p) => (
                <li key={p.slug} className="flex items-center justify-between py-2.5">
                  <Link href={`/admin/produkter/${p.slug}`} className="hover:underline">
                    {p.name}
                  </Link>
                  <span className={`tabular-nums ${p.stock === 0 ? "font-semibold text-danger" : ""}`}>{p.stock} st</span>
                </li>
              ))}
            </ul>
          )}
          <h2 className="mt-6 font-display text-lg font-medium">Produktfeed</h2>
          <p className="mt-1 text-xs text-muted">Adressen till Google Merchant Center (schemalagd hämtning).</p>
          <code className="mt-2 block break-all rounded-lg bg-sand px-3 py-2 text-xs">{site.url}/feeds/google.xml</code>
        </section>
      </div>
    </div>
  );
}

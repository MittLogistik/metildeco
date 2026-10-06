import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getCatalog } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";
import { customerHref } from "@/lib/customers";
import { RENEWAL_DELIVERY_LEAD_DAYS } from "@/lib/orders";
import { getStats, periods, type Env, type Period, type Series } from "@/lib/stats";
import { CHARGE_WINDOW_DAYS, getSubscriptionOverview, UPCOMING_DAYS, type SubscriptionOverview, type UpcomingShipment } from "@/lib/subscription-stats";
import { supabaseAdmin } from "@/lib/supabase";
import { StatusBadge } from "./_components/fields";
import { TrendChart } from "./_components/TrendChart";

type OrderRow = { id: string; order_number: string; created_at: string; email: string | null; shipping_name: string | null; total: number; status: string; kind: string };

const fmtCount = (v: number) => new Intl.NumberFormat("sv-SE").format(Math.round(v));
const fmtDay = (iso: string) => new Date(iso).toLocaleDateString("sv-SE", { day: "numeric", month: "short", timeZone: "Europe/Stockholm" });

function Tile({ label, value, note, tone }: { label: string; value: string; note: string; tone?: "danger" }) {
  return (
    <div className={`rounded-2xl border p-4 ${tone === "danger" ? "border-danger/40 bg-danger/5" : "border-line bg-white"}`}>
      <p className="text-xs text-muted">{label}</p>
      <p className={`mt-1 font-display text-2xl font-medium tabular-nums ${tone === "danger" ? "text-danger" : ""}`}>{value}</p>
      <p className="text-xs text-muted">{note}</p>
    </div>
  );
}

function PaymentBadge({ s }: { s: UpcomingShipment }) {
  if (s.state === "paid") return <span className="inline-flex rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-accent">Betald {fmtDay(s.chargeAt)}</span>;
  if (s.state === "failed") return <span className="inline-flex rounded-full bg-danger/10 px-2.5 py-0.5 text-xs font-semibold text-danger">Misslyckades {fmtDay(s.chargeAt)}</span>;
  return <span className="inline-flex rounded-full bg-sand px-2.5 py-0.5 text-xs font-semibold text-muted">Dras {fmtDay(s.chargeAt)}</span>;
}

function SubscriptionSection({ overview: o, env, productName }: { overview: SubscriptionOverview; env: Env; productName: (slug: string | null) => string }) {
  const paidCount = o.upcoming.filter((s) => s.state === "paid").length;
  return (
    <section className="space-y-4 rounded-2xl border border-line bg-white p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-lg font-medium">Prenumerationer{env === "sandbox" ? " (test)" : ""}</h2>
        <Link href="/admin/kunder" className="text-sm underline underline-offset-2">
          Alla kunder
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <Tile label="Aktiva prenumeranter" value={fmtCount(o.active)} note="dras och skickas som vanligt" />
        <Tile label="Återkommande värde" value={formatPrice(Math.round(o.recurring30))} note="per 30 dagar, inkl. moms" />
        <Tile label="Pausade" value={fmtCount(o.paused)} note="inga dragningar just nu" />
        <Tile label="Avslutas" value={fmtCount(o.ending)} note="sista perioden pågår" />
        <Tile label="Misslyckade dragningar" value={fmtCount(o.failed)} note={o.failed ? "Stripe försöker igen" : "allt betalt"} tone={o.failed ? "danger" : undefined} />
      </div>

      <div className={`rounded-xl px-4 py-3 text-sm ${o.missingRenewals.length ? "bg-danger/10 text-danger" : "bg-sand"}`}>
        <p>
          <strong className="font-semibold">{fmtCount(o.charges.count)} dragningar</strong> på {formatPrice(Math.round(o.charges.sum))} de senaste {CHARGE_WINDOW_DAYS} dagarna.
          {" "}En förnyelse blir en planerad order först när Stripe har bekräftat betalningen, så allt märkt <em>Betald</em> nedan är betalt innan det packas.
        </p>
        {o.missingRenewals.length ? (
          <ul className="mt-2 list-disc pl-5">
            {o.missingRenewals.map((m) => (
              <li key={m.stripeSubscriptionId}>
                {m.email ?? m.stripeSubscriptionId}: förnyad i Stripe {fmtDay(m.periodStart)} men ingen förnyelseorder här. Kontrollera fakturan i Stripe och webhooken.
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-xs text-muted">Avstämning: alla aktiva prenumerationer som förnyats har en betald förnyelseorder.</p>
        )}
      </div>

      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-medium">Kommande utskick</h3>
          <p className="text-xs text-muted">
            {o.upcoming.length} de närmaste {UPCOMING_DAYS} dagarna · {paidCount} redan betalda
          </p>
        </div>
        {o.upcoming.length === 0 ? (
          <p className="mt-2 text-sm text-muted">Inga utskick planerade de närmaste {UPCOMING_DAYS} dagarna.</p>
        ) : (
          <ul className="mt-2 divide-y divide-line text-sm">
            {o.upcoming.map((s) => {
              const who = s.name ?? s.email ?? "Okänd kund";
              const href = s.orderId ? `/admin/ordrar/${s.orderId}` : customerHref(s.email);
              return (
                <li key={s.key} className="grid grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-3 py-2.5">
                  <span className="tabular-nums font-medium">{fmtDay(s.deliverAt)}</span>
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
                      {productName(s.productSlug)} · {formatPrice(s.amount, s.currency)}
                    </span>
                  </span>
                  <PaymentBadge s={s} />
                </li>
              );
            })}
          </ul>
        )}
        <p className="mt-2 text-xs text-muted">Datumet är planerad leverans. Stripe drar pengarna vid periodens slut och leveransen planeras {RENEWAL_DELIVERY_LEAD_DAYS} dagar senare.</p>
      </div>
    </section>
  );
}

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
  const [latest, catalog, subs] = await Promise.all([
    db.from("orders").select("id,order_number,created_at,email,shipping_name,total,status,kind").eq("environment", env).order("created_at", { ascending: false }).limit(6),
    getCatalog(),
    getSubscriptionOverview(env),
  ]);
  const orders = (latest.data ?? []) as OrderRow[];
  const names = new Map<string, string>([...catalog.allProducts, ...catalog.allBundles].map((p) => [p.slug, p.name]));
  const productName = (slug: string | null) => (slug ? (names.get(slug) ?? slug) : "–");
  const lowStock = catalog.allProducts.filter((p) => p.isActive && p.trackStock && p.stock <= 10).sort((a, b) => a.stock - b.stock);
  const href = (p: Period, e: Env) => `/admin?period=${p}${e === "sandbox" ? "&env=test" : ""}`;
  const today = new Date().toLocaleDateString("sv-SE", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium">Översikt</h1>
          <p className="mt-1 text-sm text-muted">
            Så går butiken just nu – {today}.{stats.granularity === "hour" ? " Diagrammen visar timma för timma, svensk tid." : ""}
          </p>
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

      <SubscriptionSection overview={subs} env={env} productName={productName} />

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

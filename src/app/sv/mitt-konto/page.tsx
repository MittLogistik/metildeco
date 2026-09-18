import type { Metadata } from "next";
import Link from "next/link";
import { createSessionClient } from "@/lib/auth";
import { getCatalog } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { routes } from "@/lib/routes";
import { company, site } from "@/lib/site";
import { supabaseAdmin } from "@/lib/supabase";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container, SectionHeading } from "@/components/ui";
import { openBillingPortal, signOutCustomer } from "./actions";
import { LoginForm } from "./LoginForm";
import { SubscriptionActions } from "./SubscriptionActions";

export const metadata: Metadata = {
  title: "Mitt konto – prenumerationer och köp",
  description: "Se dina aktiva prenumerationer, kommande leveranser och tidigare köp. Pausa, ändra eller avsluta din prenumeration när du vill.",
  alternates: { canonical: `${site.url}${routes.account}` },
  robots: { index: false, follow: true },
};

const statusLabel: Record<string, string> = {
  scheduled: "Planerad leverans",
  paid: "Betald",
  packed: "Packas",
  shipped: "Skickad",
  delivered: "Levererad",
  cancelled: "Avbruten",
  refunded: "Återbetald",
};

const intervalLabel = (plan: string) => {
  const m = plan.match(/^sub:(\d+)/);
  return m ? `var ${m[1]}:e dag` : "prenumeration";
};

export default async function AccountPage({ searchParams }: PageProps<"/sv/mitt-konto">) {
  const sp = await searchParams;
  const client = await createSessionClient();
  const { data } = await client.auth.getUser();
  const email = data.user?.email?.toLowerCase() ?? null;

  if (!email) {
    return (
      <Container className="py-8 sm:py-12">
        <Breadcrumbs items={[{ label: "Mitt konto" }]} />
        <SectionHeading as="h1" eyebrow="Mitt konto" title="Dina prenumerationer och köp" intro="Logga in med e-postadressen du handlat med för att se ordrar, prenumerationer och leveranser." className="mt-6" />
        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <LoginForm />
          <aside className="rounded-card bg-sand-soft p-6 text-sm text-muted">
            <h2 className="font-display text-lg font-medium text-foreground">Vill du bara spåra ett paket?</h2>
            <p className="mt-1">Det går utan inloggning med ordernummer och e-post.</p>
            <Link href={routes.trackOrder} className="mt-3 inline-block font-medium text-foreground underline underline-offset-2">
              Spåra din order
            </Link>
          </aside>
        </div>
      </Container>
    );
  }

  const db = supabaseAdmin();
  const [subsRes, ordersRes, catalog] = await Promise.all([
    db.from("subscriptions").select("*").eq("email", email).order("created_at", { ascending: false }),
    db.from("orders").select("id,order_number,created_at,total,status,kind,tracking_url").eq("email", email).order("created_at", { ascending: false }).limit(50),
    getCatalog(),
  ]);
  const subs = subsRes.data ?? [];
  const orders = ordersRes.data ?? [];
  const subOrderItems = subs.length
    ? (await db.from("order_items").select("order_id,plan,product_slug").in("order_id", orders.filter((o) => o.kind === "checkout").map((o) => o.id))).data ?? []
    : [];
  const productName = (slug: string | null) => catalog.allProducts.find((p) => p.slug === slug)?.name ?? slug ?? "Prenumeration";
  const activeSubs = subs.filter((s) => s.status !== "canceled");

  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Mitt konto" }]} />
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <SectionHeading as="h1" eyebrow="Mitt konto" title="Dina prenumerationer och köp" intro={`Inloggad som ${email}.`} />
        <form action={signOutCustomer}>
          <button type="submit" className="rounded-full border border-line px-4 py-2 text-sm hover:bg-sand">
            Logga ut
          </button>
        </form>
      </div>

      {sp.portal === "saknas" ? <p className="mt-6 rounded-xl bg-sand-soft p-4 text-sm text-muted">Vi hittade ingen betalningsprofil att öppna ännu. Den skapas vid ditt första köp.</p> : null}

      <section className="mt-10">
        <h2 className="font-display text-2xl font-medium">Prenumerationer</h2>
        {activeSubs.length === 0 ? (
          <div className="mt-4 rounded-card border border-line p-6">
            <p className="font-medium">Inga aktiva prenumerationer</p>
            <p className="mt-1 text-sm text-muted">Prenumerera på en produkt och spara {site.subscriptionDiscount} % på varje leverans.</p>
            <Link href={routes.products} className="mt-3 inline-block text-sm font-medium underline underline-offset-2">
              Utforska sortimentet
            </Link>
          </div>
        ) : (
          <ul className="mt-4 space-y-4">
            {activeSubs.map((s) => {
              const paused = Boolean(s.paused_at);
              const cancelling = Boolean(s.cancel_at_period_end);
              const plan = subOrderItems.find((i) => i.product_slug === s.product_slug && String(i.plan).startsWith("sub"))?.plan ?? "sub";
              return (
                <li key={s.id} className="rounded-card border border-line p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">
                        {s.quantity > 1 ? `${s.quantity} × ` : ""}
                        {productName(s.product_slug)}
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        Levereras {intervalLabel(String(plan))} · {s.amount ? `${formatPrice(Number(s.amount))} per förpackning` : ""}
                      </p>
                      <p className="mt-2 text-sm">
                        {cancelling ? (
                          <span className="rounded-full bg-sand px-2.5 py-0.5 text-xs font-semibold">Avslutas {s.current_period_end ? new Date(s.current_period_end).toLocaleDateString("sv-SE") : "efter perioden"}</span>
                        ) : paused ? (
                          <span className="rounded-full bg-sand px-2.5 py-0.5 text-xs font-semibold">Pausad</span>
                        ) : (
                          <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-semibold text-primary">
                            Aktiv · nästa leverans {s.next_shipment_at ? new Date(s.next_shipment_at).toLocaleDateString("sv-SE") : "planeras"}
                          </span>
                        )}
                      </p>
                    </div>
                    <SubscriptionActions id={s.stripe_subscription_id} status={s.status} paused={paused} cancelling={cancelling} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <form action={openBillingPortal} className="mt-4">
          <button type="submit" className="text-sm font-medium underline underline-offset-2">
            Ändra betalsätt, adress eller se kvitton
          </button>
          <span className="ml-1 text-xs text-muted">(öppnas hos Stripe)</span>
        </form>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-medium">Tidigare köp</h2>
        {orders.length === 0 ? (
          <p className="mt-4 text-sm text-muted">Inga köp registrerade på den här e-postadressen ännu.</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-card border border-line">
            <table className="w-full text-sm">
              <thead className="bg-sand-soft text-left text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Datum</th>
                  <th className="px-4 py-3 text-right">Summa</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t border-line">
                    <td className="px-4 py-3 font-medium">{o.order_number}</td>
                    <td className="px-4 py-3 text-muted">{new Date(o.created_at).toLocaleDateString("sv-SE")}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatPrice(Number(o.total))}</td>
                    <td className="px-4 py-3">
                      {statusLabel[o.status] ?? o.status}
                      {o.tracking_url ? (
                        <a href={o.tracking_url} target="_blank" rel="noopener" className="ml-2 underline underline-offset-2">
                          Spåra
                        </a>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="mt-10 text-sm text-muted">
        Behöver du hjälp med något? Mejla{" "}
        <a href={`mailto:${company.email}`} className="underline">
          {company.email}
        </a>{" "}
        så svarar vi inom 1–2 arbetsdagar.
      </p>
    </Container>
  );
}

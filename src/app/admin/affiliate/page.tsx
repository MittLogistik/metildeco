import Link from "next/link";
import { getSettings } from "@/lib/affiliate";
import { requireAdmin } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { supabaseAdmin } from "@/lib/supabase";
import { ActionForm, SubmitButton } from "../_components/ActionForm";
import { Card, Checkbox, Field, Input } from "../_components/fields";
import { resendPostback, saveAffiliateSettings, syncCommissionsAction } from "./actions";

/** Provisionshämtningen går mot AddRevenue och kan ta en stund. */
export const maxDuration = 120;

type QueueRow = {
  id: string;
  order_number: string | null;
  status: string;
  attempts: number;
  next_attempt_at: string;
  sent_at: string | null;
  last_error: string | null;
  payload: { value?: number; currency?: string; market?: string; channelId?: string } | null;
  created_at: string;
};

type OrderRow = {
  id: string;
  order_number: string;
  created_at: string;
  total: number;
  currency: string;
  affiliate_click_ref: string | null;
  affiliate_commission: number | null;
  affiliate_commission_currency: string | null;
  affiliate_commission_sek: number | null;
  affiliate_brokerage_fee_sek: number | null;
  affiliate_commission_synced_at: string | null;
};

const statusLabel: Record<string, string> = { pending: "Väntar", retrying: "Försöker igen", sent: "Skickad", failed: "Misslyckad" };
const tone: Record<string, string> = {
  sent: "bg-success/10 text-success",
  failed: "bg-danger/10 text-danger",
  retrying: "bg-sand text-foreground",
  pending: "bg-sand text-muted",
};
const fmt = (iso: string | null) => (iso ? new Date(iso).toLocaleString("sv-SE", { dateStyle: "short", timeStyle: "short" }) : "–");

export default async function AffiliatePage() {
  await requireAdmin();
  const db = supabaseAdmin();
  const [settings, queueRes, ordersRes, clicksRes] = await Promise.all([
    getSettings(),
    db.from("postback_queue").select("id,order_number,status,attempts,next_attempt_at,sent_at,last_error,payload,created_at").order("created_at", { ascending: false }).limit(50),
    db
      .from("orders")
      .select("id,order_number,created_at,total,currency,affiliate_click_ref,affiliate_commission,affiliate_commission_currency,affiliate_commission_sek,affiliate_brokerage_fee_sek,affiliate_commission_synced_at")
      .not("affiliate_click_id", "is", null)
      .order("created_at", { ascending: false })
      .limit(50),
    db.from("visitor_tracking").select("id", { count: "exact", head: true }).gt("expires_at", new Date().toISOString()),
  ]);

  const queue = (queueRes.data ?? []) as QueueRow[];
  const orders = (ordersRes.data ?? []) as OrderRow[];
  const activeClicks = clicksRes.count ?? 0;
  const counts = queue.reduce<Record<string, number>>((acc, q) => ({ ...acc, [q.status]: (acc[q.status] ?? 0) + 1 }), {});
  const commissionSek = orders.reduce((s, o) => s + Number(o.affiliate_commission_sek ?? 0), 0);
  const feeSek = orders.reduce((s, o) => s + Number(o.affiliate_brokerage_fee_sek ?? 0), 0);
  const hasToken = Boolean(process.env.ADDREVENUE_API_TOKEN);
  const vatText = Object.entries(settings.vatRates)
    .map(([k, v]) => `${k}=${v}`)
    .join(", ");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-medium">Affiliate</h1>
        <p className="mt-1 text-sm text-muted">
          AddRevenue. Klick sparas i {settings.attributionDays} dagar och knyts till ordern i kassan. När ordern är betald köas en konvertering som
          skickas av jobbet var tionde minut. All kommunikation sker från servern.
        </p>
      </div>

      {!settings.enabled ? (
        <Card title="Avstängd">
          <p className="text-sm text-muted">Inga klick sparas och inga konverteringar köas medan integrationen är avstängd.</p>
        </Card>
      ) : null}
      {!hasToken ? (
        <Card title="Token saknas">
          <p className="text-sm text-muted">
            Konverteringar skickas ändå – trackern kräver ingen token. Men provisionen kan inte hämtas förrän ADDREVENUE_API_TOKEN finns i miljön.
          </p>
        </Card>
      ) : null}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-xs text-muted">Aktiva klick</p>
          <p className="mt-1 font-display text-2xl font-medium tabular-nums">{activeClicks}</p>
          <p className="text-xs text-muted">inom attributionsfönstret</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-xs text-muted">I kön</p>
          <p className="mt-1 font-display text-2xl font-medium tabular-nums">{(counts.pending ?? 0) + (counts.retrying ?? 0)}</p>
          <p className="text-xs text-muted">{counts.failed ? `${counts.failed} misslyckade` : "inga misslyckade"}</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-xs text-muted">Provision</p>
          <p className="mt-1 font-display text-2xl font-medium tabular-nums">{formatPrice(Math.round(commissionSek))}</p>
          <p className="text-xs text-muted">senaste 50 ordrarna</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-xs text-muted">Förmedlingsavgift</p>
          <p className="mt-1 font-display text-2xl font-medium tabular-nums">{formatPrice(Math.round(feeSek))}</p>
          <p className="text-xs text-muted">omräknat till SEK</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <Card title={`Konverteringar (${queue.length})`}>
            {queue.length === 0 ? (
              <p className="text-sm text-muted">Inga konverteringar ännu. De köas när en order med affiliateklick blir betald.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-xs uppercase tracking-wider text-muted">
                    <tr>
                      <th className="py-2 pr-3">Order</th>
                      <th className="py-2 pr-3">Värde</th>
                      <th className="py-2 pr-3">Kanal</th>
                      <th className="py-2 pr-3">Status</th>
                      <th className="py-2 pr-3">Nästa försök</th>
                      <th className="py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {queue.map((q) => (
                      <tr key={q.id} className="border-t border-line align-top">
                        <td className="py-2 pr-3 whitespace-nowrap font-medium">{q.order_number ?? "–"}</td>
                        <td className="py-2 pr-3 whitespace-nowrap tabular-nums">
                          {q.payload?.value != null ? `${q.payload.value} ${q.payload.currency ?? ""}` : "–"}
                          <span className="block text-xs text-muted">{q.payload?.market}</span>
                        </td>
                        <td className="py-2 pr-3 text-xs text-muted">{q.payload?.channelId ?? "–"}</td>
                        <td className="py-2 pr-3">
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${tone[q.status] ?? "bg-sand text-muted"}`}>{statusLabel[q.status] ?? q.status}</span>
                          {q.attempts > 0 ? <span className="block text-xs text-muted">{q.attempts} försök</span> : null}
                          {q.last_error ? <span className="mt-0.5 block max-w-xs truncate text-xs text-danger" title={q.last_error}>{q.last_error}</span> : null}
                        </td>
                        <td className="py-2 pr-3 whitespace-nowrap text-xs text-muted">{q.status === "sent" ? fmt(q.sent_at) : fmt(q.next_attempt_at)}</td>
                        <td className="py-2">
                          {q.status === "sent" ? null : (
                            <ActionForm action={resendPostback} inline>
                              <input type="hidden" name="id" value={q.id} />
                              <SubmitButton variant="outline" pendingLabel="Skickar …">
                                Skicka nu
                              </SubmitButton>
                            </ActionForm>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <Card title={`Ordrar med affiliateklick (${orders.length})`}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-xs text-muted">Provisionen hämtas automatiskt var tionde minut.</p>
              <ActionForm action={syncCommissionsAction} inline>
                <SubmitButton variant="outline" pendingLabel="Hämtar …">
                  Hämta provision nu
                </SubmitButton>
              </ActionForm>
            </div>
            {orders.length === 0 ? (
              <p className="text-sm text-muted">Inga ordrar har kommit via affiliate ännu.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-xs uppercase tracking-wider text-muted">
                    <tr>
                      <th className="py-2 pr-3">Order</th>
                      <th className="py-2 pr-3">Datum</th>
                      <th className="py-2 pr-3">Kanal</th>
                      <th className="py-2 pr-3 text-right">Summa</th>
                      <th className="py-2 pr-3 text-right">Provision</th>
                      <th className="py-2 text-right">I SEK</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id} className="border-t border-line">
                        <td className="py-2 pr-3 whitespace-nowrap">
                          <Link href={`/admin/ordrar/${o.id}`} className="font-medium hover:underline">
                            {o.order_number}
                          </Link>
                        </td>
                        <td className="py-2 pr-3 whitespace-nowrap text-xs text-muted">{fmt(o.created_at)}</td>
                        <td className="py-2 pr-3 text-xs text-muted">{o.affiliate_click_ref ?? "–"}</td>
                        <td className="py-2 pr-3 text-right tabular-nums">
                          {Number(o.total)} {o.currency}
                        </td>
                        <td className="py-2 pr-3 text-right tabular-nums">
                          {o.affiliate_commission != null ? `${o.affiliate_commission} ${o.affiliate_commission_currency ?? ""}` : <span className="text-muted">väntar</span>}
                        </td>
                        <td className="py-2 text-right tabular-nums">{o.affiliate_commission_sek != null ? formatPrice(Number(o.affiliate_commission_sek)) : "–"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        <Card title="Inställningar">
          <ActionForm action={saveAffiliateSettings} className="space-y-4">
            <Checkbox name="enabled" label="Integrationen är på" defaultChecked={settings.enabled} hint="Avstängd sparas inga klick och inga konverteringar köas." />
            <Field label="Annonsör-ID">
              <Input name="advertiserId" defaultValue={settings.advertiserId} required />
            </Field>
            <Field label="Attributionsdagar" hint="Hur länge ett klick räknas.">
              <Input name="attributionDays" defaultValue={settings.attributionDays} type="number" />
            </Field>
            <Field label="Tracker (konvertering)" hint="Tar emot köpet. Skickas utan token.">
              <Input name="endpointUrl" defaultValue={settings.endpointUrl} type="url" required />
            </Field>
            <Field label="API (provision)" hint="Kräver ADDREVENUE_API_TOKEN i miljön.">
              <Input name="apiBaseUrl" defaultValue={settings.apiBaseUrl} type="url" required />
            </Field>
            <Field label="Momssatser" hint="Andel per leveransland, t.ex. SE=0.12, DE=0.19. default används för övriga länder.">
              <Input name="vatRates" defaultValue={vatText} />
            </Field>
            <SubmitButton>Spara</SubmitButton>
          </ActionForm>
          <p className="mt-4 text-xs text-muted">
            Provisionsgrundande värde = varornas summa efter rabatt delat med moms, frakt exkluderad. Beloppet skickas alltid i ordervalutan och räknas
            aldrig om innan det lämnar oss.
          </p>
        </Card>
      </div>
    </div>
  );
}

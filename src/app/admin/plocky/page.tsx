import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { plockyConfig, plockyInboundKey, plockyShopBaseUrl, productsWithoutSku } from "@/lib/plocky";
import { supabaseAdmin } from "@/lib/supabase";
import { ActionForm, SubmitButton } from "../_components/ActionForm";
import { Card } from "../_components/fields";
import { resendToPlocky, runPlockyQueue, testPlocky } from "./actions";

type QueueRow = {
  id: string;
  order_id: string;
  order_number: string | null;
  status: string;
  attempts: number;
  next_attempt_at: string;
  sent_at: string | null;
  last_error: string | null;
  warning: string | null;
  wms_order_id: string | null;
  created_at: string;
};
type EventRow = { id: string; event: string; order_number: string | null; ok: boolean; message: string | null; created_at: string };

const statusLabel: Record<string, string> = { pending: "Väntar", retrying: "Försöker igen", sent: "Skickad", failed: "Misslyckad" };
const tone: Record<string, string> = {
  sent: "bg-success/10 text-success",
  failed: "bg-danger/10 text-danger",
  retrying: "bg-sand text-foreground",
  pending: "bg-sand text-muted",
};
const eventLabel: Record<string, string> = { ping: "Test", "stock.update": "Lagersaldo", "shipment.created": "Skickad" };
const fmt = (iso: string | null) => (iso ? new Date(iso).toLocaleString("sv-SE", { dateStyle: "short", timeStyle: "short" }) : "–");

export default async function PlockyPage() {
  await requireAdmin();
  const db = supabaseAdmin();
  const cfg = plockyConfig();
  const inboundKey = plockyInboundKey();
  const [queueRes, eventsRes, missing, unsentRes] = await Promise.all([
    db.from("wms_queue").select("id,order_id,order_number,status,attempts,next_attempt_at,sent_at,last_error,warning,wms_order_id,created_at").order("created_at", { ascending: false }).limit(50),
    db.from("wms_events").select("id,event,order_number,ok,message,created_at").order("created_at", { ascending: false }).limit(30),
    productsWithoutSku(),
    // Betalda ordrar som inte ligger i kön alls (lagda innan kopplingen fanns)
    db.from("orders").select("id,order_number,created_at,status").eq("status", "paid").is("wms_sent_at", null).neq("kind", "giftcard").order("created_at", { ascending: false }).limit(50),
  ]);
  const queue = (queueRes.data ?? []) as QueueRow[];
  const events = (eventsRes.data ?? []) as EventRow[];
  const queuedIds = new Set(queue.map((q) => q.order_id));
  const unsent = ((unsentRes.data ?? []) as { id: string; order_number: string; created_at: string }[]).filter((o) => !queuedIds.has(o.id));
  const pending = queue.filter((q) => q.status === "pending" || q.status === "retrying").length;
  const failed = queue.filter((q) => q.status === "failed").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-medium">Plocky (lager)</h1>
        <p className="mt-1 text-sm text-muted">
          Betalda ordrar skickas till Plocky för plock och frakt. Plocky skickar tillbaka lagersaldo och leveransbesked; kunden får då spårningsmejl och ordern blir Skickad.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-xs text-muted">Koppling</p>
          <p className="mt-1 font-display text-2xl font-medium">{cfg ? "På" : "Av"}</p>
          <p className="text-xs text-muted">{cfg ? new URL(cfg.url).host : "PLOCKY_URL saknas"}</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-xs text-muted">Inkommande nyckel</p>
          <p className="mt-1 font-display text-2xl font-medium">{inboundKey ? "Satt" : "Saknas"}</p>
          <p className="text-xs text-muted">PLOCKY_INBOUND_KEY</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-xs text-muted">I kö</p>
          <p className="mt-1 font-display text-2xl font-medium tabular-nums">{pending}</p>
          <p className="text-xs text-muted">skickas av cron var 10:e minut</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-xs text-muted">Misslyckade</p>
          <p className={`mt-1 font-display text-2xl font-medium tabular-nums ${failed ? "text-danger" : ""}`}>{failed}</p>
          <p className="text-xs text-muted">kräver åtgärd</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          {unsent.length ? (
            <Card title={`Betalda ordrar som inte skickats till Plocky (${unsent.length})`}>
              <p className="mb-3 text-sm text-muted">Ordrar som betalades innan kopplingen fanns, eller som aldrig kom in i kön. Skicka dem bara om de inte redan är packade på annat sätt.</p>
              <ul className="divide-y divide-line text-sm">
                {unsent.map((o) => (
                  <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                    <span>
                      <Link href={`/admin/ordrar/${o.id}`} className="font-medium hover:underline">
                        {o.order_number}
                      </Link>
                      <span className="ml-2 text-muted">{fmt(o.created_at)}</span>
                    </span>
                    <ActionForm action={resendToPlocky} inline>
                      <input type="hidden" name="order_id" value={o.id} />
                      <SubmitButton variant="outline">Skicka till Plocky</SubmitButton>
                    </ActionForm>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}

          <Card title="Orderkö">
            {queue.length === 0 ? (
              <p className="text-sm text-muted">Inga ordrar har skickats ännu. Nästa betalda order hamnar här.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-xs uppercase tracking-wider text-muted">
                    <tr>
                      <th className="py-2 pr-3">Order</th>
                      <th className="py-2 pr-3">Status</th>
                      <th className="py-2 pr-3">Plocky-nr</th>
                      <th className="py-2 pr-3">Försök</th>
                      <th className="py-2 pr-3">Senast</th>
                      <th className="py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {queue.map((q) => (
                      <tr key={q.id} className="border-t border-line align-top">
                        <td className="py-2 pr-3 whitespace-nowrap">
                          <Link href={`/admin/ordrar/${q.order_id}`} className="font-medium hover:underline">
                            {q.order_number ?? q.order_id.slice(0, 8)}
                          </Link>
                        </td>
                        <td className="py-2 pr-3">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${tone[q.status] ?? "bg-sand"}`}>{statusLabel[q.status] ?? q.status}</span>
                          {q.last_error ? <p className="mt-1 max-w-xs text-xs text-danger">{q.last_error}</p> : null}
                          {q.warning ? <p className="mt-1 max-w-xs text-xs text-muted">{q.warning}</p> : null}
                        </td>
                        <td className="py-2 pr-3 whitespace-nowrap tabular-nums">{q.wms_order_id ?? "–"}</td>
                        <td className="py-2 pr-3 tabular-nums">{q.attempts}</td>
                        <td className="py-2 pr-3 whitespace-nowrap text-muted">{fmt(q.sent_at ?? (q.status === "retrying" ? q.next_attempt_at : q.created_at))}</td>
                        <td className="py-2 text-right">
                          {q.status !== "sent" ? (
                            <ActionForm action={resendToPlocky} inline>
                              <input type="hidden" name="order_id" value={q.order_id} />
                              <SubmitButton variant="outline">Skicka igen</SubmitButton>
                            </ActionForm>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <Card title="Från Plocky">
            {events.length === 0 ? (
              <p className="text-sm text-muted">Inget har kommit in ännu. Tryck på Testa på Plockys kort så dyker ett ping upp här.</p>
            ) : (
              <ul className="divide-y divide-line text-sm">
                {events.map((e) => (
                  <li key={e.id} className="flex flex-wrap items-start justify-between gap-2 py-2">
                    <span>
                      <span className={`mr-2 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${e.ok ? "bg-sand text-foreground" : "bg-danger/10 text-danger"}`}>{eventLabel[e.event] ?? e.event}</span>
                      {e.message}
                    </span>
                    <span className="whitespace-nowrap text-xs text-muted">{fmt(e.created_at)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Testa och kör">
            <div className="flex flex-wrap gap-2">
              <ActionForm action={testPlocky} inline>
                <SubmitButton variant="outline">Testa kopplingen</SubmitButton>
              </ActionForm>
              <ActionForm action={runPlockyQueue} inline>
                <SubmitButton variant="outline">Kör kön nu</SubmitButton>
              </ActionForm>
            </div>
            <p className="mt-3 text-xs text-muted">Testet anropar Plockys orderadress med vår nyckel. Plockys eget test (knappen på kortet) syns under Från Plocky.</p>
          </Card>

          <Card title="Så kopplas butiken i Plocky">
            <ol className="list-decimal space-y-2 pl-5 text-sm">
              <li>
                Öppna kunden <strong>Swedish Treats AB</strong> i Plocky (skapa kunden om den saknas) → kortet <strong>Webshop-API</strong> → lägg till butiken <strong>Metilde</strong>.
              </li>
              <li>
                Bas-URL på kortet: <code className="rounded bg-sand px-1 text-xs select-all">{plockyShopBaseUrl()}</code>
              </li>
              <li>
                Butikens nyckel på kortet = värdet i <code className="rounded bg-sand px-1 text-xs">PLOCKY_INBOUND_KEY</code> här (Vercel → Environment Variables).
              </li>
              <li>
                Kopiera kortets <strong>URL</strong> till <code className="rounded bg-sand px-1 text-xs">PLOCKY_URL</code> och kortets <strong>nyckel (mlw_…)</strong> till <code className="rounded bg-sand px-1 text-xs">PLOCKY_API_KEY</code>. Nyckeln visas bara en gång.
              </li>
              <li>Tryck Synka artiklar på kortet, slå på lagersynk, och mappa fraktsätten (”Fri frakt – spårbart brev” m.fl.) mot fraktmallar.</li>
              <li>Låt ”Frakt bokas i annat system” vara av om Plocky ska boka frakten. Då kommer leveransbeskeden hit.</li>
            </ol>
          </Card>

          <Card title="Artikelnummer">
            {missing.length === 0 ? (
              <p className="text-sm text-success">Alla aktiva produkter har artikelnummer.</p>
            ) : (
              <>
                <p className="text-sm text-danger">{missing.length} aktiva produkter saknar artikelnummer. De matchar inte i Plocky och ordern hamnar på paus där.</p>
                <ul className="mt-2 space-y-1 text-sm">
                  {missing.map((p) => (
                    <li key={p.slug}>
                      <Link href={`/admin/produkter/${p.slug}`} className="underline underline-offset-2">
                        {p.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <p className="mt-3 text-xs text-muted">Artikelnumret (t.ex. MET-TKA-001) måste vara exakt samma i Plocky som här. Plocky är master för saldot: siffran här skrivs över när Plocky skickar.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

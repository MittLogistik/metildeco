import Link from "next/link";
import { DISCOUNT_FROM_STEP, findDiscount, REMINDER_COUNT, REMINDER_HOURS, type AbandonedCart } from "@/lib/abandoned";
import { requireAdmin } from "@/lib/auth";
import { customerHref } from "@/lib/customers";
import { emailConfigured } from "@/lib/email";
import { formatPrice } from "@/lib/format";
import { supabaseAdmin } from "@/lib/supabase";
import { ActionForm, SubmitButton } from "../_components/ActionForm";
import { Card } from "../_components/fields";
import { ensureDiscountAction, sendReminderAction, stopRemindersAction, testDiscountAction } from "./actions";

/** Rabattkodstestet skapar en session hos Stripe. */
export const maxDuration = 60;

const statusLabel: Record<string, string> = {
  open: "Påminnelser pågår",
  recovered: "Köpte",
  handled: "Stoppad",
  unsubscribed: "Avregistrerad",
  superseded: "Ersatt av nyare korg",
  dismissed: "Avfärdad",
  converted: "Köpte",
};
const tone: Record<string, string> = {
  open: "bg-sand text-foreground",
  recovered: "bg-success/10 text-success",
  converted: "bg-success/10 text-success",
  handled: "bg-sand text-muted",
  unsubscribed: "bg-danger/10 text-danger",
  superseded: "bg-sand text-muted",
  dismissed: "bg-sand text-muted",
};
const fmt = (iso: string | null | undefined) => (iso ? new Date(iso).toLocaleString("sv-SE", { dateStyle: "short", timeStyle: "short" }) : "–");
const hoursLabel = (h: number) => (h < 24 ? `${h} h` : `${Math.round(h / 24)} d`);

export default async function AbandonedCartsPage({ searchParams }: PageProps<"/admin/korgar">) {
  await requireAdmin();
  const sp = await searchParams;
  const status = typeof sp.status === "string" ? sp.status : "alla";
  const db = supabaseAdmin();
  let q = db.from("abandoned_carts").select("*").order("created_at", { ascending: false }).limit(300);
  if (status !== "alla") q = q.eq("status", status);
  const [{ data }, discount, optoutsRes] = await Promise.all([q, findDiscount().catch(() => null), db.from("email_optouts").select("email", { count: "exact", head: true })]);
  const carts = (data ?? []) as AbandonedCart[];
  const emails = Array.from(new Set(carts.map((c) => c.email)));
  const counts = { open: carts.filter((c) => c.status === "open").length, recovered: carts.filter((c) => c.status === "recovered" || c.status === "converted").length };
  const sentAt = (c: AbandonedCart, step: number) => (c as unknown as Record<string, string | null>)[`reminder_${step}_sent_at`] ?? null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium">Övergivna korgar</h1>
          <p className="mt-1 text-sm text-muted">
            Kunder som skrivit sin e-post i kassan och lämnat utan att betala. Fyra påminnelser skickas automatiskt: {REMINDER_HOURS.map(hoursLabel).join(", ")} efter att korgen lämnades. Serien stoppas
            vid köp, avregistrering eller när du stoppar den. Från påminnelse {DISCOUNT_FROM_STEP} följer rabattkoden med.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <nav className="inline-flex rounded-full border border-line bg-white p-1">
            {[
              ["alla", "Alla"],
              ["open", "Pågår"],
              ["recovered", "Köpte"],
              ["handled", "Stoppade"],
              ["unsubscribed", "Avregistrerade"],
            ].map(([id, label]) => (
              <Link key={id} href={`/admin/korgar?status=${id}`} className={`rounded-full px-3 py-1.5 text-sm ${status === id ? "bg-foreground text-white" : "text-muted hover:text-foreground"}`}>
                {label}
              </Link>
            ))}
          </nav>
          {emails.length ? (
            <a href={`/admin/korgar/export?status=${status}`} className="rounded-full border border-line bg-white px-4 py-2 text-sm hover:bg-sand">
              Exportera CSV ({emails.length})
            </a>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-line bg-white p-4">
            <p className="text-xs text-muted">Visade korgar</p>
            <p className="mt-1 font-display text-2xl font-medium tabular-nums">{carts.length}</p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-4">
            <p className="text-xs text-muted">Påminnelser pågår</p>
            <p className="mt-1 font-display text-2xl font-medium tabular-nums">{counts.open}</p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-4">
            <p className="text-xs text-muted">Köpte efteråt</p>
            <p className="mt-1 font-display text-2xl font-medium tabular-nums">{counts.recovered}</p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-4">
            <p className="text-xs text-muted">Avregistrerade adresser</p>
            <p className="mt-1 font-display text-2xl font-medium tabular-nums">{optoutsRes.count ?? 0}</p>
          </div>
        </div>

        <Card title="Rabattkod och utskick">
          {!emailConfigured() ? <p className="mb-3 text-sm text-danger">RESEND_API_KEY saknas: mejlen loggas bara, inget skickas.</p> : null}
          <p className="text-sm">
            Kod <strong className="font-mono">{discount?.code ?? "–"}</strong> · {discount?.percent ?? "–"} % på hela ordern ·{" "}
            {discount ? (discount.active ? <span className="text-success">aktiv i Stripe, använd {discount.timesRedeemed} gånger</span> : discount.exists ? <span className="text-danger">finns men är inaktiv</span> : <span className="text-danger">finns inte i Stripe ännu</span>) : <span className="text-muted">kunde inte läsas från Stripe</span>}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {!discount?.active ? (
              <ActionForm action={ensureDiscountAction} inline>
                <SubmitButton>Skapa koden i Stripe</SubmitButton>
              </ActionForm>
            ) : null}
            <ActionForm action={testDiscountAction} inline>
              <SubmitButton variant="outline" pendingLabel="Provar …">Testa koden</SubmitButton>
            </ActionForm>
          </div>
          <p className="mt-3 text-xs text-muted">Testet skapar en betalsession hos Stripe med koden, läser av avdraget och stänger sessionen. Ingen betalning sker. Koden byts med ABANDONED_DISCOUNT_CODE och procenten med ABANDONED_DISCOUNT_PERCENT i miljön.</p>
        </Card>
      </div>

      <section className="rounded-2xl border border-line bg-white">
        {carts.length === 0 ? (
          <p className="p-5 text-sm text-muted">Inga korgar med den här statusen. Korgar sparas när en kund skriver sin e-post i kassan och trycker Till betalning.</p>
        ) : (
          <ul className="divide-y divide-line">
            {carts.map((c) => {
              const customer = customerHref(c.email);
              return (
                <li key={c.id} className="grid gap-3 p-5 lg:grid-cols-[minmax(0,1fr)_260px_auto]">
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2">
                      {customer ? (
                        <Link href={customer} className="font-medium hover:underline">
                          {c.email}
                        </Link>
                      ) : (
                        <span className="font-medium">{c.email}</span>
                      )}
                      {c.first_name ? <span className="text-muted">({c.first_name})</span> : null}
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${tone[c.status] ?? "bg-sand"}`}>{statusLabel[c.status] ?? c.status}</span>
                      {c.source === "giftcard" ? <span className="text-xs text-muted">presentkort</span> : null}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      Lämnade kassan {fmt(c.created_at)} · {formatPrice(Number(c.subtotal))}
                      {c.recovered_at ? ` · köpte ${fmt(c.recovered_at)}` : ""}
                    </p>
                    <p className="mt-1 text-sm">{(c.items ?? []).map((i) => `${i.qty} × ${i.name}`).join(", ")}</p>
                    {c.last_error ? <p className="mt-1 text-xs text-danger">Senaste fel: {c.last_error}</p> : null}
                  </div>
                  <div className="text-xs">
                    <p className="mb-1 font-medium">Mejl</p>
                    <ol className="space-y-0.5">
                      {Array.from({ length: REMINDER_COUNT }, (_, i) => i + 1).map((step) => {
                        const at = sentAt(c, step);
                        const isNext = !at && c.status === "open" && c.reminders_sent + 1 === step;
                        return (
                          <li key={step} className={at ? "text-success" : isNext ? "text-foreground" : "text-muted"}>
                            {step}. {hoursLabel(REMINDER_HOURS[step - 1]!)}
                            {step >= DISCOUNT_FROM_STEP ? " + kod" : ""}: {at ? `skickat ${fmt(at)}` : isNext ? `planerat ${fmt(c.next_reminder_at)}` : "–"}
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                  <div className="flex flex-wrap items-start gap-2 lg:flex-col lg:items-end">
                    {c.recovery_url ? (
                      <a href={c.recovery_url} target="_blank" rel="noopener" className="rounded-full border border-line px-3 py-1.5 text-xs hover:bg-sand">
                        Öppna korgen
                      </a>
                    ) : null}
                    {c.status === "open" && c.reminders_sent < REMINDER_COUNT ? (
                      <ActionForm action={sendReminderAction} inline confirm={`Skicka påminnelse ${c.reminders_sent + 1} till ${c.email} nu?`}>
                        <input type="hidden" name="id" value={c.id} />
                        <button type="submit" className="rounded-full border border-line px-3 py-1.5 text-xs hover:bg-sand">
                          Skicka nästa nu
                        </button>
                      </ActionForm>
                    ) : null}
                    {c.status === "open" ? (
                      <ActionForm action={stopRemindersAction} inline>
                        <input type="hidden" name="id" value={c.id} />
                        <button type="submit" className="rounded-full border border-line px-3 py-1.5 text-xs hover:bg-sand">
                          Stoppa utskick
                        </button>
                      </ActionForm>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

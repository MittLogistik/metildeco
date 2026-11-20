import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { customerHref } from "@/lib/customers";
import { site } from "@/lib/site";
import { getAgent, listSupportLog, MATILDA_ID } from "@/lib/support-agent";
import { ActionForm, SubmitButton } from "../_components/ActionForm";
import { Card, Checkbox } from "../_components/fields";
import { createMatildaKey, revokeMatildaKey, saveMatildaSettings } from "./actions";

export const metadata = { title: "Kundtjänst" };

const fmt = (iso: string | null) => (iso ? new Date(iso).toLocaleString("sv-SE", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Stockholm" }) : "–");

const actionLabel: Record<string, string> = {
  lookup: "Slog upp kund",
  "subscription.pause": "Pausade prenumeration",
  "subscription.resume": "Återupptog prenumeration",
  "subscription.cancel_period_end": "Avslutade prenumeration (periodens slut)",
  "subscription.cancel_now": "Avslutade prenumeration direkt",
  "email.sent": "Skickade mejl",
  escalate: "Eskalerade",
  "agent.key_created": "Ny API-nyckel",
  "agent.key_revoked": "Spärrade nyckeln",
  "agent.settings": "Ändrade inställningar",
};

const filters = [
  { key: "andringar", label: "Ändringar" },
  { key: "matilda", label: "Allt Matilda gjort" },
  { key: "alla", label: "Alla" },
];

/** Matildas inlogg, behörigheter och logg över allt kundtjänsten gjort. */
export default async function SupportPage({ searchParams }: PageProps<"/admin/kundtjanst">) {
  await requireAdmin();
  const sp = await searchParams;
  const filter = typeof sp.visa === "string" && filters.some((f) => f.key === sp.visa) ? sp.visa : "andringar";
  const customer = typeof sp.kund === "string" ? sp.kund : undefined;
  const [agent, raw] = await Promise.all([getAgent(MATILDA_ID), listSupportLog({ actor: filter === "matilda" ? MATILDA_ID : undefined, customer, limit: 300 })]);
  const log = filter === "andringar" ? raw.filter((e) => e.action !== "lookup") : raw;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-medium">Kundtjänst · Matilda</h1>
        <p className="mt-1 text-sm text-muted">Grok-boten som svarar på mejl och hanterar prenumerationer. Allt hon gör loggas här, liksom prenumerationsändringar som görs i admin.</p>
      </div>

      {!agent ? (
        <Card>
          <p className="text-sm text-danger">Tabellen support_agents saknas. Kör migrationen 20261120120000_support_agent.sql (npm run migrate).</p>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Inlogg">
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Status</dt>
                <dd className={agent.enabled && agent.key_prefix ? "text-success" : "text-danger"}>{!agent.key_prefix ? "Inget inlogg" : agent.enabled ? "På" : "Avstängd"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">API-nyckel</dt>
                <dd className="font-mono">{agent.key_prefix ? `${agent.key_prefix}…` : "–"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Senast aktiv</dt>
                <dd>{fmt(agent.last_used_at)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Verktyg (OpenAPI)</dt>
                <dd className="truncate font-mono text-xs">
                  <a href="/api/matilda/openapi.json" className="hover:underline">{`${site.url}/api/matilda/openapi.json`}</a>
                </dd>
              </div>
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
              <ActionForm action={createMatildaKey} confirm={agent.key_prefix ? "Skapa ny nyckel? Den gamla slutar gälla direkt och måste bytas i Grok." : undefined}>
                <SubmitButton>{agent.key_prefix ? "Byt nyckel" : "Skapa inlogg"}</SubmitButton>
              </ActionForm>
              {agent.key_prefix ? (
                <ActionForm action={revokeMatildaKey} confirm="Spärra Matildas nyckel? Hon kommer inte åt något förrän en ny skapas.">
                  <SubmitButton variant="danger">Spärra</SubmitButton>
                </ActionForm>
              ) : null}
            </div>
            <p className="mt-3 text-xs text-muted">Nyckeln läggs in i Grok som Bearer-token. Bara hashen sparas, så tappas nyckeln bort skapar du en ny.</p>
          </Card>

          <Card title="Behörigheter">
            <ActionForm action={saveMatildaSettings} className="space-y-3">
              <Checkbox name="enabled" label="Matilda är på" defaultChecked={agent.enabled} hint="Av = alla anrop nekas, hon ska då eskalera allt." />
              <Checkbox name="allow_subscriptions" label="Får pausa, återuppta och avsluta prenumerationer" defaultChecked={agent.allow_subscriptions} hint="Avsluta gäller alltid vid periodens slut. Avsluta direkt och återbetalning kan hon aldrig göra." />
              <Checkbox name="allow_email" label="Får skicka mejl till kunder" defaultChecked={agent.allow_email} hint="Högst 4 mejl per kund och timme." />
              <SubmitButton>Spara</SubmitButton>
            </ActionForm>
          </Card>
        </div>
      )}

      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-medium">Logg{customer ? ` · ${customer}` : ""}</h2>
          <div className="flex flex-wrap gap-1.5 text-sm">
            {filters.map((f) => (
              <Link key={f.key} href={`/admin/kundtjanst?visa=${f.key}${customer ? `&kund=${encodeURIComponent(customer)}` : ""}`} className={`rounded-full px-3 py-1 ${filter === f.key ? "bg-primary-soft font-medium text-primary" : "text-muted hover:bg-sand"}`}>
                {f.label}
              </Link>
            ))}
            {customer ? (
              <Link href={`/admin/kundtjanst?visa=${filter}`} className="rounded-full px-3 py-1 text-muted hover:bg-sand">
                Alla kunder ×
              </Link>
            ) : null}
          </div>
        </div>
        {log.length === 0 ? (
          <p className="text-sm text-muted">Inget loggat ännu.</p>
        ) : (
          <ul className="divide-y divide-line">
            {log.map((e) => {
              const text = typeof e.details?.text === "string" ? e.details.text : null;
              const reason = typeof e.details?.reason === "string" ? e.details.reason : null;
              const href = customerHref(e.customer_email);
              return (
                <li key={e.id} className="py-3 text-sm">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="tabular-nums text-xs text-muted">{fmt(e.created_at)}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${e.actor === MATILDA_ID ? "bg-accent-soft text-accent" : "bg-sand text-foreground"}`}>{e.actor === MATILDA_ID ? "Matilda" : e.actor}</span>
                    <span className={`font-medium ${e.ok ? "" : "text-danger"}`}>
                      {actionLabel[e.action] ?? e.action}
                      {e.ok ? "" : " (misslyckades)"}
                    </span>
                    {e.customer_email ? (
                      <span className="text-muted">
                        {href ? (
                          <Link href={href} className="hover:underline">
                            {e.customer_email}
                          </Link>
                        ) : (
                          e.customer_email
                        )}{" "}
                        <Link href={`/admin/kundtjanst?visa=alla&kund=${encodeURIComponent(e.customer_email)}`} className="text-xs hover:underline">
                          (historik)
                        </Link>
                      </span>
                    ) : null}
                  </div>
                  {e.action === "email.sent" && e.target ? <p className="mt-1 font-medium">{e.target}</p> : null}
                  {e.action !== "email.sent" && e.summary ? <p className="mt-1 text-muted">{e.summary}</p> : null}
                  {reason ? <p className="mt-1 text-xs text-muted">Kundens begäran: {reason}</p> : null}
                  {e.target?.startsWith("sub_") ? <p className="mt-1 font-mono text-xs text-muted">{e.target}</p> : null}
                  {text ? (
                    <details className="mt-1">
                      <summary className="cursor-pointer text-xs text-muted">Visa mejlet</summary>
                      <pre className="mt-2 whitespace-pre-wrap rounded-xl bg-sand-soft p-3 font-sans text-sm">{text}</pre>
                    </details>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}

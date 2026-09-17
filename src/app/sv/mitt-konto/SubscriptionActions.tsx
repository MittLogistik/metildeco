"use client";

import { useActionState } from "react";
import { cancelSubscription, pauseSubscription, resumeSubscription, type AccountResult } from "./actions";

type Action = (fd: FormData) => Promise<AccountResult>;

function ActionButton({ action, id, label, confirm, tone = "outline" }: { action: Action; id: string; label: string; confirm?: string; tone?: "outline" | "danger" }) {
  const [state, formAction, pending] = useActionState(async (_p: AccountResult | null, fd: FormData) => action(fd), null);
  const cls = tone === "danger" ? "border-danger/30 text-danger hover:bg-danger/5" : "border-line hover:bg-sand";
  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
      className="inline"
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" disabled={pending} className={`rounded-full border px-4 py-2 text-sm font-medium disabled:opacity-50 ${cls}`}>
        {pending ? "Arbetar …" : label}
      </button>
      {state ? <span className={`ml-2 block text-xs sm:inline ${state.ok ? "text-success" : "text-danger"}`}>{state.ok ? state.message : state.error}</span> : null}
    </form>
  );
}

export function SubscriptionActions({ id, status, paused, cancelling }: { id: string; status: string; paused: boolean; cancelling: boolean }) {
  const active = status === "active" || status === "trialing";
  return (
    <div className="flex flex-wrap items-center gap-2">
      {paused || cancelling ? (
        <ActionButton action={resumeSubscription} id={id} label={cancelling ? "Ångra avslut" : "Återuppta"} />
      ) : active ? (
        <ActionButton action={pauseSubscription} id={id} label="Pausa" />
      ) : null}
      {!cancelling && (active || paused) ? (
        <ActionButton action={cancelSubscription} id={id} label="Avsluta" tone="danger" confirm="Avsluta prenumerationen? Den löper ut efter innevarande period och inga fler dragningar görs." />
      ) : null}
    </div>
  );
}

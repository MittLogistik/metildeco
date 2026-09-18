"use client";

import { useActionState, useEffect, useState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import type { ActionResult } from "../actions";

type Action = (formData: FormData) => Promise<ActionResult>;

/**
 * Formulär kopplat till en serveraktion. Visar resultat eller fel under formuläret.
 * `confirm` ger en bekräftelsefråga innan aktionen körs.
 */
export function ActionForm({
  action,
  children,
  className = "",
  confirm,
  inline = false,
}: {
  action: Action;
  children: ReactNode;
  className?: string;
  confirm?: string;
  inline?: boolean;
}) {
  const [state, formAction, pending] = useActionState(async (_prev: ActionResult | null, fd: FormData) => action(fd), null);
  return (
    <form
      action={formAction}
      className={className}
      onSubmit={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
      data-pending={pending ? "true" : undefined}
    >
      {children}
      {state ? (
        <p
          role="status"
          className={`${inline ? "ml-2 inline" : "mt-3 block"} text-sm ${state.ok ? "text-success" : "text-danger"}`}
        >
          {state.ok ? (state.message ?? "Sparat.") : state.error}
        </p>
      ) : null}
      {pending ? <span className="sr-only">Arbetar …</span> : null}
    </form>
  );
}

export function SubmitButton({ children, variant = "primary", pendingLabel = "Arbetar …" }: { children: ReactNode; variant?: "primary" | "outline" | "danger"; pendingLabel?: string }) {
  const { pending } = useFormStatus();
  const styles = {
    primary: "bg-primary text-primary-fg hover:bg-primary-hover",
    outline: "border border-line bg-white hover:bg-sand",
    danger: "border border-danger/30 bg-white text-danger hover:bg-danger/5",
  };
  return (
    <button type="submit" disabled={pending} aria-busy={pending} className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium disabled:cursor-wait disabled:opacity-70 ${styles[variant]}`}>
      {pending ? (
        <>
          <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}

/**
 * Förloppsindikator för långa serveraktioner (bildgenerering). Visas bara medan formuläret arbetar.
 * Tiden är en uppskattning:  beräknas av formuläret, stapeln fylls mot den och
 * stannar på 95 % tills svaret kommer.
 */
export function ActionProgress({ expectedSeconds, label }: { expectedSeconds: number; label: string }) {
  const { pending } = useFormStatus();
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!pending) return;
    const started = Date.now();
    const id = setInterval(() => setElapsed(Math.round((Date.now() - started) / 1000)), 1000);
    return () => clearInterval(id);
  }, [pending]);
  if (!pending) return null;
  const pct = Math.min(95, Math.round((elapsed / Math.max(expectedSeconds, 1)) * 100));
  const left = Math.max(0, expectedSeconds - elapsed);
  return (
    <div role="status" aria-live="polite" className="mt-3 rounded-xl border border-line bg-sand-soft p-3 text-sm">
      <div className="flex items-center justify-between gap-3">
        <span>{label}</span>
        <span className="tabular-nums text-muted">
          {elapsed} s{left > 0 ? ` · ca ${left} s kvar` : " · strax klar"}
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
        <div className="h-full rounded-full bg-primary transition-[width] duration-1000" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 text-xs text-muted">Lämna sidan öppen. Bilderna dyker upp i listan när allt är klart.</p>
    </div>
  );
}

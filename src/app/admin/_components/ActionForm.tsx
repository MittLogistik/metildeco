"use client";

import { useActionState, type ReactNode } from "react";
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

export function SubmitButton({ children, variant = "primary" }: { children: ReactNode; variant?: "primary" | "outline" | "danger" }) {
  const styles = {
    primary: "bg-primary text-primary-fg hover:bg-primary-hover",
    outline: "border border-line bg-white hover:bg-sand",
    danger: "border border-danger/30 bg-white text-danger hover:bg-danger/5",
  };
  return (
    <button type="submit" className={`inline-flex h-10 items-center rounded-full px-4 text-sm font-medium ${styles[variant]}`}>
      {children}
    </button>
  );
}

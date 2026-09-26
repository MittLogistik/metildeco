"use client";

import { ActionForm, SubmitButton } from "../_components/ActionForm";
import { adminSubscriptionCommand } from "./actions";

/**
 * Knappar för att pausa, återuppta och avsluta en kunds prenumeration från adminpanelen.
 * Avsluta direkt frågar först: det stoppar alla kommande dragningar omedelbart.
 */
export function AdminSubscriptionActions({ id, status, paused, cancelling }: { id: string; status: string; paused: boolean; cancelling: boolean }) {
  const live = status === "active" || status === "trialing" || status === "past_due";
  if (status === "canceled") return null;
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      {paused || cancelling ? (
        <ActionForm action={adminSubscriptionCommand} inline>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="command" value="resume" />
          <SubmitButton variant="outline">{cancelling ? "Ångra avslut" : "Återuppta"}</SubmitButton>
        </ActionForm>
      ) : live ? (
        <ActionForm action={adminSubscriptionCommand} inline>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="command" value="pause" />
          <SubmitButton variant="outline">Pausa</SubmitButton>
        </ActionForm>
      ) : null}
      {!cancelling && (live || paused) ? (
        <ActionForm action={adminSubscriptionCommand} inline>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="command" value="cancel_period_end" />
          <SubmitButton variant="outline">Avsluta vid periodens slut</SubmitButton>
        </ActionForm>
      ) : null}
      <ActionForm action={adminSubscriptionCommand} inline confirm="Avsluta prenumerationen direkt? Kunden får inga fler leveranser och inga fler dragningar görs. Redan betald period återbetalas i så fall manuellt i Stripe.">
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="command" value="cancel_now" />
        <SubmitButton variant="danger">Avsluta direkt</SubmitButton>
      </ActionForm>
    </div>
  );
}

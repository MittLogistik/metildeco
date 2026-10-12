"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui";
import { sendLoginCode, verifyLoginCode, type AccountResult } from "./actions";

const field = "h-12 w-full rounded-xl border border-line bg-white px-3.5 text-base placeholder:text-muted-soft focus:border-primary focus:outline-none";

/** Inloggning med engångskod via e-post – inget lösenord att komma ihåg. */
export function LoginForm() {
  const [email, setEmail] = useState<string | null>(null);
  const [sendState, sendAction, sending] = useActionState(async (_p: AccountResult | null, fd: FormData) => {
    const r = await sendLoginCode(fd);
    if (r.ok) setEmail(r.message ?? null);
    return r;
  }, null);
  const [verifyState, verifyAction, verifying] = useActionState(async (_p: AccountResult | null, fd: FormData) => verifyLoginCode(fd), null);

  if (email) {
    return (
      <form action={verifyAction} className="rounded-card border border-line p-6 sm:p-8">
        <h2 className="font-display text-2xl font-medium">Skriv in koden</h2>
        <p className="mt-2 text-sm text-muted">
          Vi har skickat en engångskod till <strong className="text-foreground">{email}</strong>. Den gäller i 10 minuter. Kolla skräpposten om den dröjer.
        </p>
        <input type="hidden" name="email" value={email} />
        <label className="mt-5 block text-sm">
          <span className="mb-1.5 block font-medium">Kod</span>
          <input name="code" inputMode="numeric" autoComplete="one-time-code" required placeholder="123456" className={`${field} font-mono tracking-[0.3em]`} />
        </label>
        {verifyState && !verifyState.ok ? (
          <p role="alert" className="mt-3 text-sm text-danger">
            {verifyState.error}
          </p>
        ) : null}
        <Button type="submit" size="lg" className="mt-5 w-full" disabled={verifying}>
          {verifying ? "Loggar in …" : "Logga in"}
        </Button>
        <button type="button" onClick={() => setEmail(null)} className="mt-3 w-full text-center text-sm text-muted underline underline-offset-2">
          Använd en annan e-postadress
        </button>
      </form>
    );
  }

  return (
    <form action={sendAction} className="rounded-card border border-line p-6 sm:p-8">
      <h2 className="font-display text-2xl font-medium">Logga in</h2>
      <p className="mt-2 text-sm text-muted">Ange e-postadressen du handlat med så skickar vi en engångskod. Inget lösenord behövs.</p>
      <label className="mt-5 block text-sm">
        <span className="mb-1.5 block font-medium">E-postadress</span>
        <input name="email" type="email" required autoComplete="email" placeholder="du@exempel.se" className={field} />
      </label>
      {sendState && !sendState.ok ? (
        <p role="alert" className="mt-3 text-sm text-danger">
          {sendState.error}
        </p>
      ) : null}
      <Button type="submit" size="lg" className="mt-5 w-full" disabled={sending}>
        {sending ? "Skickar kod …" : "Skicka kod"}
      </Button>
      <p className="mt-4 text-xs text-muted">
        Kommer du inte in? Mejla <a href="mailto:support@metilde.com" className="underline underline-offset-2">support@metilde.com</a> från adressen du handlat med, så pausar eller avslutar vi prenumerationen åt dig och bekräftar skriftligen.
      </p>
    </form>
  );
}

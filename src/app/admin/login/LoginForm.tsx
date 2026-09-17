"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui";

const field = "h-11 w-full rounded-xl border border-line bg-white px-3.5 text-sm focus:border-primary focus:outline-none";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError(null);
        const f = new FormData(e.currentTarget);
        const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!);
        const { error } = await supabase.auth.signInWithPassword({
          email: String(f.get("email")),
          password: String(f.get("password")),
        });
        if (error) {
          setError("Fel e-post eller lösenord.");
          setBusy(false);
          return;
        }
        router.replace("/admin");
        router.refresh();
      }}
    >
      <label className="block text-sm">
        <span className="mb-1.5 block font-medium">E-post</span>
        <input name="email" type="email" required autoComplete="email" className={field} />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block font-medium">Lösenord</span>
        <input name="password" type="password" required autoComplete="current-password" className={field} />
      </label>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <Button type="submit" className="w-full" disabled={busy}>
        {busy ? "Loggar in …" : "Logga in"}
      </Button>
    </form>
  );
}

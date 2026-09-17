import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "./supabase";

/** Supabase-klient som läser inloggningen ur cookies (publika nyckeln, följer RLS). */
export async function createSessionClient() {
  const cookieStore = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list) => {
        try {
          for (const { name, value, options } of list) cookieStore.set(name, value, options);
        } catch {
          /* Serverkomponenter får inte sätta cookies – proxyn sköter förnyelsen. */
        }
      },
    },
  });
}

export type AdminUser = { id: string; email: string };

/** Inloggad användare med rollen admin, annars null. */
export async function getAdminUser(): Promise<AdminUser | null> {
  const client = await createSessionClient();
  const { data } = await client.auth.getUser();
  const user = data.user;
  if (!user) return null;
  const role = await supabaseAdmin().from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
  if (!role.data) return null;
  return { id: user.id, email: user.email ?? "" };
}

/** Kräver admin – skickar annars till inloggningen. */
export async function requireAdmin(): Promise<AdminUser> {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return user;
}

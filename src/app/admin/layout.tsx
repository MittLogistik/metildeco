import type { Metadata } from "next";
import Link from "next/link";
import { getAdminUser } from "@/lib/auth";
import { signOut } from "./actions";
import { AdminNav } from "./_components/AdminNav";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s – Admin | Metilde" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const user = await getAdminUser();
  if (!user) {
    // Inloggningssidan renderas utan ram; proxyn skickar övriga sidor hit.
    return <>{children}</>;
  }
  return (
    <div className="min-h-screen bg-sand-soft">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-display text-lg font-medium">
              Metilde <span className="text-muted">admin</span>
            </Link>
            <div className="hidden sm:block">
              <AdminNav />
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/sv" className="text-muted hover:text-foreground">
              Visa butiken
            </Link>
            <span className="hidden text-muted md:inline">{user.email}</span>
            <form action={signOut}>
              <button type="submit" className="rounded-full border border-line px-3 py-1.5 hover:bg-sand">
                Logga ut
              </button>
            </form>
          </div>
        </div>
        <div className="px-4 pb-2 sm:hidden">
          <AdminNav />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}

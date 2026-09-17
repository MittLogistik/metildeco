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
    <div className="min-h-screen bg-sand-soft lg:grid lg:grid-cols-[232px_minmax(0,1fr)]">
      <aside className="border-b border-line bg-white lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex h-14 items-center justify-between px-4 lg:h-16 lg:px-5">
          <Link href="/admin" className="font-display text-lg font-medium">
            Metilde <span className="text-muted">admin</span>
          </Link>
          <Link href="/sv" className="text-xs text-muted hover:text-foreground lg:hidden">
            Butiken
          </Link>
        </div>
        <div className="px-3 pb-3 lg:px-3">
          <AdminNav />
        </div>
        <div className="hidden border-t border-line px-5 py-4 text-xs text-muted lg:absolute lg:bottom-0 lg:left-0 lg:right-0 lg:block">
          <p className="truncate">{user.email}</p>
          <div className="mt-2 flex items-center gap-3">
            <Link href="/sv" className="hover:text-foreground">
              Visa butiken
            </Link>
            <form action={signOut}>
              <button type="submit" className="hover:text-foreground">
                Logga ut
              </button>
            </form>
          </div>
        </div>
      </aside>
      <main className="min-w-0 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
    </div>
  );
}

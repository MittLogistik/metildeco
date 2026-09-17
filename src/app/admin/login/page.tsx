import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Logga in – Admin", robots: { index: false, follow: false } };

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-sand-soft px-4">
      <div className="w-full max-w-sm rounded-card bg-white p-8 shadow-card">
        <p className="font-display text-2xl font-medium">Metilde</p>
        <h1 className="mt-1 text-sm text-muted">Adminpanel</h1>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}

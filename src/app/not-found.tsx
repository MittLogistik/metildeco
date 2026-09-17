import Link from "next/link";
import { routes } from "@/lib/routes";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-32 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">404</p>
      <h1 className="mt-3 font-display text-4xl font-medium">Sidan hittades inte</h1>
      <p className="mt-3 max-w-md text-muted">Adressen kan ha ändrats eller så finns produkten inte längre i sortimentet.</p>
      <Link href={routes.home} className="mt-8 inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-fg">
        Till startsidan
      </Link>
    </main>
  );
}

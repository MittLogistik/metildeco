import Link from "next/link";
import { common } from "@/i18n/messages/common";
import { getI18n } from "@/i18n/server";

export default async function NotFound() {
  const { locale, r } = await getI18n();
  const t = common[locale].notFound;
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-32 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">404</p>
      <h1 className="mt-3 font-display text-4xl font-medium">{t.title}</h1>
      <p className="mt-3 max-w-md text-muted">{t.text}</p>
      <Link href={r.home} className="mt-8 inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-fg">
        {t.home}
      </Link>
    </main>
  );
}

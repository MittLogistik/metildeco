import { notFound } from "next/navigation";
import { getLocale } from "@/i18n/server";
import { hasPage } from "@/lib/routes";

/** Sidan finns bara på svenska än så länge – 404 på övriga språk. */
export default async function SwedishOnlyLayout({ children }: { children: React.ReactNode }) {
  if (!hasPage("goals", await getLocale())) notFound();
  return children;
}

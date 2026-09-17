import { redirect } from "next/navigation";

/** Rotadressen skickar vidare till svenska butiken tills fler språk aktiveras. */
export default function RootPage() {
  redirect("/sv");
}

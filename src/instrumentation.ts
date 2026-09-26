/**
 * Körs en gång när servern startar. Sätter svensk tidszon så att alla tider som renderas
 * på servern (admin, mejl, loggar) visas i svensk tid i stället för UTC på Vercel.
 */
export async function register() {
  if (!process.env.TZ) process.env.TZ = "Europe/Stockholm";
}

// Gör projektets servermoduler körbara från tsx: server-only blir tom, next/cache passerar igenom.
// Användning: npx tsx --env-file=.env.local --import ./scripts/server-shim.mjs scripts/x.mts
import { registerHooks } from "node:module";
const stubs = {
  "server-only": "export {};",
  "next/cache": "export const unstable_cache = (fn) => fn; export const revalidateTag = () => {}; export const revalidatePath = () => {}; export const updateTag = () => {}; export const cacheTag = () => {}; export const cacheLife = () => {};",
};
registerHooks({
  resolve(spec, ctx, next) {
    if (spec in stubs) return { url: `stub:${spec}`, shortCircuit: true, format: "module" };
    return next(spec, ctx);
  },
  load(url, ctx, next) {
    if (url.startsWith("stub:")) return { source: stubs[url.slice(5)], format: "module", shortCircuit: true };
    return next(url, ctx);
  },
});

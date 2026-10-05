/**
 * "Handla efter mål" – en sorteringshjälp i sortimentet, inga hälsopåståenden.
 */
import type { Product } from "@/lib/products";

export type GoalId = "tongkat" | "morgon" | "kvall" | "traning" | "orter" | "svampar" | "blad" | "kurer";

export type Goal = {
  id: GoalId;
  label: string;
  description: string;
};

export const goals: Goal[] = [
  // Grupperna beskriver råvara och tidpunkt, aldrig vad produkten gör med kroppen (Merchant Center, livsmedelslagen).
  { id: "tongkat", label: "Tongkat Ali", description: "Rotextrakt av Eurycoma longifolia." },
  { id: "morgon", label: "Morgon", description: "Extrakt som passar att ta till frukosten." },
  { id: "kvall", label: "Kväll", description: "Extrakt som många väljer att ta på kvällen." },
  { id: "traning", label: "Kring träningen", description: "Extrakt som passar in i en vardag med träning." },
  { id: "orter", label: "Rötter & örter", description: "Rot- och örtextrakt." },
  { id: "svampar", label: "Svampextrakt", description: "Extrakt av svampar." },
  { id: "blad", label: "Blad, frön & alger", description: "Extrakt av blad, frön och alger." },
  { id: "kurer", label: "Kurer", description: "Örtblandningar som tas under en begränsad period." },
];

/** Gamla adresser (?mal=energy) från den tidigare indelningen. */
const legacyGoalIds: Record<string, GoalId> = {vitality: "tongkat", energy: "morgon", sleep: "kvall", training: "traning", focus: "orter", immune: "svampar", skin: "blad", gut: "kurer"};

/** Tolkar ett ?mal=-värde, även de gamla engelska id:na. */
export const resolveGoalId = (v: string): GoalId | null => (isGoalId(v) ? v : (legacyGoalIds[v] ?? null));

export const getGoal = (id: string) => goals.find((g) => g.id === id);

export const isGoalId = (v: string): v is GoalId => goals.some((g) => g.id === v);

const productGoals: Record<string, GoalId[]> = {
  "tongkat-ali-elite": ["tongkat", "morgon", "traning"],
  "tongkat-premium": ["tongkat", "morgon", "traning"],
  "tongkat-ali-ruby": ["tongkat", "morgon", "traning"],
  "black-tongkat": ["tongkat", "morgon", "traning"],
  "cistanche-tubulosa": ["orter", "morgon"],
  "fadogia-agrestis": ["orter", "traning"],
  "blue-lotus": ["orter", "kvall"],
  "parasite-support": ["kurer"],
  "parasite-cleanse": ["kurer"],
  "turkey-tail": ["svampar"],
  "horny-goat-weed": ["orter"],
  akarkara: ["orter"],
  maca: ["orter", "morgon"],
  mariatistel: ["orter"],
  nasselblad: ["blad"],
  druvkarneextrakt: ["blad"],
  quercetin: ["blad"],
  reishi: ["svampar", "kvall"],
  chaga: ["svampar", "morgon"],
  "lions-mane": ["svampar", "morgon"],
  cordyceps: ["svampar", "traning"],
  spirulina: ["blad", "morgon"],
};

export const goalsFor = (slug: string): GoalId[] => productGoals[slug] ?? [];

export const matchScore = (slug: string, selected: GoalId[]) =>
  selected.length === 0 ? 0 : goalsFor(slug).filter((g) => selected.includes(g)).length;

/** Produkter sorterade efter hur väl de matchar valda mål. */
export function productsByGoals(selected: GoalId[], list: Product[]): Product[] {
  if (selected.length === 0) return list;
  return list
    .map((p) => ({ p, score: matchScore(p.slug, selected) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.p.rating - a.p.rating)
    .map((x) => x.p);
}

export const goalProductCount = (id: GoalId, list: Product[]) =>
  list.filter((p) => goalsFor(p.slug).includes(id)).length;

/**
 * "Handla efter mål" – en sorteringshjälp i sortimentet, inga hälsopåståenden.
 */
import type { Product } from "@/lib/products";

export type GoalId =
  | "energy"
  | "sleep"
  | "immune"
  | "training"
  | "skin"
  | "focus"
  | "gut"
  | "vitality";

export type Goal = {
  id: GoalId;
  label: string;
  description: string;
};

export const goals: Goal[] = [
  // Grupperna beskriver råvara och tidpunkt, aldrig vad produkten gör med kroppen (Merchant Center, livsmedelslagen).
  // Id:na är kvar från den gamla indelningen så att länkar (?mal=) och quizet fortsätter fungera.
  { id: "vitality", label: "Tongkat Ali", description: "Rotextrakt av Eurycoma longifolia i fyra varianter." },
  { id: "energy", label: "Morgon", description: "Extrakt som passar att ta till frukosten." },
  { id: "sleep", label: "Kväll", description: "Extrakt som många väljer att ta på kvällen." },
  { id: "training", label: "Kring träningen", description: "Extrakt som passar in i en vardag med träning." },
  { id: "focus", label: "Rötter & örter", description: "Klassiska rot- och örtextrakt som maca, fadogia och cistanche." },
  { id: "immune", label: "Svampextrakt", description: "Reishi, chaga, lion's mane, cordyceps och turkey tail." },
  { id: "skin", label: "Blad, frön & alger", description: "Druvkärna, quercetin, nässla och spirulina." },
  { id: "gut", label: "Kurer", description: "Örtblandningar som tas under en begränsad period." },
];

export const getGoal = (id: string) => goals.find((g) => g.id === id);

export const isGoalId = (v: string): v is GoalId => goals.some((g) => g.id === v);

const productGoals: Record<string, GoalId[]> = {
  "tongkat-ali-elite": ["vitality", "energy", "training"],
  "tongkat-premium": ["vitality", "energy", "training"],
  "tongkat-ali-ruby": ["vitality", "energy", "training"],
  "black-tongkat": ["vitality", "energy", "training"],
  "cistanche-tubulosa": ["focus", "energy"],
  "fadogia-agrestis": ["focus", "training"],
  "blue-lotus": ["focus", "sleep"],
  "parasite-support": ["gut"],
  "parasite-cleanse": ["gut"],
  "turkey-tail": ["immune"],
  "horny-goat-weed": ["focus"],
  akarkara: ["focus"],
  maca: ["focus", "energy"],
  mariatistel: ["focus"],
  nasselblad: ["skin"],
  druvkarneextrakt: ["skin"],
  quercetin: ["skin"],
  reishi: ["immune", "sleep"],
  chaga: ["immune", "energy"],
  "lions-mane": ["immune", "energy"],
  cordyceps: ["immune", "training"],
  spirulina: ["skin", "energy"],
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

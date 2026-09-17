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
  { id: "energy", label: "Energi", description: "För dagar som kräver mer av dig." },
  { id: "sleep", label: "Sömn & lugn", description: "Rutiner för kvällen och nedvarvning." },
  { id: "immune", label: "Immunförsvar", description: "Basen genom årets mörkare månader." },
  { id: "training", label: "Träning & återhämtning", description: "Stöd runt pass och vilodagar." },
  { id: "skin", label: "Hud & hår", description: "Rena råvaror för det yttre." },
  { id: "focus", label: "Fokus", description: "För arbetsdagar som kräver skärpa." },
  { id: "gut", label: "Maghälsa", description: "Örtkurer och basen i magen." },
  { id: "vitality", label: "Vitalitet", description: "Klassiska örter för helheten." },
];

export const getGoal = (id: string) => goals.find((g) => g.id === id);

export const isGoalId = (v: string): v is GoalId => goals.some((g) => g.id === v);

const productGoals: Record<string, GoalId[]> = {
  "tongkat-ali-elite": ["energy", "training", "vitality"],
  "tongkat-premium": ["energy", "training", "vitality"],
  "tongkat-ali-ruby": ["energy", "training", "vitality"],
  "black-tongkat": ["training", "vitality", "energy"],
  "cistanche-tubulosa": ["vitality", "energy", "skin"],
  "fadogia-agrestis": ["training", "vitality"],
  "blue-lotus": ["sleep", "focus"],
  "parasite-support": ["gut"],
  "parasite-cleanse": ["gut"],
  "turkey-tail": ["immune", "gut"],
  "horny-goat-weed": ["vitality", "energy"],
  akarkara: ["vitality", "focus"],
  maca: ["energy", "vitality"],
  mariatistel: ["gut"],
  nasselblad: ["skin", "immune"],
  druvkarneextrakt: ["skin"],
  quercetin: ["immune", "skin"],
  reishi: ["sleep", "immune"],
  chaga: ["immune"],
  "lions-mane": ["focus"],
  cordyceps: ["energy", "training"],
  spirulina: ["energy", "immune"],
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

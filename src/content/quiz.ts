/** Quiz "Hitta rätt tillskott" – sex frågor som viktar mål och enskilda produkter. Inga hälsopåståenden. */
import type { Product } from "@/lib/products";
import { goalsFor, type GoalId } from "./goals";

export type QuizOption = {
  id: string;
  label: string;
  weights: Partial<Record<GoalId, number>>;
  boosts?: Record<string, number>;
};

export type QuizQuestion = { id: string; title: string; options: QuizOption[] };

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    title: "Vad vill du fokusera på i första hand?",
    options: [
      { id: "a", label: "Energi i vardagen", weights: { energy: 3, vitality: 1 } },
      { id: "b", label: "Sömn och nedvarvning", weights: { sleep: 3, focus: 1 } },
      { id: "c", label: "Träning och återhämtning", weights: { training: 3, energy: 1 } },
      { id: "d", label: "Fokus under arbetsdagen", weights: { focus: 3, energy: 1 } },
    ],
  },
  {
    id: "q2",
    title: "Hur ser din träningsvecka ut?",
    options: [
      { id: "a", label: "Sällan eller aldrig", weights: { vitality: 1 } },
      { id: "b", label: "1–2 pass i veckan", weights: { energy: 1, vitality: 1 } },
      { id: "c", label: "3–4 pass i veckan", weights: { training: 2 } },
      { id: "d", label: "5 pass eller mer", weights: { training: 3, immune: 1 } },
    ],
  },
  {
    id: "q3",
    title: "Hur upplever du din sömn?",
    options: [
      { id: "a", label: "Sover bra de flesta nätter", weights: { energy: 1 } },
      { id: "b", label: "Vaknar ofta under natten", weights: { sleep: 2 } },
      { id: "c", label: "Svårt att varva ner på kvällen", weights: { sleep: 3 } },
      { id: "d", label: "Ojämnt, varierar mycket", weights: { sleep: 2, focus: 1 } },
    ],
  },
  {
    id: "q4",
    title: "Hur skulle du beskriva din vardag?",
    options: [
      { id: "a", label: "Lugn och förutsägbar", weights: { vitality: 1 } },
      { id: "b", label: "Full men hanterbar", weights: { energy: 1, focus: 1 } },
      { id: "c", label: "Högt tempo, mycket på en gång", weights: { focus: 2, energy: 2 } },
      { id: "d", label: "Skiftarbete eller oregelbundna tider", weights: { sleep: 2, immune: 2 } },
    ],
  },
  {
    id: "q5",
    title: "Har du tagit örttillskott tidigare?",
    options: [
      { id: "a", label: "Nej, det här är nytt för mig", weights: {}, boosts: { "tongkat-ali-elite": 3, reishi: 2 } },
      { id: "b", label: "Lite, men inget regelbundet", weights: {}, boosts: { "tongkat-ali-elite": 2 } },
      { id: "c", label: "Ja, jag tar något dagligen", weights: {}, boosts: { "tongkat-premium": 2 } },
      { id: "d", label: "Ja, och jag vill ha en högre dos", weights: {}, boosts: { "black-tongkat": 3, "tongkat-premium": 2 } },
    ],
  },
  {
    id: "q6",
    title: "Vad är viktigast när du väljer produkt?",
    options: [
      { id: "a", label: "Ren sammansättning utan tillsatser", weights: {}, boosts: { reishi: 1, chaga: 1 } },
      { id: "b", label: "Hög koncentration", weights: {}, boosts: { "tongkat-premium": 2, "black-tongkat": 2 } },
      { id: "c", label: "Pris i förhållande till innehåll", weights: {}, boosts: { "fadogia-agrestis": 2, maca: 1 } },
      { id: "d", label: "Att det är enkelt och går att prenumerera på", weights: {}, boosts: { "tongkat-ali-elite": 2, "lions-mane": 1 } },
    ],
  },
];

export type QuizAnswers = Record<string, string>;

export function scoreQuiz(answers: QuizAnswers, list: Product[]): { topGoals: GoalId[]; ranked: Product[] } {
  const goalScore: Partial<Record<GoalId, number>> = {};
  const productBoost: Record<string, number> = {};
  for (const q of quizQuestions) {
    const chosen = q.options.find((o) => o.id === answers[q.id]);
    if (!chosen) continue;
    for (const [goal, w] of Object.entries(chosen.weights)) goalScore[goal as GoalId] = (goalScore[goal as GoalId] ?? 0) + (w ?? 0);
    for (const [slug, w] of Object.entries(chosen.boosts ?? {})) productBoost[slug] = (productBoost[slug] ?? 0) + w;
  }
  const topGoals = (Object.entries(goalScore) as [GoalId, number][]).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([g]) => g);
  const ranked = list
    .map((p) => ({ p, score: goalsFor(p.slug).reduce((s, g) => s + (goalScore[g] ?? 0), 0) + (productBoost[p.slug] ?? 0) * 2 }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p);
  return { topGoals, ranked };
}

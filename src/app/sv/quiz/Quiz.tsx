"use client";

import { useState } from "react";
import { getGoal } from "@/content/goals";
import { quizQuestions, scoreQuiz, type QuizAnswers } from "@/content/quiz";
import type { Product } from "@/lib/products";
import { routes } from "@/lib/routes";
import { ProductCard } from "@/components/ProductCard";
import { Button, ButtonLink } from "@/components/ui";

export function Quiz({ products }: { products: Product[] }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const done = step >= quizQuestions.length;

  if (done) {
    const { topGoals, ranked } = scoreQuiz(answers, products);
    const [top, ...rest] = ranked;
    return (
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Ditt resultat</p>
        <h2 className="mt-2 font-display text-3xl font-medium">Vi föreslår detta till dig</h2>
        <p className="mt-2 max-w-2xl text-muted">
          Utifrån dina svar är detta de produkter i sortimentet som ligger närmast dina mål
          {topGoals.length ? `: ${topGoals.map((g) => getGoal(g)?.label).filter(Boolean).join(", ").toLowerCase()}` : ""}.
        </p>
        {top ? (
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_2fr]">
            <div>
              <p className="mb-3 text-sm font-semibold">Vårt förstahandsval</p>
              <ProductCard product={top} priority />
            </div>
            {rest.length ? (
              <div>
                <p className="mb-3 text-sm font-semibold">Passar också</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3">
                  {rest.slice(0, 3).map((p) => (
                    <ProductCard key={p.slug} product={p} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <p className="mt-8 text-muted">Inget i sortimentet matchade just den kombinationen. Titta gärna på hela sortimentet.</p>
        )}
        <div className="mt-10 flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setAnswers({});
              setStep(0);
            }}
          >
            Gör om quizen
          </Button>
          <ButtonLink href={routes.products} variant="ghost">
            Se hela sortimentet
          </ButtonLink>
        </div>
      </div>
    );
  }

  const q = quizQuestions[step]!;
  return (
    <div className="max-w-2xl">
      <p className="text-sm text-muted">
        Fråga {step + 1} av {quizQuestions.length}
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(step / quizQuestions.length) * 100}%` }} />
      </div>
      <h2 className="mt-6 font-display text-2xl font-medium sm:text-3xl">{q.title}</h2>
      <ul className="mt-6 grid gap-3">
        {q.options.map((o) => (
          <li key={o.id}>
            <button
              type="button"
              onClick={() => {
                setAnswers((a) => ({ ...a, [q.id]: o.id }));
                setStep((s) => s + 1);
              }}
              className="w-full rounded-2xl border border-line bg-white p-4 text-left text-base transition-colors hover:border-primary hover:bg-primary-soft"
            >
              {o.label}
            </button>
          </li>
        ))}
      </ul>
      {step > 0 ? (
        <button type="button" onClick={() => setStep((s) => s - 1)} className="mt-6 text-sm text-muted underline underline-offset-2 hover:text-foreground">
          Tillbaka
        </button>
      ) : null}
    </div>
  );
}

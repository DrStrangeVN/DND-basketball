"use client";
import { useState } from "react";
import { ChevronDown, Eye } from "lucide-react";
import Link from "next/link";
import CourtDiagram from "./CourtDiagram";
import type { CourtVisionCard as CVC } from "@/lib/types";
import { useLanguage, pick } from "@/lib/i18n";

export default function CourtVisionCard({ card, learnUrl }: { card: CVC; learnUrl: string }) {
  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const { lang, t } = useLanguage();
  const v = lang === "vi" ? card.vi : undefined;

  const title = pick(lang, card.title, v?.title);
  const setup = pick(lang, card.setup, v?.setup);
  const question = pick(lang, card.question, v?.question);
  const options = pick(lang, card.options, v?.options);
  const explanation = pick(lang, card.explanation, v?.explanation);

  return (
    <div className="neu flex flex-col p-5 sm:p-6">
      <p className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--orange)]">
        <Eye className="h-3.5 w-3.5" aria-hidden /> {t("home.courtVision.title")}
      </p>
      <h3 className="text-lg font-extrabold tracking-tight">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-[color:var(--muted)]">{setup}</p>

      <div className="neu-inset mt-4 p-3">
        <CourtDiagram diagram={card.diagram} />
      </div>

      <p className="mt-4 text-[15px] font-bold">{question}</p>
      <div className="mt-2 space-y-2">
        {options.map((opt, i) => {
          const isCorrect = i === card.correctIndex;
          const chosen = picked === i;
          return (
            <button key={i} disabled={revealed} onClick={() => setPicked(i)}
              className={`neu-btn w-full px-4 py-2.5 text-left text-sm font-medium transition-colors
                ${revealed && isCorrect ? "!text-[color:var(--orange)] ring-2 ring-[color:var(--orange)]" : ""}
                ${chosen && !revealed ? "text-[color:var(--ink)]" : "text-[color:var(--muted)]"}`}>
              {opt}
            </button>
          );
        })}
      </div>

      {!revealed ? (
        <button onClick={() => setRevealed(true)} disabled={picked === null}
          className="neu-btn mt-4 inline-flex items-center justify-center gap-1 px-5 py-2.5 text-sm font-bold text-[color:var(--orange)] disabled:opacity-40">
          {t("courtVision.check")} <ChevronDown className="h-4 w-4" aria-hidden />
        </button>
      ) : (
        <div className="neu-inset mt-4 p-4">
          <p className="text-sm font-bold text-[color:var(--orange)]">
            {picked === card.correctIndex ? t("courtVision.correct") : t("courtVision.incorrect")}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-[color:var(--muted)]">{explanation}</p>
          <Link href={learnUrl} className="mt-2 inline-block text-sm font-bold text-[color:var(--orange)] hover:underline">
            {t("courtVision.relatedArticle")} →
          </Link>
        </div>
      )}
    </div>
  );
}

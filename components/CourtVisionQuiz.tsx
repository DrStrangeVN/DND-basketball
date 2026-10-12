"use client";
import {useLiveCollection} from "./LiveContent";
import { useEffect, useState } from "react";
import { ArrowRight, Award, RotateCcw, Trophy } from "lucide-react";
import CourtVisionCard from "./CourtVisionCard";
import type { CourtVisionCard as CVC } from "@/lib/types";
import { useLanguage } from "@/lib/i18n";

const BEST_KEY = "dnd-court-vision-best";

interface Best { score: number; pct: number; date: string }

function rankFor(pct: number): "rookie" | "prospect" | "starter" | "allstar" | "mvp" {
  if (pct >= 90) return "mvp";
  if (pct >= 80) return "allstar";
  if (pct >= 60) return "starter";
  if (pct >= 40) return "prospect";
  return "rookie";
}

function loadBest(): Best | null {
  try {
    const raw = localStorage.getItem(BEST_KEY);
    if (!raw) return null;
    const b = JSON.parse(raw) as Best;
    return typeof b.score === "number" && typeof b.pct === "number" ? b : null;
  } catch { return null; }
}

export default function CourtVisionQuiz({ items: initialCards }: { items: { card: CVC; learnUrl: string }[] }) {
  const liveCards=useLiveCollection("court-vision",initialCards.map(i=>({...i.card,learnUrl:i.learnUrl})));
  const items=liveCards.map(card=>({card,learnUrl:card.learnUrl||"/search?q="+encodeURIComponent(card.relatedArticle)}));
  const { lang, t } = useLanguage();
  const total = items.length;
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);
  const [round, setRound] = useState(0);
  const [best, setBest] = useState<Best | null>(null);
  const [isNewBest, setIsNewBest] = useState(false);

  useEffect(() => { setBest(loadBest()); }, []);

  const answered = answers.length > idx;

  const handleAnswered = (correct: boolean) => {
    if (answers.length > idx) return;
    const next = [...answers, correct];
    setAnswers(next);
    if (next.length === total) {
      const score = next.filter(Boolean).length;
      const pct = Math.round((score / total) * 100);
      const prev = loadBest();
      if (!prev || pct > prev.pct) {
        const b = { score, pct, date: new Date().toISOString() };
        try { localStorage.setItem(BEST_KEY, JSON.stringify(b)); } catch {}
        setBest(b);
        setIsNewBest(true);
      }
      setFinished(true);
    }
  };

  const playAgain = () => {
    setIdx(0); setAnswers([]); setFinished(false); setIsNewBest(false);
    setRound((r) => r + 1);
  };

  const fmtDate = (iso: string) => {
    try { return new Date(iso).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US"); }
    catch { return iso; }
  };

  if (finished) {
    const score = answers.filter(Boolean).length;
    const pct = Math.round((score / total) * 100);
    const rank = rankFor(pct);
    return (
      <div className="neu mx-auto max-w-2xl p-6 text-center sm:p-10">
        <p className="mb-1 flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--orange)]">
          <Trophy className="h-4 w-4" aria-hidden /> {t("cv.resultsTitle")}
        </p>
        {isNewBest && (
          <p className="mt-2 inline-block rounded-full bg-[color:var(--orange)] px-4 py-1 text-sm font-extrabold text-white">
            {t("cv.newBest")}
          </p>
        )}
        <p className="mt-4 text-6xl font-black tracking-tight text-[color:var(--orange)]">{pct}%</p>
        <p className="mt-2 text-lg font-bold">
          {score}/{total} {t("cv.correctAnswers")}
        </p>
        <div className="neu-inset mx-auto mt-5 flex max-w-sm items-center justify-center gap-2 p-4">
          <Award className="h-5 w-5 text-[color:var(--orange)]" aria-hidden />
          <span className="text-sm text-[color:var(--muted)]">{t("cv.rank")}:&nbsp;</span>
          <span className="text-lg font-extrabold">{t(`cv.rank.${rank}`)}</span>
        </div>
        {best && (
          <p className="mt-4 text-sm text-[color:var(--muted)]">
            {t("cv.best")}: {best.score}/{total} ({best.pct}%) · {fmtDate(best.date)}
          </p>
        )}
        <button onClick={playAgain}
          className="neu-btn mt-6 inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-[color:var(--orange)]">
          <RotateCcw className="h-4 w-4" aria-hidden /> {t("cv.playAgain")}
        </button>
      </div>
    );
  }

  const { card, learnUrl } = items[idx];
  const progress = Math.round((idx / total) * 100);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-bold">
          {t("cv.questionOf")} {idx + 1}/{total}
        </p>
        <p className="flex items-center gap-1.5 text-sm text-[color:var(--muted)]">
          <Trophy className="h-4 w-4 text-[color:var(--orange)]" aria-hidden />
          {best
            ? <span>{t("cv.best")}: {best.score}/{total} ({best.pct}%)</span>
            : <span>{t("cv.noBest")}</span>}
        </p>
      </div>
      <div className="neu-inset mb-4 h-2.5 overflow-hidden" aria-hidden>
        <div className="h-full rounded-full bg-[color:var(--orange)] transition-all" style={{ width: `${progress}%` }} />
      </div>

      <CourtVisionCard key={`${card.id}-r${round}`} card={card} learnUrl={learnUrl} onAnswered={handleAnswered} />

      {answered && idx + 1 < total && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setIdx(idx + 1)}
            className="neu-btn inline-flex items-center gap-1.5 px-6 py-3 text-sm font-bold text-[color:var(--orange)]">
            {t("courtVision.next")}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Layers, Check, X, RotateCcw, Play, Flag } from "lucide-react";
import { Breadcrumbs } from "@/components/ui";
import { useLanguage } from "@/lib/i18n";
import glossaryData from "@/content/glossary.json";

/* ------------------------------------------------------------------ */
/* Types & constants                                                   */
/* ------------------------------------------------------------------ */

interface GlossaryTerm {
  term: string;
  slug: string;
  definition: string;
  related: string[];
  vi?: { definition?: string };
}

interface CardProgress {
  interval: number; // days until next review
  repetitions: number; // consecutive successful recalls
  easiness: number; // SM-2 easiness factor
  nextDue: number; // timestamp (ms)
}

const TERMS: GlossaryTerm[] = glossaryData as unknown as GlossaryTerm[];
const STORAGE_KEY = "dnd-flashcards";
const SESSION_SIZE = 20;
const DAY_MS = 86_400_000;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startOfToday(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/* ------------------------------------------------------------------ */
/* SM-2 (rút gọn)                                                      */
/* ------------------------------------------------------------------ */

function reviewCard(prev: CardProgress | undefined, remembered: boolean): CardProgress {
  const p: CardProgress = prev ?? { interval: 0, repetitions: 0, easiness: 2.5, nextDue: 0 };
  if (remembered) {
    // Quality 5: success — stretch the interval.
    const repetitions = p.repetitions + 1;
    const interval =
      repetitions === 1 ? 1 : repetitions === 2 ? 3 : Math.round(Math.max(1, p.interval) * p.easiness);
    return {
      repetitions,
      interval,
      easiness: Math.min(2.5, p.easiness + 0.1),
      nextDue: Date.now() + interval * DAY_MS,
    };
  }
  // Quality 0: failure — reset to tomorrow.
  return {
    repetitions: 0,
    interval: 1,
    easiness: Math.max(1.3, p.easiness - 0.2),
    nextDue: Date.now() + DAY_MS,
  };
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function FlashcardsPage() {
  const { lang, t } = useLanguage();

  const [progress, setProgress] = useState<Record<string, CardProgress> | null>(null);
  const [queue, setQueue] = useState<GlossaryTerm[] | null>(null);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [results, setResults] = useState({ remembered: 0, forgot: 0 });

  /* Load saved progress (client-only, avoids SSR mismatch). */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setProgress(raw ? (JSON.parse(raw) as Record<string, CardProgress>) : {});
    } catch {
      setProgress({});
    }
  }, []);

  const termName = useMemo(() => {
    const m: Record<string, string> = {};
    for (const t of TERMS) m[t.slug] = t.term;
    return m;
  }, []);

  /* Dashboard stats. */
  const stats = useMemo(() => {
    if (!progress) return { mastered: 0, due: 0, fresh: 0 };
    const today = startOfToday();
    let mastered = 0;
    let due = 0;
    for (const t of TERMS) {
      const p = progress[t.slug];
      if (!p) continue;
      if (p.repetitions >= 3) mastered++;
      if (p.nextDue <= today && p.repetitions < 3) due++;
    }
    const fresh = TERMS.length - Object.keys(progress).length;
    return { mastered, due, fresh };
  }, [progress]);

  /* Build a session: due cards first (shuffled), then fresh cards, cap at 20. */
  const startSession = useCallback(() => {
    if (!progress) return;
    const today = startOfToday();
    const dueCards: GlossaryTerm[] = [];
    const freshCards: GlossaryTerm[] = [];
    for (const term of TERMS) {
      const p = progress[term.slug];
      if (!p) freshCards.push(term);
      else if (p.nextDue <= today) dueCards.push(term);
    }
    const picked = [...shuffle(dueCards), ...shuffle(freshCards)].slice(0, SESSION_SIZE);
    setQueue(picked);
    setIndex(0);
    setFlipped(false);
    setResults({ remembered: 0, forgot: 0 });
  }, [progress]);

  const answer = useCallback(
    (remembered: boolean) => {
      if (!queue || index >= queue.length) return;
      const card = queue[index];
      const next = reviewCard(progress?.[card.slug], remembered);
      const np = { ...(progress ?? {}), [card.slug]: next };
      setProgress(np);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(np));
      } catch {
        /* storage full or blocked — session still works in memory */
      }
      setResults((r) => ({
        remembered: r.remembered + (remembered ? 1 : 0),
        forgot: r.forgot + (remembered ? 0 : 1),
      }));
      setFlipped(false);
      setIndex((i) => i + 1);
    },
    [queue, index, progress]
  );

  const endSession = useCallback(() => setQueue(null), []);

  const current = queue && index < queue.length ? queue[index] : null;
  const sessionDone = queue !== null && queue.length > 0 && index >= queue.length;

  const card = (term: GlossaryTerm) => {
    const def = lang === "vi" && term.vi?.definition ? term.vi.definition : term.definition;
    return (
      <div style={{ perspective: "1200px" }} className="w-full">
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          aria-label={t("flash.tapToFlip")}
          className="block w-full cursor-pointer text-left"
        >
          <div
            className="relative min-h-[280px] w-full sm:min-h-[320px]"
            style={{
              transformStyle: "preserve-3d",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              transition: "transform 0.55s cubic-bezier(0.4, 0.15, 0.35, 1)",
            }}
          >
            {/* Mặt trước */}
            <div
              className="neu absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center"
              style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
            >
              <Layers className="h-8 w-8 text-[color:var(--orange)]" aria-hidden />
              <p className="text-3xl font-extrabold tracking-tight sm:text-4xl">{term.term}</p>
              <p className="text-[13px] font-medium text-[color:var(--muted)]">{t("flash.tapToFlip")}</p>
            </div>
            {/* Mặt sau */}
            <div
              className="neu absolute inset-0 flex flex-col justify-center gap-4 overflow-y-auto p-6 sm:p-8"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--orange)]">
                {term.term}
              </p>
              <p className="text-[15px] leading-relaxed">{def}</p>
              {term.related.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-[12px] font-bold text-[color:var(--muted)]">
                    {t("flash.related")}:
                  </span>
                  {term.related.slice(0, 4).map((r) => (
                    <span
                      key={r}
                      className="neu-inset rounded-full px-2.5 py-1 text-[12px] font-medium"
                    >
                      {termName[r] ?? r}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </button>
      </div>
    );
  };

  return (
    <div className="pb-10">
      <Breadcrumbs
        items={[
          { label: t("mobile.home"), href: "/" },
          { label: t("nav.glossary"), href: "/glossary" },
          { label: t("flash.title") },
        ]}
      />

      {/* Header + dashboard */}
      <header className="neu mb-6 p-6 sm:p-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--orange)]">
          {t("flash.eyebrow")}
        </p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
          {t("flash.title")}
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-[color:var(--muted)]">
          {t("flash.subtitle")}
        </p>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="neu-inset rounded-2xl p-4 text-center">
            <p className="text-2xl font-extrabold text-[color:var(--green,#16a34a)] sm:text-3xl">
              {stats.mastered}
            </p>
            <p className="mt-1 text-[12px] font-semibold text-[color:var(--muted)]">
              {t("flash.mastered")} / 100
            </p>
          </div>
          <div className="neu-inset rounded-2xl p-4 text-center">
            <p className="text-2xl font-extrabold text-[color:var(--orange)] sm:text-3xl">
              {stats.due}
            </p>
            <p className="mt-1 text-[12px] font-semibold text-[color:var(--muted)]">
              {t("flash.due")}
            </p>
          </div>
          <div className="neu-inset rounded-2xl p-4 text-center">
            <p className="text-2xl font-extrabold sm:text-3xl">{stats.fresh}</p>
            <p className="mt-1 text-[12px] font-semibold text-[color:var(--muted)]">
              {t("flash.new")}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-[12px] font-semibold text-[color:var(--muted)]">
            <span>{t("flash.overallProgress")}</span>
            <span>{Math.round((stats.mastered / TERMS.length) * 100)}%</span>
          </div>
          <div className="neu-inset h-3 overflow-hidden rounded-full">
            <div
              className="h-full rounded-full bg-[color:var(--orange)] transition-all"
              style={{ width: `${(stats.mastered / TERMS.length) * 100}%` }}
            />
          </div>
        </div>
      </header>

      {/* Session area */}
      {progress === null || queue === null ? (
        <section className="neu p-6 text-center sm:p-10">
          <p className="mx-auto max-w-xl text-[15px] text-[color:var(--muted)]">
            {queue === null && progress !== null ? t("flash.howItWorks") : t("flash.loading")}
          </p>
          {queue === null && progress !== null && (
            <button
              type="button"
              onClick={startSession}
              className="neu-btn mt-5 inline-flex items-center gap-2 rounded-2xl bg-[color:var(--orange)] px-8 py-4 text-[16px] font-extrabold text-white"
            >
              <Play className="h-5 w-5" aria-hidden />
              {t("flash.startSession")}
            </button>
          )}
          {progress !== null && (
            <Link
              href="/glossary"
              className="neu-btn mt-4 inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-[14px] font-bold"
            >
              {t("glossary.title")}
            </Link>
          )}
        </section>
      ) : sessionDone ? (
        <section className="neu p-6 text-center sm:p-10">
          <Flag className="mx-auto h-10 w-10 text-[color:var(--orange)]" aria-hidden />
          <h2 className="mt-3 text-2xl font-extrabold">{t("flash.sessionDone")}</h2>
          <div className="mx-auto mt-5 grid max-w-md grid-cols-2 gap-3">
            <div className="neu-inset rounded-2xl p-4">
              <p className="text-3xl font-extrabold text-[color:var(--green,#16a34a)]">
                {results.remembered}
              </p>
              <p className="mt-1 text-[12px] font-semibold text-[color:var(--muted)]">
                {t("flash.rememberedCount")}
              </p>
            </div>
            <div className="neu-inset rounded-2xl p-4">
              <p className="text-3xl font-extrabold text-[color:var(--orange)]">{results.forgot}</p>
              <p className="mt-1 text-[12px] font-semibold text-[color:var(--muted)]">
                {t("flash.forgotCount")}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={startSession}
            className="neu-btn mt-6 inline-flex items-center gap-2 rounded-2xl bg-[color:var(--orange)] px-8 py-4 text-[16px] font-extrabold text-white"
          >
            <RotateCcw className="h-5 w-5" aria-hidden />
            {t("flash.startSession")}
          </button>
        </section>
      ) : (
        current && (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[14px] font-bold">
                {t("flash.card")} {index + 1}/{queue.length}
              </p>
              <button
                type="button"
                onClick={endSession}
                className="neu-btn inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-[13px] font-bold text-[color:var(--muted)]"
              >
                <Flag className="h-4 w-4" aria-hidden />
                {t("flash.endSession")}
              </button>
            </div>

            <div className="neu-inset mb-4 h-2.5 overflow-hidden rounded-full">
              <div
                className="h-full rounded-full bg-[color:var(--orange)] transition-all"
                style={{ width: `${(index / queue.length) * 100}%` }}
              />
            </div>

            {card(current)}

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => answer(false)}
                disabled={!flipped}
                className="neu-btn inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-[16px] font-extrabold text-[color:var(--orange)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <X className="h-5 w-5" aria-hidden />
                {t("flash.forgot")}
              </button>
              <button
                type="button"
                onClick={() => answer(true)}
                disabled={!flipped}
                className="neu-btn inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-[16px] font-extrabold text-[color:var(--green,#16a34a)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Check className="h-5 w-5" aria-hidden />
                {t("flash.remember")}
              </button>
            </div>
            {!flipped && (
              <p className="mt-3 text-center text-[13px] font-medium text-[color:var(--muted)]">
                {t("flash.flipFirst")}
              </p>
            )}
          </section>
        )
      )}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, ArrowRight, RotateCcw, Sparkles, Target,
  BookOpen, Dumbbell, Compass, CheckCircle2,
} from "lucide-react";
import { useLanguage, pick } from "@/lib/i18n";
import MetaSync from "@/components/MetaSync";

const STORAGE_KEY = "dnd-onboarding-path";

/* ------------------------------------------------------------------ */
/* Questions                                                           */
/* ------------------------------------------------------------------ */

const QUESTIONS: { id: string; options: string[] }[] = [
  { id: "level", options: ["new", "under1", "y1to3", "over3"] },
  { id: "position", options: ["guard", "wing", "big", "unknown"] },
  { id: "goal", options: ["shooting", "defense", "iq", "fitness", "coach"] },
  { id: "time", options: ["low", "mid", "high"] },
  { id: "weakness", options: ["finishing", "shooting", "defense1v1", "reading", "fitness"] },
  { id: "age", options: ["u12", "teens", "adult"] },
  { id: "where", options: ["school", "club", "casual", "alone"] },
  { id: "trained", options: ["yes", "no"] },
  { id: "horizon", options: ["month1", "month3", "season"] },
];

/* ------------------------------------------------------------------ */
/* Recommendation engine: simple additive scoring answer -> path       */
/* ------------------------------------------------------------------ */

const PATHS = [
  "beginner-basketball-path",
  "coach-fundamentals-path",
  "defensive-specialist-path",
  "defensive-stop-per-path",
  "elite-shooter-mastery-path",
  "guard-development-path",
  "pick-and-roll-mastery-path",
  "point-guard-mastery-path",
  "shooter-development-path",
  "youth-first-season-path",
] as const;

type PathSlug = (typeof PATHS)[number];

/* Answer key "question.option" -> path -> points */
const WEIGHTS: Record<string, Partial<Record<PathSlug, number>>> = {
  "level.new": { "beginner-basketball-path": 3, "youth-first-season-path": 3, "coach-fundamentals-path": 1, "shooter-development-path": 1 },
  "level.under1": { "beginner-basketball-path": 2, "shooter-development-path": 2, "guard-development-path": 1 },
  "level.y1to3": { "guard-development-path": 2, "shooter-development-path": 2, "defensive-specialist-path": 2, "pick-and-roll-mastery-path": 1, "point-guard-mastery-path": 1 },
  "level.over3": { "point-guard-mastery-path": 2, "elite-shooter-mastery-path": 2, "pick-and-roll-mastery-path": 2, "defensive-stop-per-path": 2 },

  "position.guard": { "guard-development-path": 3, "point-guard-mastery-path": 2, "shooter-development-path": 1 },
  "position.wing": { "shooter-development-path": 2, "defensive-stop-per-path": 2, "elite-shooter-mastery-path": 1 },
  "position.big": { "pick-and-roll-mastery-path": 3, "defensive-specialist-path": 1 },
  "position.unknown": { "beginner-basketball-path": 2, "youth-first-season-path": 2 },

  "goal.shooting": { "shooter-development-path": 3, "elite-shooter-mastery-path": 2, "beginner-basketball-path": 1 },
  "goal.defense": { "defensive-specialist-path": 3, "defensive-stop-per-path": 2 },
  "goal.iq": { "point-guard-mastery-path": 2, "pick-and-roll-mastery-path": 2, "coach-fundamentals-path": 1 },
  "goal.fitness": { "beginner-basketball-path": 2, "defensive-specialist-path": 1, "guard-development-path": 1 },
  "goal.coach": { "coach-fundamentals-path": 8 },

  "time.low": { "beginner-basketball-path": 2, "youth-first-season-path": 1 },
  "time.mid": { "shooter-development-path": 1, "guard-development-path": 1, "defensive-specialist-path": 1 },
  "time.high": { "elite-shooter-mastery-path": 2, "point-guard-mastery-path": 2, "pick-and-roll-mastery-path": 1 },

  "weakness.finishing": { "beginner-basketball-path": 2, "guard-development-path": 1 },
  "weakness.shooting": { "shooter-development-path": 3, "elite-shooter-mastery-path": 2 },
  "weakness.defense1v1": { "defensive-stop-per-path": 3, "defensive-specialist-path": 2 },
  "weakness.reading": { "point-guard-mastery-path": 2, "pick-and-roll-mastery-path": 2 },
  "weakness.fitness": { "defensive-specialist-path": 1, "guard-development-path": 1 },

  "age.u12": { "youth-first-season-path": 8 },
  "age.teens": { "beginner-basketball-path": 1, "shooter-development-path": 1 },
  "age.adult": { "point-guard-mastery-path": 1, "pick-and-roll-mastery-path": 1, "elite-shooter-mastery-path": 1 },

  "where.school": { "beginner-basketball-path": 1, "defensive-specialist-path": 1 },
  "where.club": { "guard-development-path": 1, "shooter-development-path": 1 },
  "where.casual": { "beginner-basketball-path": 2 },
  "where.alone": { "beginner-basketball-path": 2, "shooter-development-path": 1 },

  "trained.no": { "beginner-basketball-path": 3, "youth-first-season-path": 2 },
  "trained.yes": { "point-guard-mastery-path": 1, "pick-and-roll-mastery-path": 1, "defensive-specialist-path": 1, "elite-shooter-mastery-path": 1 },

  "horizon.month1": { "beginner-basketball-path": 1, "youth-first-season-path": 1, "shooter-development-path": 1 },
  "horizon.month3": { "guard-development-path": 1, "defensive-specialist-path": 1 },
  "horizon.season": { "point-guard-mastery-path": 1, "elite-shooter-mastery-path": 1, "pick-and-roll-mastery-path": 1, "coach-fundamentals-path": 1 },
};

export function recommendPath(answers: Record<string, string>): PathSlug {
  const scores = Object.fromEntries(PATHS.map((p) => [p, 0])) as Record<PathSlug, number>;
  for (const q of QUESTIONS) {
    const opt = answers[q.id];
    if (!opt) continue;
    const w = WEIGHTS[`${q.id}.${opt}`];
    if (!w) continue;
    for (const [slug, pts] of Object.entries(w)) {
      scores[slug as PathSlug] += pts ?? 0;
    }
  }
  let best: PathSlug = PATHS[0];
  for (const p of PATHS) {
    if (scores[p] > scores[best]) best = p;
  }
  return best;
}

/* ------------------------------------------------------------------ */
/* Weakness -> content suggestions (verified slugs)                    */
/* ------------------------------------------------------------------ */

interface Suggestion {
  kind: "article" | "drill" | "hub";
  url: string;
  title: { vi: string; en: string };
}

const WEAKNESS_CONTENT: Record<string, Suggestion[]> = {
  finishing: [
    { kind: "article", url: "/skills/finishing/basic-layup", title: { vi: "Layup cơ bản", en: "Basic Layup" } },
    { kind: "article", url: "/skills/finishing/contact-finishing", title: { vi: "Dứt điểm qua va chạm", en: "Finishing Through Contact" } },
    { kind: "drill", url: "/drills/mikan-drill", title: { vi: "Bài tập Mikan (Mikan drill)", en: "Mikan Drill" } },
  ],
  shooting: [
    { kind: "article", url: "/skills/shooting/shooting-mechanics", title: { vi: "Kỹ thuật ném rổ", en: "Shooting Mechanics" } },
    { kind: "article", url: "/skills/shooting/catch-and-shoot", title: { vi: "Bắt bóng ném ngay (catch and shoot)", en: "Catch & Shoot" } },
    { kind: "drill", url: "/drills/form-shooting", title: { vi: "Bài tập chỉnh form ném (form shooting)", en: "Form Shooting" } },
    { kind: "drill", url: "/drills/free-throw-routine", title: { vi: "Nghi thức ném phạt (free-throw routine)", en: "Free Throw Routine" } },
  ],
  defense1v1: [
    { kind: "article", url: "/defense/defensive-stance", title: { vi: "Tư thế phòng thủ", en: "Defensive Stance" } },
    { kind: "article", url: "/defense/on-ball-defense", title: { vi: "Phòng thủ kèm người có bóng", en: "On-Ball Defense" } },
    { kind: "drill", url: "/drills/closeout-drill", title: { vi: "Bài tập closeout kèm sát", en: "Closeout & Contest" } },
    { kind: "drill", url: "/drills/defensive-slide-ladder", title: { vi: "Thang slide phòng ngự", en: "Defensive Slide Ladder" } },
  ],
  reading: [
    { kind: "article", url: "/basketball-iq/decision-making", title: { vi: "Ra quyết định trên sân", en: "Decision Making" } },
    { kind: "article", url: "/pick-and-roll/pick-and-roll-basics", title: { vi: "Pick & roll cơ bản", en: "Pick & Roll Basics" } },
    { kind: "drill", url: "/drills/closeout-to-contest", title: { vi: "Closeout to contest", en: "Closeout to Contest" } },
  ],
  fitness: [
    { kind: "drill", url: "/drills/seventeen-sprint-shooting", title: { vi: "Ném sprint 17 điểm", en: "Seventeen Sprint Shooting" } },
    { kind: "drill", url: "/drills/defensive-slide-ladder", title: { vi: "Thang slide phòng ngự", en: "Defensive Slide Ladder" } },
    { kind: "hub", url: "/performance/athletic-performance", title: { vi: "Thể lực toàn diện (chuyên mục Performance)", en: "Athletic Performance hub" } },
  ],
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const KIND_ICON = { article: BookOpen, drill: Dumbbell, hub: Compass } as const;

export default function QuizClient() {
  const { lang, t } = useLanguage();
  const router = useRouter();
  const [step, setStep] = useState(-1); // -1 = intro, 0..8 = questions, 9 = result
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const total = QUESTIONS.length;
  const result = useMemo<PathSlug | null>(
    () => (step === total ? recommendPath(answers) : null),
    [step, answers, total]
  );

  const answer = (qIdx: number, opt: string) => {
    const q = QUESTIONS[qIdx];
    const next = { ...answers, [q.id]: opt };
    setAnswers(next);
    setStep(qIdx + 1);
  };

  const goBack = () => setStep((s) => Math.max(-1, s - 1));
  const retake = () => {
    setAnswers({});
    setStep(-1);
  };

  const startPath = () => {
    if (!result) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ pathSlug: result, answers, date: new Date().toISOString() })
      );
    } catch {}
    router.push(`/learning-paths/${result}`);
  };

  const reason = result
    ? t(`quiz.reason.${result}`)
        .replace("{goal}", t(`quiz.q.goal.${answers.goal}`))
        .replace("{weakness}", t(`quiz.q.weakness.${answers.weakness}`))
        .replace("{position}", t(`quiz.q.position.${answers.position}`))
    : "";

  const suggestions = answers.weakness ? WEAKNESS_CONTENT[answers.weakness] ?? [] : [];

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-10 pt-6 sm:px-6">
      <MetaSync title={t("quiz.meta.title")} description={t("quiz.meta.desc")} />

      {step === -1 && (
        <section className="neu p-8 text-center sm:p-12" aria-labelledby="quiz-h">
          <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[color:var(--orange-soft)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--orange)]">
            <Sparkles className="h-3.5 w-3.5" aria-hidden /> {t("quiz.kicker")}
          </p>
          <h1 id="quiz-h" className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {t("quiz.title")}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-[color:var(--muted)]">
            {t("quiz.subtitle")}
          </p>
          <button
            onClick={() => setStep(0)}
            className="neu-btn-primary mt-7 inline-flex items-center gap-2 px-8 py-3.5 text-[16px] font-bold"
          >
            {t("quiz.start")} <ArrowRight className="h-5 w-5" aria-hidden />
          </button>
        </section>
      )}

      {step >= 0 && step < total && (
        <section className="neu p-6 sm:p-8" aria-live="polite">
          {/* Progress */}
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between text-[13px] font-semibold text-[color:var(--muted)]">
              <span>{t("quiz.questionOf").replace("{n}", String(step + 1)).replace("{total}", String(total))}</span>
              <span>{Math.round(((step + 1) / total) * 100)}%</span>
            </div>
            <div
              className="neu-inset h-3 overflow-hidden rounded-full"
              role="progressbar"
              aria-label={t("quiz.progressLabel")}
              aria-valuenow={step + 1}
              aria-valuemin={1}
              aria-valuemax={total}
            >
              <div
                className="h-full rounded-full bg-[color:var(--orange)] transition-all duration-300"
                style={{ width: `${((step + 1) / total) * 100}%` }}
              />
            </div>
          </div>

          <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">
            {t(`quiz.q.${QUESTIONS[step].id}`)}
          </h2>

          <div className="mt-5 grid gap-3">
            {QUESTIONS[step].options.map((opt) => {
              const active = answers[QUESTIONS[step].id] === opt;
              return (
                <button
                  key={opt}
                  onClick={() => answer(step, opt)}
                  aria-pressed={active}
                  className={`flex items-center justify-between rounded-2xl px-5 py-4 text-left text-[15px] font-bold transition-all ${
                    active ? "neu-inset text-[color:var(--orange)]" : "neu-btn hover:text-[color:var(--orange)]"
                  }`}
                >
                  <span>{t(`quiz.q.${QUESTIONS[step].id}.${opt}`)}</span>
                  <ArrowRight className="h-4 w-4 shrink-0 opacity-60" aria-hidden />
                </button>
              );
            })}
          </div>

          <div className="mt-6">
            <button
              onClick={goBack}
              className="neu-btn inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-[color:var(--muted)]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden /> {t("quiz.back")}
            </button>
          </div>
        </section>
      )}

      {step === total && result && (
        <section aria-live="polite">
          <div className="neu relative overflow-hidden p-6 sm:p-10">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-[color:var(--orange)]" aria-hidden />
            <p className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--orange)]">
              <Target className="h-3.5 w-3.5" aria-hidden /> {t("quiz.resultEyebrow")}
            </p>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              {t("quiz.resultTitle")}
            </h2>

            <Link
              href={`/learning-paths/${result}`}
              className="neu-card mt-5 block p-5 transition-transform hover:-translate-y-0.5 sm:p-6"
            >
              <span className="text-[20px] font-extrabold tracking-tight text-[color:var(--orange)] sm:text-2xl">
                {t(`quiz.path.${result}.t`)}
              </span>
              <span className="mt-1 block text-sm font-semibold text-[color:var(--muted)]">
                /learning-paths/{result}
              </span>
            </Link>

            <div className="mt-5">
              <h3 className="text-[15px] font-extrabold">{t("quiz.why")}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-[color:var(--muted)]">{reason}</p>
            </div>

            {suggestions.length > 0 && (
              <div className="mt-6">
                <h3 className="text-[15px] font-extrabold">{t("quiz.suggested")}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-[color:var(--muted)]">
                  {t("quiz.suggestedDesc").replace("{weakness}", t(`quiz.q.weakness.${answers.weakness}`))}
                </p>
                <ul className="mt-3 space-y-2.5">
                  {suggestions.map((s) => {
                    const Icon = KIND_ICON[s.kind];
                    return (
                      <li key={s.url}>
                        <Link href={s.url} className="neu-btn flex items-center gap-3 px-4 py-3">
                          <span className="neu-sm flex h-9 w-9 shrink-0 items-center justify-center">
                            <Icon className="h-4.5 w-4.5 text-[color:var(--orange)]" aria-hidden />
                          </span>
                          <span className="flex-1">
                            <span className="block text-[14px] font-bold">{pick(lang, s.title.en, s.title.vi)}</span>
                            <span className="block text-[11px] font-semibold uppercase tracking-wide text-[color:var(--faint)]">
                              {t(`quiz.kind.${s.kind}`)}
                            </span>
                          </span>
                          <ArrowRight className="h-4 w-4 shrink-0 text-[color:var(--orange)]" aria-hidden />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={startPath}
                className="neu-btn-primary inline-flex items-center gap-2 px-7 py-3 text-[15px] font-bold"
              >
                {t("quiz.startPath")} <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
              <Link href="/learning-paths" className="neu-btn inline-flex items-center px-6 py-3 text-[15px] font-bold">
                {t("quiz.viewAllPaths")}
              </Link>
              <button
                onClick={retake}
                className="neu-btn inline-flex items-center gap-2 px-6 py-3 text-[15px] font-bold text-[color:var(--muted)]"
              >
                <RotateCcw className="h-4 w-4" aria-hidden /> {t("quiz.retake")}
              </button>
            </div>

            <p className="mt-4 flex items-start gap-2 text-[12px] leading-relaxed text-[color:var(--faint)]">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              {t("quiz.savedNote")}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

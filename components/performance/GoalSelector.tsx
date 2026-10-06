"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpFromLine, Zap, Dumbbell, Move, HeartPulse, Flame, ArrowRight } from "lucide-react";
import { useLanguage, pick } from "@/lib/i18n";
import { performanceUrl } from "@/lib/urls";
import type { PerformanceArticle } from "@/lib/types";

export type PerfGoal = "jump-higher" | "get-faster" | "get-stronger" | "move-better" | "conditioning" | "explosive";

const GOALS: { id: PerfGoal; icon: typeof Zap }[] = [
  { id: "jump-higher", icon: ArrowUpFromLine },
  { id: "get-faster", icon: Zap },
  { id: "get-stronger", icon: Dumbbell },
  { id: "move-better", icon: Move },
  { id: "conditioning", icon: HeartPulse },
  { id: "explosive", icon: Flame },
];

const GOAL_KEY: Record<PerfGoal, string> = {
  "jump-higher": "perf.goal.jumpHigher",
  "get-faster": "perf.goal.getFaster",
  "get-stronger": "perf.goal.getStronger",
  "move-better": "perf.goal.moveBetter",
  conditioning: "perf.goal.conditioning",
  explosive: "perf.goal.explosive",
};

interface GoalSelectorProps {
  articles: PerformanceArticle[];
  onSelect?: (goal: PerfGoal) => void;
}

export function GoalSelector({ articles, onSelect }: GoalSelectorProps) {
  const { lang, t } = useLanguage();
  const [goal, setGoal] = useState<PerfGoal | null>(null);
  const results = goal ? articles.filter((a) => a.goal.includes(goal)) : [];

  return (
    <section aria-label={t("perf.goalSelector.title")} className="neu p-6 sm:p-8" id="perf-goal-selector">
      <h2 className="text-xl font-extrabold sm:text-2xl">{t("perf.goalSelector.title")}</h2>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {GOALS.map(({ id, icon: Icon }) => {
          const active = goal === id;
          return (
            <button
              key={id}
              onClick={() => {
                setGoal(id);
                onSelect?.(id);
              }}
              aria-pressed={active}
              className={`flex min-h-[64px] items-center justify-center gap-2 rounded-2xl px-3 py-4 text-[14px] font-bold transition-all ${
                active ? "neu-inset text-[color:var(--orange)]" : "neu-btn"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              <span>{t(GOAL_KEY[id])}</span>
            </button>
          );
        })}
      </div>

      {goal && (
        <div className="mt-6">
          {results.length === 0 ? (
            <p className="text-sm text-[color:var(--muted)]">{t("common.notFoundDesc")}</p>
          ) : (
            <ul className="space-y-3">
              {results.map((a) => (
                <li key={a.id}>
                  <Link
                    href={performanceUrl(a.hub, a.slug)}
                    className="neu-sm group flex items-center gap-4 p-4"
                  >
                    <span className="flex-1">
                      <span className="block font-bold">{pick(lang, a.title, a.vi.title)}</span>
                      <span className="mt-0.5 line-clamp-2 block text-[13px] text-[color:var(--muted)]">
                        {pick(lang, a.description, a.vi.description)}
                      </span>
                    </span>
                    <ArrowRight
                      className="h-5 w-5 shrink-0 text-[color:var(--faint)] transition-transform group-hover:translate-x-1 group-hover:text-[color:var(--orange)]"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}

export default GoalSelector;

"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { getPathChecks, togglePathCheck } from "@/lib/storage";
import { useLanguage, pick } from "@/lib/i18n";
import type { LearningPath } from "@/lib/types";

export interface ResolvedStepArticle { slug: string; title: string; titleVi?: string; url: string }

export default function PathProgress({ path, stepArticles }: { path: LearningPath; stepArticles: ResolvedStepArticle[][] }) {
  const [checks, setChecks] = useState<string[]>([]);
  const { lang, t } = useLanguage();
  useEffect(() => { setChecks(getPathChecks(path.slug)); }, [path.slug]);

  const total = path.steps.reduce((n, s) => n + s.articles.length, 0);
  const done = checks.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const steps = path.steps.map((s, i) => ({
    ...s,
    title: pick(lang, s.title, path.vi?.steps[i]?.title),
    description: pick(lang, s.description, path.vi?.steps[i]?.description),
  }));

  return (
    <div>
      <div className="neu mb-6 flex items-center gap-4 p-4">
        <div className="neu-inset h-3 flex-1 overflow-hidden rounded-full" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Path progress">
          <div className="h-full rounded-full bg-[color:var(--orange)] transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-sm font-extrabold whitespace-nowrap">{done}/{total} · {pct}%</span>
      </div>

      <ol className="relative space-y-4">
        {steps.map((step, si) => (
          <li key={si} className="neu p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--orange)] text-sm font-extrabold text-white" aria-hidden>
                {si + 1}
              </span>
              <div>
                <h2 className="text-[17px] font-extrabold tracking-tight">{step.title}</h2>
                <p className="text-[13px] text-[color:var(--muted)]">{step.description}</p>
              </div>
              {si < path.steps.length - 1 && <ArrowRight className="ml-auto h-5 w-5 shrink-0 rotate-90 text-[color:var(--faint)]" aria-hidden />}
            </div>
            <ul className="mt-3 space-y-2">
              {stepArticles[si].map((a) => {
                const key = `${si}:${a.slug}`;
                const checked = checks.includes(key);
                return (
                  <li key={a.slug} className="flex items-center gap-2">
                    <button
                      onClick={() => setChecks(togglePathCheck(path.slug, si, a.slug))}
                      aria-pressed={checked} aria-label={checked ? `Mark ${a.title} as not done` : `Mark ${a.title} as done`}
                      className={`neu-btn flex h-8 w-8 shrink-0 items-center justify-center ${checked ? "text-[color:var(--orange)] ring-2 ring-[color:var(--orange)]" : "text-[color:var(--faint)]"}`}>
                      <Check className="h-4 w-4" aria-hidden />
                    </button>
                    <Link href={a.url} className={`neu-btn flex-1 px-4 py-2.5 text-left text-sm font-semibold ${checked ? "text-[color:var(--faint)] line-through" : ""}`}>
                      {pick(lang, a.title, a.titleVi)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ol>

      {pct === 100 && (
        <div className="neu mt-6 p-6 text-center">
          <p className="text-lg font-extrabold">{t("paths.completeTitle").replace("{t}", pick(lang, path.title, path.vi?.title))}</p>
          <p className="mt-1 text-sm text-[color:var(--muted)]">{t("paths.completeDesc")}</p>
          <Link href="/learning-paths" className="neu-btn mt-4 inline-block px-5 py-2.5 text-sm font-bold text-[color:var(--orange)]">
            {t("paths.browsePaths")}
          </Link>
        </div>
      )}
    </div>
  );
}

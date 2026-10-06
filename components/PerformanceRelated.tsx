"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage, pick } from "@/lib/i18n";
import type { PerfCrossLinks, PerfCrossLink } from "@/lib/content";

/**
 * "Continue Your Development" cross-linking block for performance article pages.
 * Server page usage:
 *   import { getPerformanceCrossLinks } from "@/lib/content";
 *   <PerformanceRelated links={getPerformanceCrossLinks(article)} />
 */
const GROUPS: { key: keyof PerfCrossLinks; labelKey: string }[] = [
  { key: "skills", labelKey: "perf.related.skill" },
  { key: "exercises", labelKey: "perf.related.exercise" },
  { key: "recovery", labelKey: "perf.related.recovery" },
  { key: "nutrition", labelKey: "perf.related.nutrition" },
  { key: "injuryPrevention", labelKey: "perf.related.injury" },
];

function LinkRow({ link }: { link: PerfCrossLink }) {
  const { lang } = useLanguage();
  return (
    <li>
      <Link
        href={link.url}
        className="neu-btn flex items-center justify-between gap-2 px-4 py-2.5 text-sm font-semibold"
      >
        <span className="line-clamp-2">{pick(lang, link.title, link.titleVi)}</span>
        <ArrowRight className="h-4 w-4 shrink-0 text-[color:var(--orange)]" aria-hidden />
      </Link>
    </li>
  );
}

export default function PerformanceRelated({ links }: { links: PerfCrossLinks }) {
  const { t } = useLanguage();
  const groups = GROUPS.map((g) => ({ ...g, items: links[g.key] })).filter(
    (g) => g.items.length > 0
  );
  if (!groups.length) return null;
  return (
    <section className="neu p-6 sm:p-8" aria-labelledby="perf-related-h">
      <h2 id="perf-related-h" className="text-xl font-extrabold tracking-tight sm:text-2xl">
        {t("perf.continueDevelopment")}
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((g) => (
          <div key={g.key} className="neu-inset p-4">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--orange)]">
              {t(g.labelKey)}
            </p>
            <ul className="space-y-2">
              {g.items.map((l) => (
                <LinkRow key={l.url} link={l} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

"use client";
import Link from "next/link";
import { Clock, Package, Lightbulb } from "lucide-react";
import type { Workout } from "@/lib/types";
import { Breadcrumbs, LevelBadge } from "@/components/ui";
import WorkoutChecklist from "@/components/WorkoutChecklist";
import FavoriteButton from "@/components/FavoriteButton";
import { useLanguage, pick } from "@/lib/i18n";

export default function WorkoutView({ workout }: { workout: Workout }) {
  const { lang, t } = useLanguage();
  const v = lang === "vi" ? workout.vi : undefined;
  const title = pick(lang, workout.title, v?.title);
  const description = pick(lang, workout.description, v?.description);
  const url = `/workouts/${workout.slug}`;

  return (
    <div className="mx-auto max-w-3xl pb-6">
      <Breadcrumbs items={[
        { label: t("mobile.home"), href: "/" },
        { label: t("workouts.title"), href: "/workouts" },
        { label: title },
      ]} />

      <header className="neu mb-6 p-6 sm:p-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--orange-soft)] px-2.5 py-1 text-[11px] font-bold text-[color:var(--orange)]">
            <Clock className="h-3.5 w-3.5" aria-hidden /> {workout.durationMin} {t("common.minutes")}
          </span>
          <LevelBadge level={workout.level} />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-3 text-[16px] text-[color:var(--muted)]">{description}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-[12px] font-semibold text-[color:var(--faint)]">
          <span className="inline-flex items-center gap-1"><Package className="h-3.5 w-3.5" aria-hidden /> {pick(lang, workout.equipment, v?.equipment).join(" · ")}</span>
          <span>{t("workouts.focus")}: {pick(lang, workout.focus, v?.focus).join(" · ")}</span>
        </div>
        <div className="mt-4"><FavoriteButton item={{ type: "workout", id: workout.slug, title, url, ts: 0 }} /></div>
      </header>

      <WorkoutChecklist workout={workout} />

      <section className="neu mt-6 p-6" aria-labelledby="tips-h">
        <h2 id="tips-h" className="mb-3 flex items-center gap-2 text-lg font-extrabold">
          <Lightbulb className="h-5 w-5 text-[color:var(--orange)]" aria-hidden /> {t("workouts.tips")}
        </h2>
        <ul className="list-disc space-y-1.5 pl-5 text-[14px] text-[color:var(--muted)]">
          {pick(lang, workout.tips, v?.tips).map((tip, i) => <li key={i}>{tip}</li>)}
        </ul>
      </section>

      <p className="mt-8 px-1 text-[12px]">
        <Link href="/workouts" className="font-semibold text-[color:var(--orange)]">← {t("workouts.backTo")}</Link>
      </p>
    </div>
  );
}

"use client";
import Link from "next/link";
import { ArrowRight, Clock, Users, Route, Dumbbell, Timer, Play } from "lucide-react";
import type { ArticleCardData, DrillCardData, LearningPath, Workout, FilmVideo } from "@/lib/types";
import { articleUrl } from "@/lib/urls";
import { LevelBadge, ReadTime } from "./ui";
import { useLanguage, pick } from "@/lib/i18n";

export function KnowledgeCard({ article }: { article: ArticleCardData }) {
  const { lang, t } = useLanguage();
  return (
    <Link href={articleUrl(article)} className="neu-card flex flex-col p-5">
      <div className="mb-2 flex items-center justify-between gap-2">
        <LevelBadge level={article.level} />
        <ReadTime minutes={article.readTime} />
      </div>
      <h3 className="text-[17px] font-bold leading-snug tracking-tight">{pick(lang, article.title, article.vi?.title)}</h3>
      <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-[color:var(--muted)]">{pick(lang, article.description, article.vi?.description)}</p>
      <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-bold text-[color:var(--orange)]">
        {t("cards.learnConcept")} <ArrowRight className="h-4 w-4" aria-hidden />
      </span>
    </Link>
  );
}

export function DrillCard({ drill }: { drill: DrillCardData }) {
  const { lang, t } = useLanguage();
  return (
    <Link href={`/drills/${drill.slug}`} className="neu-card flex flex-col p-5">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="rounded-full bg-[color:var(--orange-soft)] px-2.5 py-1 text-[11px] font-bold text-[color:var(--orange)]">{drill.skill}</span>
        <LevelBadge level={drill.level} />
      </div>
      <h3 className="text-[17px] font-bold leading-snug tracking-tight">{pick(lang, drill.title, drill.vi?.title)}</h3>
      <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-[color:var(--muted)]">{pick(lang, drill.description, drill.vi?.description)}</p>
      <div className="mt-3 flex items-center gap-4 text-[12px] font-medium text-[color:var(--muted)]">
        <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{drill.durationMin} {t("common.minutes")}</span>
        <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" />{pick(lang, drill.players, drill.vi?.players)}</span>
        <span className="inline-flex items-center gap-1"><Dumbbell className="h-3.5 w-3.5" />{t(`drills.intensity.${drill.intensity}`)}</span>
      </div>
    </Link>
  );
}

export function PathCard({ path, articleCount }: { path: LearningPath; articleCount: number }) {
  const { lang, t } = useLanguage();
  return (
    <Link href={`/learning-paths/${path.slug}`} className="neu-card flex flex-col p-5">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--orange-soft)] px-2.5 py-1 text-[11px] font-bold text-[color:var(--orange)]">
          <Route className="h-3.5 w-3.5" /> {path.steps.length} {t("cards.levels")}
        </span>
        <LevelBadge level={path.level} />
      </div>
      <h3 className="text-[17px] font-bold leading-snug tracking-tight">{pick(lang, path.title, path.vi?.title)}</h3>
      <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-[color:var(--muted)]">{pick(lang, path.description, path.vi?.description)}</p>
      <div className="mt-3 flex items-center gap-1.5" aria-hidden>
        {path.steps.slice(0, 6).map((_, i) => (
          <span key={i} className="flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--surface-2)] text-[10px] font-bold text-[color:var(--muted)]">{i + 1}</span>
        ))}
        {path.steps.length > 6 && <span className="text-[11px] font-bold text-[color:var(--faint)]">+{path.steps.length - 6}</span>}
      </div>
      <p className="mt-2 text-[12px] text-[color:var(--faint)]">{articleCount} {t("cards.concepts")} · {pick(lang, path.audience, path.vi?.audience)}</p>
    </Link>
  );
}

export function WorkoutCard({ workout }: { workout: Workout }) {
  const { lang, t } = useLanguage();
  return (
    <Link href={`/workouts/${workout.slug}`} className="neu-card flex flex-col p-5">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--orange-soft)] px-2.5 py-1 text-[11px] font-bold text-[color:var(--orange)]">
          <Timer className="h-3.5 w-3.5" /> {workout.durationMin} {t("common.minutes")}
        </span>
        <LevelBadge level={workout.level} />
      </div>
      <h3 className="text-[17px] font-bold leading-snug tracking-tight">{pick(lang, workout.title, workout.vi?.title)}</h3>
      <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-[color:var(--muted)]">{pick(lang, workout.description, workout.vi?.description)}</p>
      <p className="mt-3 text-[12px] font-medium text-[color:var(--muted)]">{workout.items.length} {t("cards.exercises")}</p>
    </Link>
  );
}

export function FilmCard({ film }: { film: FilmVideo }) {
  const { lang } = useLanguage();
  return (
    <Link href={`/film-room#film-${film.id}`} className="neu-card block overflow-hidden">
      <span className="relative block aspect-video">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`https://i.ytimg.com/vi/${film.youtubeId}/hqdefault.jpg`} alt="" loading="lazy" className="h-full w-full object-cover" />
        <span className="absolute inset-0 flex items-center justify-center bg-black/20">
          <span className="neu-sm flex h-11 w-11 items-center justify-center">
            <Play className="h-5 w-5 fill-[color:var(--orange)] text-[color:var(--orange)]" aria-hidden />
          </span>
        </span>
        <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-1.5 py-0.5 text-[11px] font-semibold text-white">{film.duration}</span>
      </span>
      <span className="block p-4">
        <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[color:var(--orange)]">{pick(lang, film.category, film.vi?.category)} · {film.source}</span>
        <span className="block text-[15px] font-bold leading-snug">{pick(lang, film.title, film.vi?.title)}</span>
      </span>
    </Link>
  );
}

export function ExploreCard({ href, icon: Icon, title, description }: {
  href: string; icon: typeof Dumbbell; title: string; description: string;
}) {
  return (
    <Link href={href} className="neu-card flex items-start gap-4 p-5">
      <span className="neu-sm flex h-12 w-12 shrink-0 items-center justify-center">
        <Icon className="h-6 w-6 text-[color:var(--orange)]" aria-hidden />
      </span>
      <span>
        <span className="block text-[16px] font-bold tracking-tight">{title}</span>
        <span className="mt-0.5 block text-[13px] leading-relaxed text-[color:var(--muted)]">{description}</span>
      </span>
    </Link>
  );
}

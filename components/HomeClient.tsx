"use client";
import Link from "next/link";
import {
  Volleyball, Target, Brain, Network, Dumbbell, Clapperboard, Shield, Zap,
  ClipboardList, ArrowRight, Sparkles, Flame,
} from "lucide-react";
import type { ArticleCardData, DrillCardData, LearningPath, FilmVideo, CourtVisionCard as CourtVisionCardT } from "@/lib/types";
import { articleUrl } from "@/lib/urls";
import { useLanguage, pick } from "@/lib/i18n";
import CourtDiagram from "@/components/CourtDiagram";
import CourtVisionCard from "@/components/CourtVisionCard";
import HeroSearch from "@/components/HeroSearch";
import { SectionTitle } from "@/components/ui";
import { KnowledgeCard, DrillCard, PathCard, FilmCard, ExploreCard } from "@/components/cards";

const EXPLORE: { href: string; icon: typeof Dumbbell; titleKey: string; descKey: string }[] = [
  { href: "/skills", icon: Volleyball, titleKey: "home.explore.skills.t", descKey: "home.explore.skills.d" },
  { href: "/skills/shooting", icon: Target, titleKey: "home.explore.shooting.t", descKey: "home.explore.shooting.d" },
  { href: "/basketball-iq", icon: Brain, titleKey: "home.explore.iq.t", descKey: "home.explore.iq.d" },
  { href: "/tactics", icon: Network, titleKey: "home.explore.tactics.t", descKey: "home.explore.tactics.d" },
  { href: "/drills", icon: Dumbbell, titleKey: "home.explore.drills.t", descKey: "home.explore.drills.d" },
  { href: "/film-room", icon: Clapperboard, titleKey: "home.explore.film.t", descKey: "home.explore.film.d" },
  { href: "/defense", icon: Shield, titleKey: "home.explore.defense.t", descKey: "home.explore.defense.d" },
  { href: "/offense", icon: Zap, titleKey: "home.explore.offense.t", descKey: "home.explore.offense.d" },
  { href: "/coaching", icon: ClipboardList, titleKey: "home.explore.coaching.t", descKey: "home.explore.coaching.d" },
];

const QUICK_LEARN: { slug: string; labelKey: string }[] = [
  { slug: "drop-coverage-defense", labelKey: "home.quick.drop" },
  { slug: "spain-pick-and-roll", labelKey: "home.quick.spain" },
  { slug: "ice-defense", labelKey: "home.quick.ice" },
  { slug: "ghost-screen", labelKey: "home.quick.ghost" },
];

const HERO_DIAGRAM = {
  title: "Side pick & roll — live reads, not set plays",
  offense: [
    { label: "O1", x: 66, y: 72 }, { label: "O5", x: 60, y: 60 },
    { label: "O2", x: 88, y: 22 }, { label: "O3", x: 14, y: 44 }, { label: "O4", x: 34, y: 14 },
  ],
  defense: [
    { label: "X1", x: 71, y: 66 }, { label: "X5", x: 60, y: 51 },
    { label: "X2", x: 82, y: 27 }, { label: "X3", x: 21, y: 41 },
  ],
  ball: "O1",
  screens: [{ x: 63, y: 63 }],
  passes: [{ from: "O1", to: "O2" }],
  moves: [{ from: "O5", to: "O4", kind: "cut" as const }],
};

export interface HomeData {
  articleCount: number;
  concept: ArticleCardData | null | undefined;
  popular: ArticleCardData[];
  paths: { path: LearningPath; articleCount: number }[];
  drills: DrillCardData[];
  films: FilmVideo[];
  coaches: ArticleCardData[];
  latest: ArticleCardData[];
  vision: { card: CourtVisionCardT; learnUrl: string }[];
  workoutsCount: number;
  quickLearn: { slug: string; url: string }[];
}

export default function HomeClient({ data }: { data: HomeData }) {
  const { lang, t } = useLanguage();
  const { concept, popular, paths, drills, films, coaches, latest, vision, workoutsCount, quickLearn } = data;

  return (
    <div className="space-y-14 pb-6">
      {/* HERO */}
      <section className="neu grid gap-6 p-6 sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:items-center" aria-labelledby="hero-h">
        <div>
          <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[color:var(--orange-soft)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--orange)]">
            <Sparkles className="h-3.5 w-3.5" aria-hidden /> {t("home.hero.kicker2")}
          </p>
          <h1 id="hero-h" className="text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
            {t("home.hero.title1")} <span className="text-[color:var(--orange)]">{t("home.hero.titleBasketball")}</span>
          </h1>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-[color:var(--muted)]">
            {t("home.hero.subtitle")}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/learn" className="neu-btn inline-flex items-center gap-2 bg-[color:var(--orange)] px-6 py-3 text-[15px] font-bold text-white">
              {t("home.hero.startLearning")} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/skills" className="neu-btn inline-flex items-center px-6 py-3 text-[15px] font-bold">
              {t("home.hero.exploreSkills")}
            </Link>
          </div>
          <div className="mt-6 flex gap-6 text-sm">
            <span><strong className="text-lg font-extrabold">{data.articleCount}+</strong> <span className="text-[color:var(--muted)]">{t("home.stats.concepts")}</span></span>
            <span><strong className="text-lg font-extrabold">{drills.length}</strong> <span className="text-[color:var(--muted)]">{t("home.stats.drills")}</span></span>
            <span><strong className="text-lg font-extrabold">{paths.length}</strong> <span className="text-[color:var(--muted)]">{t("home.stats.paths")}</span></span>
          </div>
        </div>
        <div className="neu-inset p-4 sm:p-5">
          <CourtDiagram diagram={HERO_DIAGRAM} />
        </div>
      </section>

      {/* SEARCH */}
      <section aria-label="Search basketball knowledge">
        <HeroSearch />
      </section>

      {/* EXPLORE */}
      <section aria-labelledby="explore-h">
        <div id="explore-h"><SectionTitle eyebrow={t("home.explore.eyebrow")} title={t("home.explore.title")} description={t("home.explore.desc")} /></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EXPLORE.map((e) => <ExploreCard key={e.href} href={e.href} icon={e.icon} title={t(e.titleKey)} description={t(e.descKey)} />)}
        </div>
      </section>

      {/* CONCEPT OF THE DAY + QUICK LEARN */}
      <section className="grid gap-4 lg:grid-cols-5" aria-label="Daily learning">
        <div className="neu relative overflow-hidden p-6 sm:p-8 lg:col-span-3">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-[color:var(--orange)]" aria-hidden />
          <p className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--orange)]">
            <Flame className="h-3.5 w-3.5" aria-hidden /> {t("home.concept.title")}
          </p>
          {concept && (
            <>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{pick(lang, concept.title, concept.vi?.title)}</h2>
              <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-[color:var(--muted)]">{pick(lang, concept.description, concept.vi?.description)}</p>
              <Link href={articleUrl(concept)} className="neu-btn mt-5 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-[color:var(--orange)]">
                {t("cards.learnConcept")} <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </>
          )}
        </div>
        <div className="neu p-6 sm:p-8 lg:col-span-2">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--orange)]">⚡ {t("home.quick.eyebrow")}</p>
          <h2 className="text-xl font-extrabold tracking-tight">{t("home.quick.title")}</h2>
          <ul className="mt-3 space-y-2">
            {quickLearn.map((q, i) => (
              <li key={q.slug}>
                <Link href={q.url} className="neu-btn flex items-center justify-between px-4 py-2.5 text-sm font-semibold">
                  {t(QUICK_LEARN[i].labelKey)} <ArrowRight className="h-4 w-4 text-[color:var(--orange)]" aria-hidden />
                </Link>
              </li>
            ))}
            <li>
              <Link href="/glossary#term-low-man" className="neu-btn flex items-center justify-between px-4 py-2.5 text-sm font-semibold">
                {t("home.quick.lowman")} <ArrowRight className="h-4 w-4 text-[color:var(--orange)]" aria-hidden />
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* POPULAR CONCEPTS */}
      <section aria-labelledby="popular-h">
        <div id="popular-h"><SectionTitle eyebrow={t("home.popular.eyebrow")} title={t("home.popular.title")} href="/learn" /></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((a) => <KnowledgeCard key={a.slug} article={a} />)}
        </div>
      </section>

      {/* COURT VISION */}
      <section aria-labelledby="vision-h">
        <div id="vision-h"><SectionTitle eyebrow={t("home.vision.eyebrow")} title={t("home.courtVision.title")} description={t("home.vision.desc")} /></div>
        <div className="grid gap-4 md:grid-cols-2">
          {vision.map(({ card, learnUrl }) => <CourtVisionCard key={card.id} card={card} learnUrl={learnUrl} />)}
        </div>
      </section>

      {/* LEARNING PATHS */}
      <section aria-labelledby="paths-h">
        <div id="paths-h"><SectionTitle eyebrow={t("home.paths.eyebrow")} title={t("home.paths.title")} description={t("home.paths.subtitle")} href="/learning-paths" /></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {paths.map(({ path, articleCount }) => <PathCard key={path.slug} path={path} articleCount={articleCount} />)}
        </div>
      </section>

      {/* DRILLS */}
      <section aria-labelledby="drills-h">
        <div id="drills-h"><SectionTitle eyebrow={t("home.drills.eyebrow")} title={t("home.drills.title")} description={t("home.drills.desc")} href="/drills" /></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {drills.map((d) => <DrillCard key={d.slug} drill={d} />)}
        </div>
      </section>

      {/* FILM ROOM */}
      <section aria-labelledby="film-h">
        <div id="film-h"><SectionTitle eyebrow={t("home.film.eyebrow")} title={t("home.film.title")} description={t("home.film.desc")} href="/film-room" /></div>
        <div className="grid gap-4 sm:grid-cols-3">
          {films.map((f) => <FilmCard key={f.id} film={f} />)}
        </div>
      </section>

      {/* COACHES */}
      <section aria-labelledby="coach-h">
        <div id="coach-h"><SectionTitle eyebrow={t("home.coach.eyebrow")} title={t("home.coach.title")} description={t("home.coach.desc")} href="/coaching" /></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {coaches.map((a) => <KnowledgeCard key={a.slug} article={a} />)}
        </div>
      </section>

      {/* LATEST */}
      <section aria-labelledby="latest-h">
        <div id="latest-h"><SectionTitle eyebrow={t("home.latest.eyebrow")} title={t("home.latest.title")} href="/learn" /></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {latest.map((a) => <KnowledgeCard key={a.slug} article={a} />)}
        </div>
      </section>

      {/* WORKOUTS CTA */}
      <section className="neu p-6 text-center sm:p-10" aria-label="Workouts">
        <h2 className="text-2xl font-extrabold tracking-tight">{t("home.workoutsCta.title")}</h2>
        <p className="mx-auto mt-2 max-w-xl text-[15px] text-[color:var(--muted)]">
          {t("home.workoutsCta.desc").replace("{n}", String(workoutsCount))}
        </p>
        <Link href="/workouts" className="neu-btn mt-5 inline-flex items-center gap-2 bg-[color:var(--orange)] px-6 py-3 text-[15px] font-bold text-white">
          {t("home.workoutsCta.button")} <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </section>
    </div>
  );
}

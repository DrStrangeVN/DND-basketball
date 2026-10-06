import Link from "next/link";
import {
  Volleyball, Target, Brain, Network, Dumbbell, Clapperboard, Shield, Zap,
  ClipboardList, ArrowRight, Sparkles, Flame,
} from "lucide-react";
import {
  getAllArticles, getArticleBySlug, getAllDrills, getAllPaths, getAllWorkouts,
  getFilms, getCourtVision, conceptOfDay, latestArticles, articleUrl,
} from "@/lib/content";
import CourtDiagram from "@/components/CourtDiagram";
import CourtVisionCard from "@/components/CourtVisionCard";
import HeroSearch from "@/components/HeroSearch";
import { SectionTitle } from "@/components/ui";
import { KnowledgeCard, DrillCard, PathCard, FilmCard, ExploreCard } from "@/components/cards";

const EXPLORE = [
  { href: "/skills", icon: Volleyball, title: "Skills", description: "Ball handling, shooting, finishing, passing and footwork." },
  { href: "/skills/shooting", icon: Target, title: "Shooting", description: "Mechanics, footwork and every shot type." },
  { href: "/basketball-iq", icon: Brain, title: "Basketball IQ", description: "Reads, timing, advantages and decision making." },
  { href: "/tactics", icon: Network, title: "Tactics", description: "Pick & roll, actions, offense and defensive systems." },
  { href: "/drills", icon: Dumbbell, title: "Drills", description: "Filterable drill library with coaching points." },
  { href: "/film-room", icon: Clapperboard, title: "Film Room", description: "Curated YouTube breakdowns, lazy-loaded." },
  { href: "/defense", icon: Shield, title: "Defense", description: "Stance, help, ball-screen coverages and zones." },
  { href: "/offense", icon: Zap, title: "Offense", description: "Spacing, motion, 5-out and drive & kick." },
  { href: "/coaching", icon: ClipboardList, title: "Coaching", description: "Practice planning, teaching and team culture." },
];

const POPULAR = ["pick-and-roll-basics", "shooting-mechanics", "spacing-basics", "zone-2-3", "crossover", "runner-floater", "motion-offense", "transition-offense"];
const QUICK_LEARN = [
  { slug: "drop-coverage-defense", label: "What is Drop Coverage?" },
  { slug: "spain-pick-and-roll", label: "What is Spain Pick & Roll?" },
  { slug: "ice-defense", label: "What is ICE Defense?" },
  { slug: "ghost-screen", label: "What is a Ghost Screen?" },
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

export default function Home() {
  const articles = getAllArticles();
  const concept = conceptOfDay();
  const popular = POPULAR.map(getArticleBySlug).filter((a): a is NonNullable<typeof a> => Boolean(a));
  const paths = getAllPaths().slice(0, 4);
  const drills = getAllDrills().slice(0, 6);
  const films = getFilms().slice(0, 3);
  const coaches = articles.filter((a) => a.hub === "coaching").slice(0, 4);
  const latest = latestArticles(4);
  const vision = getCourtVision();

  return (
    <div className="space-y-14 pb-6">
      {/* HERO */}
      <section className="neu grid gap-6 p-6 sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:items-center" aria-labelledby="hero-h">
        <div>
          <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[color:var(--orange-soft)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--orange)]">
            <Sparkles className="h-3.5 w-3.5" aria-hidden /> The Complete Basketball Knowledge Hub
          </p>
          <h1 id="hero-h" className="text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
            Master the Game of <span className="text-[color:var(--orange)]">Basketball</span>
          </h1>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-[color:var(--muted)]">
            Learn skills, drills, tactics, basketball IQ and coaching concepts — from fundamentals to advanced basketball.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/learn" className="neu-btn inline-flex items-center gap-2 bg-[color:var(--orange)] px-6 py-3 text-[15px] font-bold text-white">
              Start Learning <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/skills" className="neu-btn inline-flex items-center px-6 py-3 text-[15px] font-bold">
              Explore Skills
            </Link>
          </div>
          <div className="mt-6 flex gap-6 text-sm">
            <span><strong className="text-lg font-extrabold">{articles.length}+</strong> <span className="text-[color:var(--muted)]">concepts</span></span>
            <span><strong className="text-lg font-extrabold">{getAllDrills().length}</strong> <span className="text-[color:var(--muted)]">drills</span></span>
            <span><strong className="text-lg font-extrabold">{getAllPaths().length}</strong> <span className="text-[color:var(--muted)]">learning paths</span></span>
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
        <div id="explore-h"><SectionTitle eyebrow="Knowledge Hubs" title="Explore Basketball" description="Nine hubs. One game. Pick where to start — every path connects." /></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EXPLORE.map((e) => <ExploreCard key={e.href} {...e} />)}
        </div>
      </section>

      {/* CONCEPT OF THE DAY + QUICK LEARN */}
      <section className="grid gap-4 lg:grid-cols-5" aria-label="Daily learning">
        <div className="neu relative overflow-hidden p-6 sm:p-8 lg:col-span-3">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-[color:var(--orange)]" aria-hidden />
          <p className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--orange)]">
            <Flame className="h-3.5 w-3.5" aria-hidden /> Basketball Concept of the Day
          </p>
          {concept && (
            <>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{concept.title}</h2>
              <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-[color:var(--muted)]">{concept.description}</p>
              <Link href={articleUrl(concept)} className="neu-btn mt-5 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-[color:var(--orange)]">
                Learn Concept <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </>
          )}
        </div>
        <div className="neu p-6 sm:p-8 lg:col-span-2">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--orange)]">⚡ Learn in 5 Minutes</p>
          <h2 className="text-xl font-extrabold tracking-tight">Quick Learn</h2>
          <ul className="mt-3 space-y-2">
            {QUICK_LEARN.map((q) => {
              const a = getArticleBySlug(q.slug);
              if (!a) return null;
              return (
                <li key={q.slug}>
                  <Link href={articleUrl(a)} className="neu-btn flex items-center justify-between px-4 py-2.5 text-sm font-semibold">
                    {q.label} <ArrowRight className="h-4 w-4 text-[color:var(--orange)]" aria-hidden />
                  </Link>
                </li>
              );
            })}
            <li>
              <Link href="/glossary#term-low-man" className="neu-btn flex items-center justify-between px-4 py-2.5 text-sm font-semibold">
                What is the Low Man? <ArrowRight className="h-4 w-4 text-[color:var(--orange)]" aria-hidden />
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* POPULAR CONCEPTS */}
      <section aria-labelledby="popular-h">
        <div id="popular-h"><SectionTitle eyebrow="Start here" title="Popular Concepts" href="/learn" /></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((a) => <KnowledgeCard key={a.slug} article={a} />)}
        </div>
      </section>

      {/* COURT VISION */}
      <section aria-labelledby="vision-h">
        <div id="vision-h"><SectionTitle eyebrow="Basketball IQ" title="Court Vision" description="What should you do here? Read the situation, pick your answer, then reveal the read." /></div>
        <div className="grid gap-4 md:grid-cols-2">
          {vision.map((c) => {
            const a = getArticleBySlug(c.relatedArticle);
            return <CourtVisionCard key={c.id} card={c} learnUrl={a ? articleUrl(a) : "/basketball-iq"} />;
          })}
        </div>
      </section>

      {/* LEARNING PATHS */}
      <section aria-labelledby="paths-h">
        <div id="paths-h"><SectionTitle eyebrow="Structured progress" title="Learning Paths" description="Stop browsing randomly. Follow a path from fundamentals to mastery." href="/learning-paths" /></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {paths.map((p) => (
            <PathCard key={p.slug} path={p} articleCount={p.steps.reduce((n, s) => n + s.articles.length, 0)} />
          ))}
        </div>
      </section>

      {/* DRILLS */}
      <section aria-labelledby="drills-h">
        <div id="drills-h"><SectionTitle eyebrow="Train" title="Drill Library" description="Filter by skill, level, players, equipment and duration." href="/drills" /></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {drills.map((d) => <DrillCard key={d.slug} drill={d} />)}
        </div>
      </section>

      {/* FILM ROOM */}
      <section aria-labelledby="film-h">
        <div id="film-h"><SectionTitle eyebrow="Watch & learn" title="Film Room" description="Curated public breakdowns — nothing hosted here, everything lazy-loaded." href="/film-room" /></div>
        <div className="grid gap-4 sm:grid-cols-3">
          {films.map((f) => <FilmCard key={f.id} film={f} />)}
        </div>
      </section>

      {/* COACHES */}
      <section aria-labelledby="coach-h">
        <div id="coach-h"><SectionTitle eyebrow="For coaches" title="Coaches Corner" description="Practice planning, teaching, film study and culture." href="/coaching" /></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {coaches.map((a) => <KnowledgeCard key={a.slug} article={a} />)}
        </div>
      </section>

      {/* LATEST */}
      <section aria-labelledby="latest-h">
        <div id="latest-h"><SectionTitle eyebrow="Fresh knowledge" title="Latest Knowledge" href="/learn" /></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {latest.map((a) => <KnowledgeCard key={a.slug} article={a} />)}
        </div>
      </section>

      {/* WORKOUTS CTA */}
      <section className="neu p-6 text-center sm:p-10" aria-label="Workouts">
        <h2 className="text-2xl font-extrabold tracking-tight">Ready to train? Follow a workout checklist.</h2>
        <p className="mx-auto mt-2 max-w-xl text-[15px] text-[color:var(--muted)]">
          {getAllWorkouts().length} structured workouts with checklists — from 10-minute ball handling to game-day routines.
        </p>
        <Link href="/workouts" className="neu-btn mt-5 inline-flex items-center gap-2 bg-[color:var(--orange)] px-6 py-3 text-[15px] font-bold text-white">
          Browse Workouts <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </section>
    </div>
  );
}

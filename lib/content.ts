import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(process.cwd(), "content");

import type {
  Article, Drill, Workout, WorkoutItem, LearningPath, PathStep,
  GlossaryTerm, FilmVideo, CourtVisionCard, ArticleStep,
  PerformanceArticle, PerfHubId, PerfStep,
} from "./types";
import { articleUrl, performanceUrl } from "./urls";
export { articleUrl, performanceUrl };
export type {
  Article, Drill, Workout, WorkoutItem, LearningPath, PathStep,
  GlossaryTerm, FilmVideo, CourtVisionCard, ArticleStep,
  PerformanceArticle, PerfHubId, PerfStep,
};
export { PERF_HUBS } from "./types";


const cache = new Map<string, unknown>();
function loadDir<T>(dir: string): T[] {
  const key = `dir:${dir}`;
  if (!cache.has(key)) {
    const d = join(ROOT, dir);
    if (!existsSync(d)) return [];
    const items = readdirSync(d)
      .filter((f) => f.endsWith(".json"))
      .map((f) => JSON.parse(readFileSync(join(d, f), "utf8")) as T);
    cache.set(key, items);
  }
  return cache.get(key) as T[];
}
function loadFile<T>(file: string): T {
  const key = `file:${file}`;
  if (!cache.has(key)) cache.set(key, JSON.parse(readFileSync(join(ROOT, file), "utf8")) as T);
  return cache.get(key) as T;
}

export const getAllArticles = () => loadDir<Article>("articles");
export const getAllDrills = () => loadDir<Drill>("drills");
export const getAllWorkouts = () => loadDir<Workout>("workouts");
export const getAllPaths = () => loadDir<LearningPath>("paths");
export const getGlossary = (): GlossaryTerm[] => existsSync(join(ROOT, "glossary.json")) ? loadFile<GlossaryTerm[]>("glossary.json") : [];
export const getFilms = (): FilmVideo[] => existsSync(join(ROOT, "film.json")) ? loadFile<FilmVideo[]>("film.json") : [];
export const getCourtVision = (): CourtVisionCard[] => existsSync(join(ROOT, "court-vision.json")) ? loadFile<CourtVisionCard[]>("court-vision.json") : [];

export function getArticleBySlug(slug: string): Article | undefined {
  return getAllArticles().find((a) => a.slug === slug);
}
export function getArticlesByHub(hub: string): Article[] {
  return getAllArticles().filter((a) => a.hub === hub);
}
export function getArticlesByGroup(hub: string, subcategory: string): Article[] {
  return getAllArticles().filter((a) => a.hub === hub && a.subcategory === subcategory);
}
export function getDrillBySlug(slug: string) { return getAllDrills().find((d) => d.slug === slug); }
export function getWorkoutBySlug(slug: string) { return getAllWorkouts().find((w) => w.slug === slug); }
export function getPathBySlug(slug: string) { return getAllPaths().find((p) => p.slug === slug); }

export function getRelatedArticles(a: Article, n = 4): Article[] {
  const bySlug = new Map(getAllArticles().map((x) => [x.slug, x]));
  const rel = (a.related ?? []).map((s) => bySlug.get(s)).filter(Boolean) as Article[];
  if (rel.length >= n) return rel.slice(0, n);
  const extra = getAllArticles().filter(
    (x) => x.slug !== a.slug && !rel.includes(x) &&
      (x.hub === a.hub || x.tags.some((t) => a.tags.includes(t)))
  );
  return [...rel, ...extra].slice(0, n);
}

export function getDrillsForArticle(a: Article, n = 3): Drill[] {
  const tagHit = (d: Drill) => d.skill.toLowerCase().split(" ")[0];
  const keywords = new Set(a.tags.map((t) => t.toLowerCase()));
  const scored = getAllDrills().map((d) => ({
    d,
    s: (keywords.has(tagHit(d)) ? 2 : 0) + (d.title.toLowerCase().includes(a.subcategory.replace(/-/g, " ")) ? 1 : 0),
  }));
  return scored.sort((x, y) => y.s - x.s).slice(0, n).map((x) => x.d);
}

/** Deterministic "concept of the day" from curated slugs. */
const CONCEPT_POOL = [
  "spain-pick-and-roll", "drop-coverage-defense", "shooting-mechanics",
  "spacing-basics", "ghost-screen", "help-defense", "euro-step",
  "decision-making", "pick-and-roll-basics", "zone-2-3",
];
export function conceptOfDay(date = new Date()): Article | undefined {
  const days = Math.floor(date.getTime() / 86400000);
  const slug = CONCEPT_POOL[days % CONCEPT_POOL.length];
  return getArticleBySlug(slug) ?? getAllArticles()[0];
}

export function latestArticles(n = 8): Article[] {
  return [...getAllArticles()]
    .sort((a, b) => b.dateUpdated.localeCompare(a.dateUpdated) || a.title.localeCompare(b.title))
    .slice(0, n);
}

/* ------------------------------------------------------------------ */
/* Phase 2 — Player Performance                                        */
/* ------------------------------------------------------------------ */

export const getAllPerformance = () => loadDir<PerformanceArticle>("performance");

export function getPerformanceBySlug(slug: string): PerformanceArticle | undefined {
  return getAllPerformance().find((p) => p.slug === slug);
}
export function getPerformanceByHub(hub: string): PerformanceArticle[] {
  return getAllPerformance().filter((p) => p.hub === hub);
}
export function getPerformanceByCategory(hub: string, category: string): PerformanceArticle[] {
  return getAllPerformance().filter((p) => p.hub === hub && p.category === category);
}

/** Related performance content: explicit cross-hub relatedTopics first, then same hub / shared tags / shared goals. */
export function getRelatedPerformance(a: PerformanceArticle, n = 4): PerformanceArticle[] {
  const bySlug = new Map(getAllPerformance().map((x) => [x.slug, x]));
  const rel = (a.relatedTopics ?? []).map((s) => bySlug.get(s)).filter(Boolean) as PerformanceArticle[];
  if (rel.length >= n) return rel.slice(0, n);
  const extra = getAllPerformance().filter(
    (x) => x.slug !== a.slug && !rel.includes(x) &&
      (x.hub === a.hub ||
        x.tags.some((t) => a.tags.includes(t)) ||
        x.goal.some((g) => a.goal.includes(g)))
  );
  return [...rel, ...extra].slice(0, n);
}

/** Deterministic "performance pick of the day" per hub (same pattern as conceptOfDay). */
export function performanceOfDay(hub: string, date = new Date()): PerformanceArticle | undefined {
  const list = getPerformanceByHub(hub);
  if (!list.length) return undefined;
  const days = Math.floor(date.getTime() / 86400000);
  return list[days % list.length];
}

export interface PerfCrossLink { title: string; titleVi?: string; url: string }
export interface PerfCrossLinks {
  skills: PerfCrossLink[];
  exercises: PerfCrossLink[];
  recovery: PerfCrossLink[];
  nutrition: PerfCrossLink[];
  injuryPrevention: PerfCrossLink[];
}

/** Cross-linking data for "Continue Your Development" on performance article pages. */
export function getPerformanceCrossLinks(a: PerformanceArticle): PerfCrossLinks {
  const tagset = new Set(a.tags.map((t) => t.toLowerCase()));
  const tagScore = (tags: string[]) =>
    tags.filter((t) => tagset.has(t.toLowerCase())).length;

  const skills = getAllArticles()
    .map((x) => ({ x, s: tagScore(x.tags) + (x.hub === "coaching" ? 0 : 0) }))
    .filter((e) => e.s > 0)
    .sort((p, q) => q.s - p.s)
    .slice(0, 2)
    .map((e) => ({
      title: e.x.title, titleVi: e.x.vi?.title, url: articleUrl(e.x),
    }));

  const words = new Set(a.tags.flatMap((t) => t.toLowerCase().split(/[\s-]+/)));
  const exercises = getAllDrills()
    .map((d) => ({
      d,
      s: `${d.skill} ${d.title} ${d.goal}`.toLowerCase().split(/[\s-]+/).filter((w) => words.has(w)).length,
    }))
    .filter((e) => e.s > 0)
    .sort((p, q) => q.s - p.s)
    .slice(0, 2)
    .map((e) => ({
      title: e.d.title, titleVi: e.d.vi?.title, url: `/drills/${e.d.slug}`,
    }));

  const rel = getRelatedPerformance(a, 12);
  const hubLinks = (hub: string): PerfCrossLink[] =>
    rel.filter((p) => p.hub === hub && p.slug !== a.slug).slice(0, 2).map((p) => ({
      title: p.title, titleVi: p.vi?.title, url: performanceUrl(p.hub, p.slug),
    }));

  return {
    skills,
    exercises,
    recovery: hubLinks("recovery"),
    nutrition: hubLinks("nutrition"),
    injuryPrevention: hubLinks("injury-prevention"),
  };
}

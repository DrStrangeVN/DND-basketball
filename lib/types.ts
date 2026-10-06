import type { DiagramSpec } from "@/components/CourtDiagram";

export interface ArticleStep { title: string; detail: string }
export interface ArticleVi {
  title: string; description: string;
  whatIsIt: string[]; whyItMatters: string[]; howTo: ArticleStep[];
  coachingPoints: string[]; commonMistakes: string[]; gameSituations: string[];
  tags: string[]; video?: { title: string; note?: string };
}
export interface Article {
  id: string; slug: string; title: string; description: string;
  hub: string; subcategory: string; level: "beginner" | "intermediate" | "advanced" | "elite";
  ages: string[]; positions: string[]; tags: string[]; readTime: number;
  whatIsIt: string[]; whyItMatters: string[]; howTo: ArticleStep[];
  coachingPoints: string[]; commonMistakes: string[]; gameSituations: string[];
  diagram?: DiagramSpec;
  video?: { title: string; url: string; note?: string };
  related: string[]; references?: string[]; dateUpdated: string;
  vi?: ArticleVi;
}

export interface DrillVi {
  title: string; description: string; goal: string;
  setup: string[]; instructions: ArticleStep[];
  coachingPoints: string[]; commonMistakes: string[];
  progression: string; regression: string; gameApplication: string;
  players: string; equipment: string[]; video?: { title: string };
}
export interface Drill {
  id: string; slug: string; title: string; description: string;
  skill: string; level: Article["level"]; ages: string[]; positions: string[];
  players: string; equipment: string[]; durationMin: number; intensity: "low" | "medium" | "high";
  goal: string; setup: string[]; instructions: ArticleStep[];
  coachingPoints: string[]; commonMistakes: string[];
  progression: string; regression: string; gameApplication: string;
  video?: { title: string; url: string }; related: string[]; dateUpdated: string;
  vi?: DrillVi;
}

export interface WorkoutItem { name: string; detail: string; time?: string; sets?: string }
export interface WorkoutVi {
  title: string; description: string; focus: string[]; equipment: string[];
  items: WorkoutItem[]; tips: string[];
}
export interface Workout {
  id: string; slug: string; title: string; description: string;
  level: Article["level"]; durationMin: number; focus: string[]; equipment: string[];
  items: WorkoutItem[]; tips: string[]; dateUpdated: string;
  vi?: WorkoutVi;
}

export interface PathStep { title: string; description: string; articles: string[] }
export interface PathVi {
  title: string; description: string; audience: string;
  steps: { title: string; description: string }[];
}
export interface LearningPath {
  id: string; slug: string; title: string; description: string;
  level: Article["level"]; audience: string; steps: PathStep[]; dateUpdated: string;
  vi?: PathVi;
}

export interface GlossaryTerm { term: string; slug: string; definition: string; related: string[]; vi?: { definition: string } }
export interface FilmVideo {
  id: string; title: string; youtubeId: string; category: string;
  description: string; level: string; source: string; duration: string;
  vi?: { title: string; description: string; category: string };
}
export interface CourtVisionCard {
  id: string; title: string; setup: string; question: string;
  options: string[]; correctIndex: number; explanation: string;
  diagram: DiagramSpec; relatedArticle: string;
  vi?: { title: string; setup: string; question: string; options: string[]; explanation: string };
}

/** Slimmed article fields for cards/lists — avoids serializing full article bodies into page props. */
export interface ArticleCardData {
  slug: string; title: string; description: string;
  level: Article["level"]; readTime: number;
  hub: string; subcategory: string;
  vi?: { title: string; description: string };
}
/** Slimmed drill fields for cards/lists. */
export interface DrillCardData {
  slug: string; title: string; description: string;
  level: Article["level"]; skill: string;
  durationMin: number; players: string; intensity: "low" | "medium" | "high";
  vi?: { title: string; description: string; players: string };
}

export function toArticleCard(a: Article): ArticleCardData {
  return {
    slug: a.slug, title: a.title, description: a.description,
    level: a.level, readTime: a.readTime, hub: a.hub, subcategory: a.subcategory,
    vi: a.vi ? { title: a.vi.title, description: a.vi.description } : undefined,
  };
}
export function toDrillCard(d: Drill): DrillCardData {
  return {
    slug: d.slug, title: d.title, description: d.description,
    level: d.level, skill: d.skill, durationMin: d.durationMin,
    players: d.players, intensity: d.intensity,
    vi: d.vi ? { title: d.vi.title, description: d.vi.description, players: d.vi.players } : undefined,
  };
}


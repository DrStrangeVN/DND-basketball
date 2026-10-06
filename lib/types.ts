import type { DiagramSpec } from "@/components/CourtDiagram";

export interface ArticleStep { title: string; detail: string }
export interface Article {
  id: string; slug: string; title: string; description: string;
  hub: string; subcategory: string; level: "beginner" | "intermediate" | "advanced" | "elite";
  ages: string[]; positions: string[]; tags: string[]; readTime: number;
  whatIsIt: string[]; whyItMatters: string[]; howTo: ArticleStep[];
  coachingPoints: string[]; commonMistakes: string[]; gameSituations: string[];
  diagram?: DiagramSpec;
  video?: { title: string; url: string; note?: string };
  related: string[]; references?: string[]; dateUpdated: string;
}

export interface Drill {
  id: string; slug: string; title: string; description: string;
  skill: string; level: Article["level"]; ages: string[]; positions: string[];
  players: string; equipment: string[]; durationMin: number; intensity: "low" | "medium" | "high";
  goal: string; setup: string[]; instructions: ArticleStep[];
  coachingPoints: string[]; commonMistakes: string[];
  progression: string; regression: string; gameApplication: string;
  video?: { title: string; url: string }; related: string[]; dateUpdated: string;
}

export interface WorkoutItem { name: string; detail: string; time?: string; sets?: string }
export interface Workout {
  id: string; slug: string; title: string; description: string;
  level: Article["level"]; durationMin: number; focus: string[]; equipment: string[];
  items: WorkoutItem[]; tips: string[]; dateUpdated: string;
}

export interface PathStep { title: string; description: string; articles: string[] }
export interface LearningPath {
  id: string; slug: string; title: string; description: string;
  level: Article["level"]; audience: string; steps: PathStep[]; dateUpdated: string;
}

export interface GlossaryTerm { term: string; slug: string; definition: string; related: string[] }
export interface FilmVideo {
  id: string; title: string; youtubeId: string; category: string;
  description: string; level: string; source: string; duration: string;
}
export interface CourtVisionCard {
  id: string; title: string; setup: string; question: string;
  options: string[]; correctIndex: number; explanation: string;
  diagram: DiagramSpec; relatedArticle: string;
}


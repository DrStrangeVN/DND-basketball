import type { Metadata } from "next";
import {
  getAllArticles, getArticleBySlug, getAllDrills, getAllPaths, getAllWorkouts,
  getFilms, getCourtVision, conceptOfDay, latestArticles, articleUrl,
} from "@/lib/content";
import HomeClient, { type HomeData } from "@/components/HomeClient";

export const metadata: Metadata = {
  title: "DND Basketball — Trung Tâm Kiến Thức Bóng Rổ Hoàn Chỉnh",
  description: "Học kỹ năng, bài tập, chiến thuật, IQ bóng rổ và kiến thức huấn luyện — từ căn bản đến nâng cao. Học. Tập. Hiểu trận đấu.",
};

const POPULAR = ["pick-and-roll-basics", "shooting-mechanics", "spacing-basics", "zone-2-3", "crossover", "runner-floater", "motion-offense", "transition-offense"];
const QUICK_LEARN = ["drop-coverage-defense", "spain-pick-and-roll", "ice-defense", "ghost-screen"];

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
  const workoutsCount = getAllWorkouts().length;

  const data: HomeData = {
    articles,
    concept,
    popular,
    paths: paths.map((path) => ({
      path,
      articleCount: path.steps.reduce((n, s) => n + s.articles.length, 0),
    })),
    drills,
    films,
    coaches,
    latest,
    vision: vision.map((card) => {
      const a = getArticleBySlug(card.relatedArticle);
      return { card, learnUrl: a ? articleUrl(a) : "/basketball-iq" };
    }),
    workoutsCount,
    quickLearn: QUICK_LEARN.map((slug) => {
      const a = getArticleBySlug(slug);
      return { slug, url: a ? articleUrl(a) : "/learn" };
    }),
  };

  return <HomeClient data={data} />;
}

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllArticles, getArticleBySlug, articleUrl, getRelatedArticles, getDrillsForArticle, type Article } from "./content";
import { hubById } from "./hubs";
import ArticleView from "@/components/ArticleView";
import RecentTracker from "@/components/RecentTracker";

const SITE = "https://dndbasketball.vercel.app";

function metadataFor(a: Article): Metadata {
  const url = `${SITE}${articleUrl(a)}`;
  const title = a.vi?.title ?? a.title;
  const desc = a.vi?.description ?? a.description;
  const fullTitle = `${title} | DND Basketball`;
  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle, description: desc, url, type: "article", siteName: "DND Basketball",
    },
    twitter: { card: "summary", title: fullTitle, description: desc },
  };
}

function PageShell({ article }: { article: Article }) {
  const related = getRelatedArticles(article, 4);
  const drills = getDrillsForArticle(article, 3);
  return (
    <>
      <ArticleView article={article} related={related} drills={drills} />
      <RecentTracker item={{ type: "article", id: article.slug, title: article.vi?.title ?? article.title, url: articleUrl(article), ts: 0 }} />
    </>
  );
}

/** Route factory for /<hub>/<slug> article pages. */
export function createArticleRoute(hub: string) {
  const find = (slug: string) => {
    const a = getArticleBySlug(slug);
    return a && a.hub === hub ? a : null;
  };
  return {
    generateStaticParams: async () =>
      getAllArticles().filter((a) => a.hub === hub).map((a) => ({ slug: a.slug })),
    generateMetadata: async ({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> => {
      const a = find((await params).slug);
      if (!a) return { title: "Not found | DND Basketball" };
      return metadataFor(a);
    },
    Page: async ({ params }: { params: Promise<{ slug: string }> }) => {
      const a = find((await params).slug);
      if (!a) notFound();
      return <PageShell article={a} />;
    },
  };
}

/** Route factory for /skills/<group>/<slug> pages. */
export function createSkillRoute() {
  const find = (group: string, slug: string) => {
    const a = getArticleBySlug(slug);
    return a && a.hub === "skills" && a.subcategory === group ? a : null;
  };
  return {
    generateStaticParams: async () =>
      getAllArticles()
        .filter((a) => a.hub === "skills")
        .map((a) => ({ group: a.subcategory, slug: a.slug })),
    generateMetadata: async ({ params }: { params: Promise<{ group: string; slug: string }> }): Promise<Metadata> => {
      const p = await params;
      const a = find(p.group, p.slug);
      if (!a) return { title: "Not found | DND Basketball" };
      return metadataFor(a);
    },
    Page: async ({ params }: { params: Promise<{ group: string; slug: string }> }) => {
      const p = await params;
      const a = find(p.group, p.slug);
      if (!a) notFound();
      return <PageShell article={a} />;
    },
  };
}

export function hubMetadata(hubId: string): Metadata {
  const h = hubById(hubId);
  if (!h) return { title: "DND Basketball" };
  const title = `${h.titleVi ?? h.title} — ${h.taglineVi ?? h.tagline}`;
  const desc = h.descriptionVi ?? h.description;
  return {
    title,
    description: desc,
    alternates: { canonical: `${SITE}${h.route}` },
    openGraph: { title: `${title} | DND Basketball`, description: desc, url: `${SITE}${h.route}`, siteName: "DND Basketball" },
  };
}

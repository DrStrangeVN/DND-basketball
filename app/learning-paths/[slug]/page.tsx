import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllPaths, getPathBySlug, getArticleBySlug, articleUrl } from "@/lib/content";
import PathView from "@/components/PathView";
import RecentTracker from "@/components/RecentTracker";

const SITE = "https://dndbasketball.vercel.app";

export async function generateStaticParams() {
  return getAllPaths().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getPathBySlug((await params).slug);
  if (!p) return { title: "Not found | DND Basketball" };
  const title = `${p.vi?.title ?? p.title} — Lộ trình học`;
  const desc = p.vi?.description ?? p.description;
  return {
    title, description: desc,
    alternates: { canonical: `${SITE}/learning-paths/${p.slug}` },
    openGraph: { title, description: desc, url: `${SITE}/learning-paths/${p.slug}`, siteName: "DND Basketball" },
  };
}

export default async function PathPage({ params }: { params: Promise<{ slug: string }> }) {
  const path = getPathBySlug((await params).slug);
  if (!path) notFound();
  const url = `/learning-paths/${path.slug}`;
  const stepArticles = path.steps.map((s) =>
    s.articles
      .map((slug) => getArticleBySlug(slug))
      .filter((a): a is NonNullable<typeof a> => Boolean(a))
      .map((a) => ({ slug: a.slug, title: a.title, titleVi: a.vi?.title, url: articleUrl(a) }))
  );
  return (
    <>
      <PathView path={path} stepArticles={stepArticles} />
      <RecentTracker item={{ type: "path", id: path.slug, title: path.vi?.title ?? path.title, url, ts: 0 }} />
    </>
  );
}

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllPaths, getPathBySlug, getArticleBySlug, articleUrl } from "@/lib/content";
import { Breadcrumbs, LevelBadge } from "@/components/ui";
import PathProgress from "@/components/PathProgress";
import FavoriteButton from "@/components/FavoriteButton";
import RecentTracker from "@/components/RecentTracker";

const SITE = "https://dndbasketball.vercel.app";

export async function generateStaticParams() {
  return getAllPaths().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getPathBySlug((await params).slug);
  if (!p) return { title: "Not found | DND Basketball" };
  const title = `${p.title} — Learning Path`;
  return {
    title, description: p.description,
    alternates: { canonical: `${SITE}/learning-paths/${p.slug}` },
    openGraph: { title, description: p.description, url: `${SITE}/learning-paths/${p.slug}`, siteName: "DND Basketball" },
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
      .map((a) => ({ slug: a.slug, title: a.title, url: articleUrl(a) }))
  );

  return (
    <div className="mx-auto max-w-3xl pb-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Learning Paths", href: "/learning-paths" }, { label: path.title }]} />
      <RecentTracker item={{ type: "path", id: path.slug, title: path.title, url, ts: 0 }} />

      <header className="neu mb-6 p-6 sm:p-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <LevelBadge level={path.level} />
          <span className="rounded-full bg-[color:var(--orange-soft)] px-2.5 py-1 text-[11px] font-bold text-[color:var(--orange)]">
            {path.steps.length} levels
          </span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{path.title}</h1>
        <p className="mt-3 text-[16px] text-[color:var(--muted)]">{path.description}</p>
        <p className="mt-2 text-[13px] font-semibold text-[color:var(--faint)]">For: {path.audience}</p>
        <div className="mt-4"><FavoriteButton item={{ type: "path", id: path.slug, title: path.title, url, ts: 0 }} /></div>
      </header>

      <PathProgress path={path} stepArticles={stepArticles} />

      <p className="mt-8 px-1 text-[12px]">
        <Link href="/learning-paths" className="font-semibold text-[color:var(--orange)]">← Back to Learning Paths</Link>
      </p>
    </div>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPerformance, getPerformanceBySlug, getRelatedPerformance, performanceUrl } from "@/lib/content";
import { PERF_HUBS, type PerfHubId } from "@/lib/types";
import PerfArticleView from "@/components/performance/PerfArticleView";

const SITE = "https://learn.danangdragons.com";

function find(hub: string, slug: string) {
  const a = getPerformanceBySlug(slug);
  return a && a.hub === hub ? a : null;
}

export async function generateStaticParams() {
  return getAllPerformance().map((a) => ({ hub: a.hub, slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ hub: string; slug: string }> }): Promise<Metadata> {
  const { hub, slug } = await params;
  const a = find(hub, slug);
  if (!a) return { title: "Not found | Danang Dragons Learn" };
  const title = a.vi?.title ?? a.title;
  const desc = a.vi?.description ?? a.description;
  const url = `${SITE}${performanceUrl(a.hub, a.slug)}`;
  const fullTitle = `${title} | Danang Dragons Learn`;
  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: { title: fullTitle, description: desc, url, type: "article", siteName: "Danang Dragons Learn" },
    twitter: { card: "summary", title: fullTitle, description: desc },
  };
}

export default async function Page({ params }: { params: Promise<{ hub: string; slug: string }> }) {
  const { hub, slug } = await params;
  if (!PERF_HUBS[hub as PerfHubId]) notFound();
  const a = find(hub, slug);
  if (!a) notFound();
  const related = getRelatedPerformance(a, 4);
  return <PerfArticleView article={a} related={related} />;
}

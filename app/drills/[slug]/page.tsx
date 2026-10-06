import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllDrills, getDrillBySlug } from "@/lib/content";
import { toDrillCard } from "@/lib/types";
import DrillView from "@/components/DrillView";
import RecentTracker from "@/components/RecentTracker";

const SITE = "https://dndbasketball.vercel.app";

export async function generateStaticParams() {
  return getAllDrills().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const d = getDrillBySlug((await params).slug);
  if (!d) return { title: "Not found | DND Basketball" };
  const title = `${d.vi?.title ?? d.title} — Bài tập bóng rổ`;
  const desc = d.vi?.description ?? d.description;
  return {
    title, description: desc,
    alternates: { canonical: `${SITE}/drills/${d.slug}` },
    openGraph: { title, description: desc, url: `${SITE}/drills/${d.slug}`, siteName: "DND Basketball" },
  };
}

export default async function DrillPage({ params }: { params: Promise<{ slug: string }> }) {
  const drill = getDrillBySlug((await params).slug);
  if (!drill) notFound();
  const url = `/drills/${drill.slug}`;
  const related = getAllDrills().filter((d) => drill.related.includes(d.slug)).slice(0, 3).map(toDrillCard);
  return (
    <>
      <DrillView drill={drill} related={related} />
      <RecentTracker item={{ type: "drill", id: drill.slug, title: drill.vi?.title ?? drill.title, url, ts: 0 }} />
    </>
  );
}

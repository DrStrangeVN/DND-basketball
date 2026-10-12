import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPerformanceByHub } from "@/lib/content";
import { PERF_HUBS, type PerfHubId } from "@/lib/types";
import PerfHubPage from "@/components/performance/PerfHubPage";

const SITE = "https://learn.danangdragons.com";
const HUB_IDS = Object.keys(PERF_HUBS) as PerfHubId[];

export async function generateStaticParams() {
  return HUB_IDS.map((hub) => ({ hub }));
}

export async function generateMetadata({ params }: { params: Promise<{ hub: string }> }): Promise<Metadata> {
  const { hub } = await params;
  const meta = PERF_HUBS[hub as PerfHubId];
  if (!meta) return { title: "Not found | Danang Dragons Learn" };
  const title = `${meta.nameVi} — ${meta.taglineVi}`;
  const desc = `${meta.name} · ${meta.tagline} | ${meta.nameVi} · ${meta.taglineVi}`;
  const url = `${SITE}/performance/${hub}`;
  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: { title: `${title} | Danang Dragons Learn`, description: desc, url, siteName: "Danang Dragons Learn" },
    twitter: { card: "summary", title: `${title} | Danang Dragons Learn`, description: desc },
  };
}

export default async function Page({ params }: { params: Promise<{ hub: string }> }) {
  const { hub } = await params;
  if (!PERF_HUBS[hub as PerfHubId]) notFound();
  const hubId = hub as PerfHubId;
  const articles = getPerformanceByHub(hubId);
  return <PerfHubPage hubId={hubId} articles={articles} />;
}

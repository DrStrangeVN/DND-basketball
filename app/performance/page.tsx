import type { Metadata } from "next";
import { getPerformanceByHub } from "@/lib/content";
import type { PerfHubId } from "@/lib/types";
import PerfLanding, { type LandingHub } from "@/components/performance/PerfLanding";

export const metadata: Metadata = {
  title: "Build the Complete Athlete | DND Basketball",
  description: "Train harder. Recover smarter. Fuel better. Stay on the court. | Tập nặng hơn. Hồi phục thông minh hơn. Nạp năng lượng tốt hơn.",
  alternates: { canonical: "https://learn.danangdragons.com/performance" },
  openGraph: {
    title: "Build the Complete Athlete | DND Basketball",
    description: "Athletic Performance · Recovery · Nutrition · Hydration · Injury Prevention",
    url: "https://learn.danangdragons.com/performance",
    siteName: "DND Basketball",
  },
};

const HUB_ORDER: PerfHubId[] = [
  "athletic-performance", "recovery", "nutrition", "hydration", "injury-prevention",
  "mental-performance",
];

export default function Page() {
  const hubs: LandingHub[] = HUB_ORDER.map((id) => {
    const articles = getPerformanceByHub(id);
    // Featured topic: first article of the largest category.
    const byCat = new Map<string, number>();
    for (const a of articles) byCat.set(a.category, (byCat.get(a.category) ?? 0) + 1);
    const topCat = [...byCat.entries()].sort((x, y) => y[1] - x[1])[0]?.[0];
    const featured = articles.find((a) => a.category === topCat) ?? articles[0] ?? null;
    return { id, count: articles.length, featured };
  });
  return <PerfLanding hubs={hubs} />;
}

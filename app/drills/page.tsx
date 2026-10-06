import type { Metadata } from "next";
import { getAllDrills } from "@/lib/content";
import { toDrillCard } from "@/lib/types";
import DrillFilters from "@/components/DrillFilters";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Thư viện bài tập bóng rổ",
  description: "Thư viện bài tập bóng rổ lọc được: ném rổ, dẫn bóng, dứt điểm, phòng thủ và hơn nữa — kèm điểm huấn luyện, cách nâng độ khó và ứng dụng thi đấu.",
  alternates: { canonical: "https://dndbasketball.vercel.app/drills" },
};

export default function DrillsPage() {
  const drills = getAllDrills().map(toDrillCard);
  return (
    <div className="pb-6">
      <PageHeader
        crumbs={[{ labelKey: "mobile.home", href: "/" }, { labelKey: "nav.drillLibrary" }]}
        eyebrowKey="drills.eyebrow"
        titleKey="drills.title"
        descKey="drills.subtitle"
      />
      <DrillFilters drills={drills} />
    </div>
  );
}

import type { Metadata } from "next";
import TrainingLog, { type DrillOption } from "@/components/TrainingLog";
import { getAllDrills } from "@/lib/content";

export const metadata: Metadata = {
  title: "Nhật ký tập luyện | DND Basketball",
  description:
    "Ghi lại từng buổi tập, giữ chuỗi streak và theo dõi tiến bộ — lịch tập luyện, thống kê và nhật ký trên thiết bị của bạn.",
  alternates: { canonical: "https://learn.danangdragons.com/log" },
};

export default function LogPage() {
  const drills: DrillOption[] = getAllDrills()
    .map((d) => ({ slug: d.slug, title: d.title, viTitle: d.vi?.title ?? d.title }));
  return <TrainingLog drills={drills} />;
}

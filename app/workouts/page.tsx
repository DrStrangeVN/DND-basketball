import type { Metadata } from "next";
import { getAllWorkouts } from "@/lib/content";
import { WorkoutCard } from "@/components/cards";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Giáo án tập luyện bóng rổ",
  description: "Giáo án bóng rổ có cấu trúc kèm checklist: dẫn bóng, ném rổ, giáo án cho hậu vệ và big man, routine ngày thi đấu.",
  alternates: { canonical: "https://dndbasketball.vercel.app/workouts" },
};

export default function WorkoutsPage() {
  const workouts = getAllWorkouts();
  return (
    <div className="pb-6">
      <PageHeader
        crumbs={[{ labelKey: "mobile.home", href: "/" }, { labelKey: "nav.workouts" }]}
        eyebrowKey="footer.train"
        titleKey="workouts.pageTitle"
        descKey="workouts.pageDesc"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {workouts.map((w) => <WorkoutCard key={w.slug} workout={w} />)}
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { getAllPaths } from "@/lib/content";
import { PathCard } from "@/components/cards";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Lộ trình học bóng rổ",
  description: "Lộ trình học bóng rổ có cấu trúc: người mới, phát triển hậu vệ, phát triển tay ném, chinh phục pick & roll, chuyên gia phòng thủ và căn bản cho HLV.",
  alternates: { canonical: "https://dndbasketball.vercel.app/learning-paths" },
};

export default function PathsPage() {
  const paths = getAllPaths();
  return (
    <div className="pb-6">
      <PageHeader
        crumbs={[{ labelKey: "mobile.home", href: "/" }, { labelKey: "nav.learningPaths" }]}
        eyebrowKey="home.paths.eyebrow"
        titleKey="paths.title"
        descKey="paths.pageDesc"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paths.map((p) => (
          <PathCard key={p.slug} path={p} articleCount={p.steps.reduce((n, s) => n + s.articles.length, 0)} />
        ))}
      </div>
    </div>
  );
}

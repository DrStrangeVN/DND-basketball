import type { Metadata } from "next";
import { getAllPaths } from "@/lib/content";
import { PathCard } from "@/components/cards";
import { Breadcrumbs } from "@/components/ui";

export const metadata: Metadata = {
  title: "Learning Paths",
  description: "Structured basketball learning paths: beginner, guard development, shooter development, pick & roll mastery, defensive specialist and coach fundamentals.",
  alternates: { canonical: "https://dndbasketball.vercel.app/learning-paths" },
};

export default function PathsPage() {
  const paths = getAllPaths();
  return (
    <div className="pb-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Learning Paths" }]} />
      <header className="neu mb-8 p-6 sm:p-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--orange)]">Structured Progress</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">Learning Paths</h1>
        <p className="mt-2 max-w-2xl text-[15px] text-[color:var(--muted)]">
          What makes this hub different from a library: guided progressions from level 1 to mastery. Check off concepts as you learn them — progress saves on your device.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paths.map((p) => (
          <PathCard key={p.slug} path={p} articleCount={p.steps.reduce((n, s) => n + s.articles.length, 0)} />
        ))}
      </div>
    </div>
  );
}

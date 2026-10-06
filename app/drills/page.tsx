import type { Metadata } from "next";
import { getAllDrills } from "@/lib/content";
import DrillFilters from "@/components/DrillFilters";
import { Breadcrumbs } from "@/components/ui";

export const metadata: Metadata = {
  title: "Basketball Drill Library",
  description: "Filterable basketball drill library: shooting, ball handling, finishing, defense and more — with coaching points, progressions and game application.",
  alternates: { canonical: "https://dndbasketball.vercel.app/drills" },
};

export default function DrillsPage() {
  const drills = getAllDrills();
  return (
    <div className="pb-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Drill Library" }]} />
      <header className="neu mb-6 p-6 sm:p-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--orange)]">Train</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">Basketball Drill Library</h1>
        <p className="mt-2 max-w-2xl text-[15px] text-[color:var(--muted)]">
          Every drill with a goal, setup, coaching points, common mistakes, progressions and game application. Filter to find exactly what your session needs.
        </p>
      </header>
      <DrillFilters drills={drills} />
    </div>
  );
}

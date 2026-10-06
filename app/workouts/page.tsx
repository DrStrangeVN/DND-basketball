import type { Metadata } from "next";
import { getAllWorkouts } from "@/lib/content";
import { WorkoutCard } from "@/components/cards";
import { Breadcrumbs } from "@/components/ui";

export const metadata: Metadata = {
  title: "Basketball Workouts",
  description: "Structured basketball workouts with checklists: ball handling, shooting, guard and big-man workouts, game-day routines.",
  alternates: { canonical: "https://dndbasketball.vercel.app/workouts" },
};

export default function WorkoutsPage() {
  const workouts = getAllWorkouts();
  return (
    <div className="pb-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Workouts" }]} />
      <header className="neu mb-8 p-6 sm:p-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--orange)]">Train</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">Basketball Workouts</h1>
        <p className="mt-2 max-w-2xl text-[15px] text-[color:var(--muted)]">
          Follow-along workouts with interactive checklists. Your progress saves on this device — no account needed.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {workouts.map((w) => <WorkoutCard key={w.slug} workout={w} />)}
      </div>
    </div>
  );
}

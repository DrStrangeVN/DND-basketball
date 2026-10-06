import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Package, Lightbulb } from "lucide-react";
import { getAllWorkouts, getWorkoutBySlug } from "@/lib/content";
import { Breadcrumbs, LevelBadge } from "@/components/ui";
import WorkoutChecklist from "@/components/WorkoutChecklist";
import FavoriteButton from "@/components/FavoriteButton";
import RecentTracker from "@/components/RecentTracker";

const SITE = "https://dndbasketball.vercel.app";

export async function generateStaticParams() {
  return getAllWorkouts().map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const w = getWorkoutBySlug((await params).slug);
  if (!w) return { title: "Not found | DND Basketball" };
  const title = w.title;
  return {
    title, description: w.description,
    alternates: { canonical: `${SITE}/workouts/${w.slug}` },
    openGraph: { title, description: w.description, url: `${SITE}/workouts/${w.slug}`, siteName: "DND Basketball" },
  };
}

export default async function WorkoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const workout = getWorkoutBySlug((await params).slug);
  if (!workout) notFound();
  const url = `/workouts/${workout.slug}`;

  return (
    <div className="mx-auto max-w-3xl pb-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Workouts", href: "/workouts" }, { label: workout.title }]} />
      <RecentTracker item={{ type: "workout", id: workout.slug, title: workout.title, url, ts: 0 }} />

      <header className="neu mb-6 p-6 sm:p-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--orange-soft)] px-2.5 py-1 text-[11px] font-bold text-[color:var(--orange)]">
            <Clock className="h-3.5 w-3.5" aria-hidden /> {workout.durationMin} min
          </span>
          <LevelBadge level={workout.level} />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{workout.title}</h1>
        <p className="mt-3 text-[16px] text-[color:var(--muted)]">{workout.description}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-[12px] font-semibold text-[color:var(--faint)]">
          <span className="inline-flex items-center gap-1"><Package className="h-3.5 w-3.5" aria-hidden /> {workout.equipment.join(" · ")}</span>
          <span>Focus: {workout.focus.join(" · ")}</span>
        </div>
        <div className="mt-4"><FavoriteButton item={{ type: "workout", id: workout.slug, title: workout.title, url, ts: 0 }} /></div>
      </header>

      <WorkoutChecklist workout={workout} />

      <section className="neu mt-6 p-6" aria-labelledby="tips-h">
        <h2 id="tips-h" className="mb-3 flex items-center gap-2 text-lg font-extrabold">
          <Lightbulb className="h-5 w-5 text-[color:var(--orange)]" aria-hidden /> Tips
        </h2>
        <ul className="list-disc space-y-1.5 pl-5 text-[14px] text-[color:var(--muted)]">
          {workout.tips.map((t, i) => <li key={i}>{t}</li>)}
        </ul>
      </section>

      <p className="mt-8 px-1 text-[12px]">
        <Link href="/workouts" className="font-semibold text-[color:var(--orange)]">← Back to Workouts</Link>
      </p>
    </div>
  );
}

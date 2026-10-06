import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllWorkouts, getWorkoutBySlug } from "@/lib/content";
import WorkoutView from "@/components/WorkoutView";
import RecentTracker from "@/components/RecentTracker";

const SITE = "https://dndbasketball.vercel.app";

export async function generateStaticParams() {
  return getAllWorkouts().map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const w = getWorkoutBySlug((await params).slug);
  if (!w) return { title: "Not found | DND Basketball" };
  const title = w.vi?.title ?? w.title;
  const desc = w.vi?.description ?? w.description;
  return {
    title, description: desc,
    alternates: { canonical: `${SITE}/workouts/${w.slug}` },
    openGraph: { title, description: desc, url: `${SITE}/workouts/${w.slug}`, siteName: "DND Basketball" },
  };
}

export default async function WorkoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const workout = getWorkoutBySlug((await params).slug);
  if (!workout) notFound();
  const url = `/workouts/${workout.slug}`;
  return (
    <>
      <WorkoutView workout={workout} />
      <RecentTracker item={{ type: "workout", id: workout.slug, title: workout.vi?.title ?? workout.title, url, ts: 0 }} />
    </>
  );
}

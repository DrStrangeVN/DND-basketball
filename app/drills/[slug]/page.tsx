import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, Clock, Users, Dumbbell, Package } from "lucide-react";
import { getAllDrills, getDrillBySlug } from "@/lib/content";
import { Breadcrumbs, LevelBadge } from "@/components/ui";
import { DrillCard } from "@/components/cards";
import FavoriteButton from "@/components/FavoriteButton";
import RecentTracker from "@/components/RecentTracker";
import VideoEmbed, { youtubeIdFromUrl } from "@/components/VideoEmbed";

const SITE = "https://dndbasketball.vercel.app";

export async function generateStaticParams() {
  return getAllDrills().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const d = getDrillBySlug((await params).slug);
  if (!d) return { title: "Not found | DND Basketball" };
  const title = `${d.title} — Basketball Drill`;
  return {
    title, description: d.description,
    alternates: { canonical: `${SITE}/drills/${d.slug}` },
    openGraph: { title, description: d.description, url: `${SITE}/drills/${d.slug}`, siteName: "DND Basketball" },
  };
}

export default async function DrillPage({ params }: { params: Promise<{ slug: string }> }) {
  const drill = getDrillBySlug((await params).slug);
  if (!drill) notFound();
  const url = `/drills/${drill.slug}`;
  const related = getAllDrills().filter((d) => drill.related.includes(d.slug)).slice(0, 3);
  const videoId = drill.video ? youtubeIdFromUrl(drill.video.url) : null;

  const jsonLd = {
    "@context": "https://schema.org", "@type": "LearningResource",
    name: drill.title, description: drill.description,
    timeRequired: `PT${drill.durationMin}M`, url: `${SITE}${url}`,
  };

  return (
    <div className="mx-auto max-w-4xl pb-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Drill Library", href: "/drills" }, { label: drill.title }]} />
      <RecentTracker item={{ type: "drill", id: drill.slug, title: drill.title, url, ts: 0 }} />

      <header className="neu p-6 sm:p-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[color:var(--orange-soft)] px-2.5 py-1 text-[11px] font-bold text-[color:var(--orange)]">{drill.skill}</span>
          <LevelBadge level={drill.level} />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{drill.title}</h1>
        <p className="mt-3 text-[16px] text-[color:var(--muted)]">{drill.description}</p>
        <div className="neu-inset mt-5 grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
          {[
            { icon: Clock, label: "Duration", value: `${drill.durationMin} min` },
            { icon: Users, label: "Players", value: drill.players },
            { icon: Dumbbell, label: "Intensity", value: drill.intensity },
            { icon: Package, label: "Equipment", value: drill.equipment.join(", ") },
          ].map((m) => (
            <div key={m.label}>
              <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[color:var(--faint)]">
                <m.icon className="h-3.5 w-3.5" aria-hidden /> {m.label}
              </p>
              <p className="mt-0.5 text-sm font-bold">{m.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2 text-[12px] font-semibold text-[color:var(--faint)]">
          <span>Ages: {drill.ages.join(" · ")}</span>
          <span>Positions: {drill.positions.includes("ALL") ? "All" : drill.positions.join(", ")}</span>
        </div>
        <div className="mt-4"><FavoriteButton item={{ type: "drill", id: drill.slug, title: drill.title, url, ts: 0 }} /></div>
      </header>

      <section className="neu mt-6 p-6 sm:p-8" aria-labelledby="goal-h">
        <h2 id="goal-h" className="mb-2 text-xl font-extrabold tracking-tight">Goal</h2>
        <p className="text-[15px] leading-relaxed">{drill.goal}</p>
      </section>

      <section className="neu mt-6 p-6 sm:p-8" aria-labelledby="setup-h">
        <h2 id="setup-h" className="mb-3 text-xl font-extrabold tracking-tight">Setup</h2>
        <ul className="list-disc space-y-1.5 pl-5 text-[15px]">{drill.setup.map((s, i) => <li key={i}>{s}</li>)}</ul>
      </section>

      <section className="mt-6" aria-labelledby="how-h">
        <h2 id="how-h" className="mb-4 px-1 text-xl font-extrabold tracking-tight">Instructions</h2>
        <ol className="space-y-3">
          {drill.instructions.map((s, i) => (
            <li key={i} className="neu-sm flex gap-4 p-5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color:var(--orange)] text-sm font-extrabold text-white" aria-hidden>{i + 1}</span>
              <div>
                <p className="font-bold">{s.title}</p>
                <p className="mt-1 text-[14px] text-[color:var(--muted)]">{s.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className="neu p-6" aria-labelledby="cp-h">
          <h2 id="cp-h" className="mb-3 text-xl font-extrabold tracking-tight">Coaching Points</h2>
          <ul className="space-y-2.5 text-[14px]">
            {drill.coachingPoints.map((p, i) => (
              <li key={i} className="flex gap-2.5"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--orange)]" aria-hidden /><span>{p}</span></li>
            ))}
          </ul>
        </section>
        <section className="neu p-6" aria-labelledby="cm-h">
          <h2 id="cm-h" className="mb-3 text-xl font-extrabold tracking-tight">Common Mistakes</h2>
          <ul className="space-y-2.5 text-[14px]">
            {drill.commonMistakes.map((p, i) => (
              <li key={i} className="flex gap-2.5"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" aria-hidden /><span>{p}</span></li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {[
          { t: "Progression", d: drill.progression },
          { t: "Regression", d: drill.regression },
          { t: "Game Application", d: drill.gameApplication },
        ].map((x) => (
          <section key={x.t} className="neu p-6">
            <h2 className="mb-2 text-[15px] font-extrabold">{x.t}</h2>
            <p className="text-[14px] leading-relaxed text-[color:var(--muted)]">{x.d}</p>
          </section>
        ))}
      </div>

      {videoId && (
        <section className="mt-6" aria-label="Video reference">
          <VideoEmbed youtubeId={videoId} title={drill.video!.title} />
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-10" aria-labelledby="rel-h">
          <h2 id="rel-h" className="mb-4 px-1 text-xl font-extrabold tracking-tight">Related Drills</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((d) => <DrillCard key={d.slug} drill={d} />)}
          </div>
        </section>
      )}

      <p className="mt-8 px-1 text-[12px] text-[color:var(--faint)]">
        <Link href="/drills" className="font-semibold text-[color:var(--orange)]">← Back to Drill Library</Link>
      </p>
    </div>
  );
}

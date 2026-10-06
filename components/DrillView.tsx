"use client";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, Clock, Users, Dumbbell, Package } from "lucide-react";
import type { Drill, DrillCardData } from "@/lib/types";
import { Breadcrumbs, LevelBadge } from "@/components/ui";
import { DrillCard } from "@/components/cards";
import FavoriteButton from "@/components/FavoriteButton";
import VideoEmbed, { youtubeIdFromUrl } from "@/components/VideoEmbed";
import { useLanguage, pick, type Lang } from "@/lib/i18n";

function localize(d: Drill, lang: Lang) {
  const v = lang === "vi" ? d.vi : undefined;
  return {
    title: pick(lang, d.title, v?.title),
    description: pick(lang, d.description, v?.description),
    goal: pick(lang, d.goal, v?.goal),
    setup: pick(lang, d.setup, v?.setup),
    instructions: pick(lang, d.instructions, v?.instructions),
    coachingPoints: pick(lang, d.coachingPoints, v?.coachingPoints),
    commonMistakes: pick(lang, d.commonMistakes, v?.commonMistakes),
    progression: pick(lang, d.progression, v?.progression),
    regression: pick(lang, d.regression, v?.regression),
    gameApplication: pick(lang, d.gameApplication, v?.gameApplication),
    players: pick(lang, d.players, v?.players),
    equipment: pick(lang, d.equipment, v?.equipment),
    videoTitle: pick(lang, d.video?.title ?? "", v?.video?.title),
  };
}

export default function DrillView({ drill, related }: { drill: Drill; related: DrillCardData[] }) {
  const { lang, t } = useLanguage();
  const L = localize(drill, lang);
  const url = `/drills/${drill.slug}`;
  const videoId = drill.video ? youtubeIdFromUrl(drill.video.url) : null;

  const jsonLd = {
    "@context": "https://schema.org", "@type": "LearningResource",
    name: L.title, description: L.description,
    timeRequired: `PT${drill.durationMin}M`, url: `https://dndbasketball.vercel.app${url}`,
  };

  const meta = [
    { icon: Clock, labelKey: "drills.duration", value: `${drill.durationMin} ${t("drills.minutes")}` },
    { icon: Users, labelKey: "drills.players", value: L.players },
    { icon: Dumbbell, labelKey: "drills.intensity", value: t(`drills.intensity.${drill.intensity}`) },
    { icon: Package, labelKey: "drills.equipment", value: L.equipment.join(", ") },
  ];

  return (
    <div className="mx-auto max-w-4xl pb-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={[
        { label: t("mobile.home"), href: "/" },
        { label: t("drills.title"), href: "/drills" },
        { label: L.title },
      ]} />

      <header className="neu p-6 sm:p-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[color:var(--orange-soft)] px-2.5 py-1 text-[11px] font-bold text-[color:var(--orange)]">{drill.skill}</span>
          <LevelBadge level={drill.level} />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{L.title}</h1>
        <p className="mt-3 text-[16px] text-[color:var(--muted)]">{L.description}</p>
        <div className="neu-inset mt-5 grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
          {meta.map((m) => (
            <div key={m.labelKey}>
              <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[color:var(--faint)]">
                <m.icon className="h-3.5 w-3.5" aria-hidden /> {t(m.labelKey)}
              </p>
              <p className="mt-0.5 text-sm font-bold">{m.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2 text-[12px] font-semibold text-[color:var(--faint)]">
          <span>{t("article.ages")}: {drill.ages.join(" · ")}</span>
          <span>{t("article.positions")}: {drill.positions.includes("ALL") ? t("article.positionsAll") : drill.positions.join(", ")}</span>
        </div>
        <div className="mt-4"><FavoriteButton item={{ type: "drill", id: drill.slug, title: L.title, url, ts: 0 }} /></div>
      </header>

      <section className="neu mt-6 p-6 sm:p-8" aria-labelledby="goal-h">
        <h2 id="goal-h" className="mb-2 text-xl font-extrabold tracking-tight">{t("drills.goal")}</h2>
        <p className="text-[15px] leading-relaxed">{L.goal}</p>
      </section>

      <section className="neu mt-6 p-6 sm:p-8" aria-labelledby="setup-h">
        <h2 id="setup-h" className="mb-3 text-xl font-extrabold tracking-tight">{t("drills.setup")}</h2>
        <ul className="list-disc space-y-1.5 pl-5 text-[15px]">{L.setup.map((s, i) => <li key={i}>{s}</li>)}</ul>
      </section>

      <section className="mt-6" aria-labelledby="how-h">
        <h2 id="how-h" className="mb-4 px-1 text-xl font-extrabold tracking-tight">{t("drills.instructions")}</h2>
        <ol className="space-y-3">
          {L.instructions.map((s, i) => (
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
          <h2 id="cp-h" className="mb-3 text-xl font-extrabold tracking-tight">{t("drills.coachingPoints")}</h2>
          <ul className="space-y-2.5 text-[14px]">
            {L.coachingPoints.map((p, i) => (
              <li key={i} className="flex gap-2.5"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--orange)]" aria-hidden /><span>{p}</span></li>
            ))}
          </ul>
        </section>
        <section className="neu p-6" aria-labelledby="cm-h">
          <h2 id="cm-h" className="mb-3 text-xl font-extrabold tracking-tight">{t("drills.commonMistakes")}</h2>
          <ul className="space-y-2.5 text-[14px]">
            {L.commonMistakes.map((p, i) => (
              <li key={i} className="flex gap-2.5"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" aria-hidden /><span>{p}</span></li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {[
          { k: "drills.progression", d: L.progression },
          { k: "drills.regression", d: L.regression },
          { k: "drills.gameApplication", d: L.gameApplication },
        ].map((x) => (
          <section key={x.k} className="neu p-6">
            <h2 className="mb-2 text-[15px] font-extrabold">{t(x.k)}</h2>
            <p className="text-[14px] leading-relaxed text-[color:var(--muted)]">{x.d}</p>
          </section>
        ))}
      </div>

      {videoId && (
        <section className="mt-6" aria-label="Video reference">
          <VideoEmbed youtubeId={videoId} title={L.videoTitle} />
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-10" aria-labelledby="rel-h">
          <h2 id="rel-h" className="mb-4 px-1 text-xl font-extrabold tracking-tight">{t("drills.related")}</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((d) => <DrillCard key={d.slug} drill={d} />)}
          </div>
        </section>
      )}

      <p className="mt-8 px-1 text-[12px] text-[color:var(--faint)]">
        <Link href="/drills" className="font-semibold text-[color:var(--orange)]">← {t("drills.backToLibrary")}</Link>
      </p>
    </div>
  );
}

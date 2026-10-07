"use client";
import {
  AlertTriangle, ArrowRightLeft, CheckCircle2, Clock, Lightbulb, ListOrdered,
  Repeat, Target, TrendingUp, Wrench,
} from "lucide-react";
import type { PerformanceArticle, PerfHubId } from "@/lib/types";
import { performanceUrl } from "@/lib/urls";
import { useLanguage, pick, type Lang } from "@/lib/i18n";
import { Breadcrumbs, LevelBadge, SectionTitle } from "../ui";
import VideoEmbed, { youtubeIdFromUrl } from "../VideoEmbed";
import RecentTracker from "../RecentTracker";
import MetaSync from "../MetaSync";
import { MedicalDisclaimer } from "./MedicalDisclaimer";
import { categoryLabel, PerfCardItem } from "./PerfHubPage";

const HUB_KEYS: Record<PerfHubId, string> = {
  "athletic-performance": "athleticPerformance",
  recovery: "recovery",
  nutrition: "nutrition",
  hydration: "hydration",
  "injury-prevention": "injuryPrevention",
};

function localize(a: PerformanceArticle, lang: Lang) {
  const v = lang === "vi" ? a.vi : undefined;
  return {
    title: pick(lang, a.title, v?.title),
    description: pick(lang, a.description, v?.description),
    whatItDevelops: pick(lang, a.whatItDevelops, v?.whatItDevelops),
    whyBasketball: pick(lang, a.whyBasketball, v?.whyBasketball),
    howTo: pick(lang, a.howTo, v?.howTo),
    coachingPoints: pick(lang, a.coachingPoints, v?.coachingPoints),
    commonMistakes: pick(lang, a.commonMistakes, v?.commonMistakes),
    setsReps: pick(lang, a.setsReps, v?.setsReps),
    basketballTransfer: pick(lang, a.basketballTransfer, v?.basketballTransfer),
    progression: pick(lang, a.progression, v?.progression),
    tags: pick(lang, a.tags, v?.tags),
    duration: pick(lang, a.duration, v?.duration),
  };
}

function Section({ id, icon: Icon, title, children }: {
  id: string; icon: typeof Target; title: string; children: React.ReactNode;
}) {
  return (
    <section id={id} className="neu mt-6 p-6 sm:p-8" aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`} className="mb-4 flex items-center gap-2 text-xl font-extrabold tracking-tight">
        <Icon className="h-5 w-5 text-[color:var(--orange)]" aria-hidden /> {title}
      </h2>
      <div className="space-y-3 text-[15px] leading-relaxed text-[color:var(--ink)]">{children}</div>
    </section>
  );
}

export default function PerfArticleView({ article, related }: {
  article: PerformanceArticle; related: PerformanceArticle[];
}) {
  const { lang, t } = useLanguage();
  const key = HUB_KEYS[article.hub];
  const L = localize(article, lang);
  const videoId = article.video ? youtubeIdFromUrl(article.video.url) : null;
  const crossHub = related.filter((r) => r.hub !== article.hub);
  const sameHub = related.filter((r) => r.hub === article.hub);

  return (
    <div className="pb-6">
      <MetaSync title={`${L.title} | DND Basketball`} description={L.description} />
      <Breadcrumbs items={[
        { label: t("mobile.home"), href: "/" },
        { label: t("perf.landing.title"), href: "/performance" },
        { label: t(`perf.hub.${key}`), href: `/performance/${article.hub}` },
        { label: L.title },
      ]} />

      <header className="neu mb-2 p-6 sm:p-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <LevelBadge level={article.level} />
          <span className="neu-sm inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-[color:var(--muted)]">
            <Clock className="h-3.5 w-3.5" aria-hidden /> {t("perf.duration")}: {L.duration}
          </span>
          <span className="neu-sm inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-[color:var(--muted)]">
            {categoryLabel(article.category, lang)}
          </span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{L.title}</h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[color:var(--muted)]">{L.description}</p>
        {article.equipment.length > 0 && (
          <p className="mt-4 flex flex-wrap items-center gap-2 text-[13px] text-[color:var(--muted)]">
            <Wrench className="h-4 w-4 text-[color:var(--orange)]" aria-hidden />
            <span className="font-bold">{t("perf.equipment")}:</span> {article.equipment.join(" · ")}
          </p>
        )}
      </header>

      {article.medicalDisclaimer && <MedicalDisclaimer className="mt-6" />}

      {L.whatItDevelops.length > 0 && (
        <Section id="develops" icon={CheckCircle2} title={t("perf.whatItDevelops")}>
          <ul className="grid gap-2 sm:grid-cols-2">
            {L.whatItDevelops.map((x, i) => (
              <li key={i} className="neu-inset flex items-start gap-2 p-3 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--orange)]" aria-hidden /> {x}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {L.whyBasketball.length > 0 && (
        <Section id="why" icon={Target} title={t("perf.whyBasketball")}>
          <ul className="list-disc space-y-2 pl-5">
            {L.whyBasketball.map((x, i) => <li key={i}>{x}</li>)}
          </ul>
        </Section>
      )}

      {L.howTo.length > 0 && (
        <Section id="howto" icon={ListOrdered} title={t("perf.howTo")}>
          <ol className="space-y-3">
            {L.howTo.map((s, i) => (
              <li key={i} className="neu-inset flex items-start gap-3 p-4">
                <span className="neu-sm flex h-8 w-8 shrink-0 items-center justify-center text-sm font-extrabold text-[color:var(--orange)]">
                  {i + 1}
                </span>
                <div>
                  <p className="font-bold">{s.title}</p>
                  <p className="mt-0.5 text-sm text-[color:var(--muted)]">{s.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {L.coachingPoints.length > 0 && (
        <Section id="coaching" icon={Lightbulb} title={t("article.coachingPoints")}>
          <ul className="space-y-2">
            {L.coachingPoints.map((x, i) => (
              <li key={i} className="flex items-start gap-2">
                <Lightbulb className="mt-1 h-4 w-4 shrink-0 text-[color:var(--orange)]" aria-hidden />
                <span>{x}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {L.commonMistakes.length > 0 && (
        <Section id="mistakes" icon={AlertTriangle} title={t("article.commonMistakes")}>
          <ul className="space-y-2">
            {L.commonMistakes.map((x, i) => (
              <li key={i} className="flex items-start gap-2">
                <AlertTriangle className="mt-1 h-4 w-4 shrink-0 text-[color:var(--orange)]" aria-hidden />
                <span>{x}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {L.setsReps && (
        <Section id="setsreps" icon={Repeat} title={t("perf.setsReps")}>
          <p className="neu-inset p-4 text-[15px] font-medium">{L.setsReps}</p>
        </Section>
      )}

      {L.basketballTransfer && (
        <Section id="transfer" icon={ArrowRightLeft} title={t("perf.basketballTransfer")}>
          <p>{L.basketballTransfer}</p>
        </Section>
      )}

      {L.progression.length > 0 && (
        <Section id="progression" icon={TrendingUp} title={t("perf.progression")}>
          <ol className="grid gap-3 sm:grid-cols-3">
            {L.progression.map((x, i) => (
              <li key={i} className="neu-inset p-4">
                <p className="mb-1 text-[11px] font-extrabold uppercase tracking-wide text-[color:var(--orange)]">
                  {t(`perf.level.${["beginner", "intermediate", "advanced"][i]}`)}
                </p>
                <p className="text-sm leading-relaxed">{x}</p>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {videoId && (
        <section className="mt-6" aria-labelledby="perf-video-h">
          <div id="perf-video-h">
            <SectionTitle title={article.video?.title ?? "Video"} />
          </div>
          <VideoEmbed youtubeId={videoId} title={article.video?.title ?? L.title} />
        </section>
      )}

      {sameHub.length > 0 && (
        <section className="mt-10" aria-labelledby="perf-related-h">
          <div id="perf-related-h">
            <SectionTitle title={t("perf.relatedTopics")} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {sameHub.map((r) => <PerfCardItem key={r.slug} article={r} />)}
          </div>
        </section>
      )}

      {crossHub.length > 0 && (
        <section className="mt-10" aria-labelledby="perf-continue-h">
          <div id="perf-continue-h">
            <SectionTitle
              title={t("perf.continueDevelopment")}
              description={pick(lang,
                "Keep building the complete player across every hub.",
                "Tiếp tục xây dựng cầu thủ toàn diện qua mọi mảng.")}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {crossHub.map((r) => (
              <a key={r.slug} href={performanceUrl(r.hub, r.slug)} className="neu-card block p-5">
                <p className="mb-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[color:var(--orange)]">
                  {t(`perf.hub.${HUB_KEYS[r.hub]}`)}
                </p>
                <p className="font-bold leading-snug">{pick(lang, r.title, r.vi?.title)}</p>
                <p className="mt-1 line-clamp-2 text-sm text-[color:var(--muted)]">{pick(lang, r.description, r.vi?.description)}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      <RecentTracker item={{
        type: "article", id: article.slug, title: L.title,
        url: performanceUrl(article.hub, article.slug), ts: 0,
      }} />
    </div>
  );
}

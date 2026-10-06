"use client";
import { AlertTriangle, CheckCircle2, Lightbulb, PlayCircle, Target } from "lucide-react";
import type { Article, Drill } from "@/lib/types";
import { articleUrl } from "@/lib/urls";
import { hubById, hubText, hubGroupText } from "@/lib/hubs";
import { useLanguage, pick, type Lang } from "@/lib/i18n";
import CourtDiagram from "./CourtDiagram";
import VideoEmbed, { youtubeIdFromUrl } from "./VideoEmbed";
import FavoriteButton from "./FavoriteButton";
import { Breadcrumbs, LevelBadge, ReadTime, TagChip } from "./ui";
import { KnowledgeCard, DrillCard } from "./cards";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="neu mt-6 p-6 sm:p-8" aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`} className="mb-4 text-xl font-extrabold tracking-tight">{title}</h2>
      <div className="space-y-3 text-[15px] leading-relaxed text-[color:var(--ink)]">{children}</div>
    </section>
  );
}

/** Resolve the display strings for an article in the active language. */
function localize(a: Article, lang: Lang) {
  const v = lang === "vi" ? a.vi : undefined;
  return {
    title: pick(lang, a.title, v?.title),
    description: pick(lang, a.description, v?.description),
    whatIsIt: pick(lang, a.whatIsIt, v?.whatIsIt),
    whyItMatters: pick(lang, a.whyItMatters, v?.whyItMatters),
    howTo: pick(lang, a.howTo, v?.howTo),
    coachingPoints: pick(lang, a.coachingPoints, v?.coachingPoints),
    commonMistakes: pick(lang, a.commonMistakes, v?.commonMistakes),
    gameSituations: pick(lang, a.gameSituations, v?.gameSituations),
    tags: pick(lang, a.tags, v?.tags),
    videoTitle: pick(lang, a.video?.title ?? "", v?.video?.title),
    videoNote: pick(lang, a.video?.note, v?.video?.note),
  };
}

export default function ArticleView({ article, related, drills }: {
  article: Article; related: Article[]; drills: Drill[];
}) {
  const { lang, t } = useLanguage();
  const hub = hubById(article.hub);
  const L = localize(article, lang);

  const crumbs: { label: string; href?: string }[] = [
    { label: t("mobile.home"), href: "/" },
    { label: hub ? hubText(hub, lang, "title") : article.hub, href: hub?.route ?? "/" },
  ];
  if (article.hub === "skills") {
    const group = hub?.groups.find((g) => g.id === article.subcategory);
    crumbs.push({ label: group ? hubGroupText(group, lang, "title") : article.subcategory, href: `/skills/${article.subcategory}` });
  }
  crumbs.push({ label: L.title });

  const videoId = article.video ? youtubeIdFromUrl(article.video.url) : null;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: L.title,
    description: L.description,
    educationalLevel: article.level,
    teaches: L.tags.join(", "),
    url: `https://dndbasketball.vercel.app${articleUrl(article)}`,
    timeRequired: `PT${article.readTime}M`,
  };

  return (
    <div className="mx-auto max-w-4xl px-3 sm:px-5">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={crumbs} />

      <header className="neu p-6 sm:p-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <LevelBadge level={article.level} />
          <span className="rounded-full bg-[color:var(--orange-soft)] px-2.5 py-1 text-[11px] font-bold text-[color:var(--orange)]">
            {hub ? hubText(hub, lang, "tagline") : article.hub}
          </span>
          <ReadTime minutes={article.readTime} />
        </div>
        <h1 className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">{L.title}</h1>
        <p className="mt-3 text-[16px] leading-relaxed text-[color:var(--muted)]">{L.description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[12px] font-semibold text-[color:var(--faint)]">{t("article.ages")}: {article.ages.join(" · ")}</span>
          <span className="text-[color:var(--line)]">|</span>
          <span className="text-[12px] font-semibold text-[color:var(--faint)]">
            {t("article.positions")}: {article.positions.includes("ALL") ? t("article.positionsAll") : article.positions.join(", ")}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">{L.tags.map((tag) => <TagChip key={tag} tag={tag} />)}</div>
        <div className="mt-5">
          <FavoriteButton item={{ type: "article", id: article.slug, title: L.title, url: articleUrl(article), ts: 0 }} />
        </div>
      </header>

      <Section id="what" title={t("article.whatIsIt")}>
        {L.whatIsIt.map((p, i) => <p key={i}>{p}</p>)}
      </Section>

      <Section id="why" title={t("article.whyItMatters")}>
        {L.whyItMatters.map((p, i) => <p key={i}>{p}</p>)}
      </Section>

      <section id="how" className="mt-6" aria-labelledby="how-h">
        <h2 id="how-h" className="mb-4 px-1 text-xl font-extrabold tracking-tight">{t("article.howTo")}</h2>
        <ol className="space-y-3">
          {L.howTo.map((s, i) => (
            <li key={i} className="neu-sm flex gap-4 p-5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color:var(--orange)] text-sm font-extrabold text-white" aria-hidden>{i + 1}</span>
              <div>
                <p className="font-bold">{s.title}</p>
                <p className="mt-1 text-[14px] leading-relaxed text-[color:var(--muted)]">{s.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <Section id="points" title={t("article.coachingPoints")}>
        <ul className="space-y-2.5">
          {L.coachingPoints.map((p, i) => (
            <li key={i} className="flex gap-2.5">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--orange)]" aria-hidden />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="mistakes" title={t("article.commonMistakes")}>
        <ul className="space-y-2.5">
          {L.commonMistakes.map((p, i) => (
            <li key={i} className="flex gap-2.5">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" aria-hidden />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="situations" title={t("article.gameSituations")}>
        <ul className="space-y-2.5">
          {L.gameSituations.map((p, i) => (
            <li key={i} className="flex gap-2.5">
              <Target className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--muted)]" aria-hidden />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </Section>

      {article.diagram && (
        <section id="diagram" className="neu mt-6 p-6 sm:p-8" aria-label="Court diagram">
          <h2 className="mb-4 text-xl font-extrabold tracking-tight">{t("article.diagram")}</h2>
          <CourtDiagram diagram={article.diagram} className="mx-auto max-w-lg" />
        </section>
      )}

      {(videoId || article.video) && (
        <section id="watch" className="mt-6" aria-labelledby="watch-h">
          <h2 id="watch-h" className="mb-4 flex items-center gap-2 px-1 text-xl font-extrabold tracking-tight">
            <PlayCircle className="h-5 w-5 text-[color:var(--orange)]" aria-hidden /> {t("article.watchVideo")}
          </h2>
          {videoId ? <VideoEmbed youtubeId={videoId} title={L.videoTitle} /> : (
            <a href={article.video!.url} target="_blank" rel="noopener noreferrer" className="neu-card block p-5 font-semibold text-[color:var(--orange)]">
              ▶ {t("article.watchVideo")}: {L.videoTitle}
            </a>
          )}
          {L.videoNote && <p className="mt-2 px-1 text-[13px] text-[color:var(--muted)]">{L.videoNote}</p>}
        </section>
      )}

      {drills.length > 0 && (
        <section id="practice" className="mt-10" aria-labelledby="practice-h">
          <h2 id="practice-h" className="mb-4 flex items-center gap-2 px-1 text-xl font-extrabold tracking-tight">
            <Lightbulb className="h-5 w-5 text-[color:var(--orange)]" aria-hidden /> {t("article.relatedDrills")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {drills.map((d) => <DrillCard key={d.slug} drill={d} />)}
          </div>
        </section>
      )}

      <section id="continue" className="mt-10" aria-labelledby="continue-h">
        <h2 id="continue-h" className="mb-1 px-1 text-xl font-extrabold tracking-tight">{t("article.continue")}</h2>
        <p className="mb-4 px-1 text-sm text-[color:var(--muted)]">{t("article.continueDesc")}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {related.map((r) => <KnowledgeCard key={r.slug} article={r} />)}
        </div>
      </section>

      {article.references && article.references.length > 0 && (
        <section className="mt-8 px-1" aria-label="References">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-[color:var(--faint)]">{t("article.references")}</h2>
          <ul className="list-disc pl-5 text-sm text-[color:var(--muted)]">
            {article.references.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </section>
      )}

      <p className="mt-8 px-1 text-[12px] text-[color:var(--faint)]">{t("article.updated")}: {article.dateUpdated}</p>
    </div>
  );
}

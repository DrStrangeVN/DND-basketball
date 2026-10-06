import Link from "next/link";
import { AlertTriangle, CheckCircle2, Lightbulb, PlayCircle, Target } from "lucide-react";
import type { Article } from "@/lib/content";
import { articleUrl, getRelatedArticles, getDrillsForArticle, getArticleBySlug } from "@/lib/content";
import { hubById } from "@/lib/hubs";
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

export default function ArticleView({ article }: { article: Article }) {
  const hub = hubById(article.hub);
  const related = getRelatedArticles(article, 4);
  const drills = getDrillsForArticle(article, 3);
  const crumbs: { label: string; href?: string }[] = [
    { label: "Home", href: "/" },
    { label: hub?.title ?? article.hub, href: hub?.route ?? "/" },
  ];
  if (article.hub === "skills") {
    const group = hub?.groups.find((g) => g.id === article.subcategory);
    crumbs.push({ label: group?.title ?? article.subcategory, href: `/skills/${article.subcategory}` });
  }
  crumbs.push({ label: article.title });

  const videoId = article.video ? youtubeIdFromUrl(article.video.url) : null;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: article.title,
    description: article.description,
    educationalLevel: article.level,
    teaches: article.tags.join(", "),
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
          <span className="rounded-full bg-[color:var(--orange-soft)] px-2.5 py-1 text-[11px] font-bold text-[color:var(--orange)]">{hub?.tagline ?? article.hub}</span>
          <ReadTime minutes={article.readTime} />
        </div>
        <h1 className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">{article.title}</h1>
        <p className="mt-3 text-[16px] leading-relaxed text-[color:var(--muted)]">{article.description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[12px] font-semibold text-[color:var(--faint)]">Ages: {article.ages.join(" · ")}</span>
          <span className="text-[color:var(--line)]">|</span>
          <span className="text-[12px] font-semibold text-[color:var(--faint)]">
            Positions: {article.positions.includes("ALL") ? "All positions" : article.positions.join(", ")}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">{article.tags.map((t) => <TagChip key={t} tag={t} />)}</div>
        <div className="mt-5">
          <FavoriteButton item={{ type: "article", id: article.slug, title: article.title, url: articleUrl(article), ts: 0 }} />
        </div>
      </header>

      <Section id="what" title="What Is It?">
        {article.whatIsIt.map((p, i) => <p key={i}>{p}</p>)}
      </Section>

      <Section id="why" title="Why It Matters">
        {article.whyItMatters.map((p, i) => <p key={i}>{p}</p>)}
      </Section>

      <section id="how" className="mt-6" aria-labelledby="how-h">
        <h2 id="how-h" className="mb-4 px-1 text-xl font-extrabold tracking-tight">How To Do It</h2>
        <ol className="space-y-3">
          {article.howTo.map((s, i) => (
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

      <Section id="points" title="Key Coaching Points">
        <ul className="space-y-2.5">
          {article.coachingPoints.map((p, i) => (
            <li key={i} className="flex gap-2.5">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--orange)]" aria-hidden />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="mistakes" title="Common Mistakes">
        <ul className="space-y-2.5">
          {article.commonMistakes.map((p, i) => (
            <li key={i} className="flex gap-2.5">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" aria-hidden />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="situations" title="Game Situations">
        <ul className="space-y-2.5">
          {article.gameSituations.map((p, i) => (
            <li key={i} className="flex gap-2.5">
              <Target className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--muted)]" aria-hidden />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </Section>

      {article.diagram && (
        <section id="diagram" className="neu mt-6 p-6 sm:p-8" aria-label="Court diagram">
          <h2 className="mb-4 text-xl font-extrabold tracking-tight">Court Diagram</h2>
          <CourtDiagram diagram={article.diagram} className="mx-auto max-w-lg" />
        </section>
      )}

      {(videoId || article.video) && (
        <section id="watch" className="mt-6" aria-labelledby="watch-h">
          <h2 id="watch-h" className="mb-4 flex items-center gap-2 px-1 text-xl font-extrabold tracking-tight">
            <PlayCircle className="h-5 w-5 text-[color:var(--orange)]" aria-hidden /> Watch
          </h2>
          {videoId ? <VideoEmbed youtubeId={videoId} title={article.video!.title} /> : (
            <a href={article.video!.url} target="_blank" rel="noopener noreferrer" className="neu-card block p-5 font-semibold text-[color:var(--orange)]">
              ▶ Watch: {article.video!.title}
            </a>
          )}
          {article.video?.note && <p className="mt-2 px-1 text-[13px] text-[color:var(--muted)]">{article.video.note}</p>}
        </section>
      )}

      {drills.length > 0 && (
        <section id="practice" className="mt-10" aria-labelledby="practice-h">
          <h2 id="practice-h" className="mb-4 flex items-center gap-2 px-1 text-xl font-extrabold tracking-tight">
            <Lightbulb className="h-5 w-5 text-[color:var(--orange)]" aria-hidden /> Practice It
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {drills.map((d) => <DrillCard key={d.slug} drill={d} />)}
          </div>
        </section>
      )}

      <section id="continue" className="mt-10" aria-labelledby="continue-h">
        <h2 id="continue-h" className="mb-1 px-1 text-xl font-extrabold tracking-tight">Continue Learning</h2>
        <p className="mb-4 px-1 text-sm text-[color:var(--muted)]">No dead ends — keep building on this concept.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {related.map((r) => <KnowledgeCard key={r.slug} article={r} />)}
        </div>
      </section>

      {article.references && article.references.length > 0 && (
        <section className="mt-8 px-1" aria-label="References">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-[color:var(--faint)]">References & Further Learning</h2>
          <ul className="list-disc pl-5 text-sm text-[color:var(--muted)]">
            {article.references.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </section>
      )}

      <p className="mt-8 px-1 text-[12px] text-[color:var(--faint)]">Last updated: {article.dateUpdated}</p>
    </div>
  );
}

export function RelatedArticleLink({ slug }: { slug: string }) {
  const a = getArticleBySlug(slug);
  if (!a) return null;
  return <Link href={articleUrl(a)} className="font-semibold text-[color:var(--orange)] hover:underline">{a.title}</Link>;
}

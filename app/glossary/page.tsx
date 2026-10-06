import type { Metadata } from "next";
import { getGlossary, getArticleBySlug, articleUrl } from "@/lib/content";
import GlossaryBrowser from "@/components/GlossaryBrowser";
import { Breadcrumbs } from "@/components/ui";

export const metadata: Metadata = {
  title: "Basketball Dictionary — A to Z Glossary",
  description: "Basketball terminology A to Z: ATO, blitz, closeout, DHO, drop coverage, ghost screen, ICE, Spain PnR and more — with instant search.",
  alternates: { canonical: "https://dndbasketball.vercel.app/glossary" },
};

export default function GlossaryPage() {
  const terms = getGlossary().map((t) => ({
    term: t.term, slug: t.slug, definition: t.definition,
    relatedArticles: t.related
      .map((s) => getArticleBySlug(s))
      .filter((a): a is NonNullable<typeof a> => Boolean(a))
      .map((a) => ({ title: a.title, url: articleUrl(a) })),
  }));
  return (
    <div className="pb-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Basketball Dictionary" }]} />
      <header className="neu mb-6 p-6 sm:p-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--orange)]">A – Z</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">Basketball Dictionary</h1>
        <p className="mt-2 max-w-2xl text-[15px] text-[color:var(--muted)]">
          Every term a player, parent or new fan needs — from ATO to Zoom Action. Instant search, no page reloads.
        </p>
      </header>
      <GlossaryBrowser terms={terms} />
    </div>
  );
}

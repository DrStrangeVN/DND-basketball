import type { Metadata } from "next";
import { getGlossary, getArticleBySlug, articleUrl } from "@/lib/content";
import GlossaryPageClient from "@/components/GlossaryPageClient";

export const metadata: Metadata = {
  title: "Từ điển bóng rổ A–Z | DND Basketball",
  description: "Thuật ngữ bóng rổ A–Z: ATO, blitz, closeout, DHO, drop coverage, ghost screen, ICE, Spain PnR và hơn nữa — tìm kiếm tức thì.",
  alternates: { canonical: "https://dndbasketball.vercel.app/glossary" },
};

export default function GlossaryPage() {
  const terms = getGlossary().map((t) => ({
    term: t.term, slug: t.slug, definition: t.definition, definitionVi: t.vi?.definition,
    relatedArticles: t.related
      .map((s) => getArticleBySlug(s))
      .filter((a): a is NonNullable<typeof a> => Boolean(a))
      .map((a) => ({ title: a.title, titleVi: a.vi?.title, url: articleUrl(a) })),
  }));
  return <GlossaryPageClient terms={terms} />;
}

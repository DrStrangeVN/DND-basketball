"use client";
import Link from "next/link";
import type { LearningPath } from "@/lib/types";
import { Breadcrumbs, LevelBadge } from "@/components/ui";
import PathProgress, { type ResolvedStepArticle } from "@/components/PathProgress";
import FavoriteButton from "@/components/FavoriteButton";
import { useLanguage, pick } from "@/lib/i18n";

export default function PathView({ path, stepArticles }: {
  path: LearningPath; stepArticles: ResolvedStepArticle[][];
}) {
  const { lang, t } = useLanguage();
  const v = lang === "vi" ? path.vi : undefined;
  const title = pick(lang, path.title, v?.title);
  const url = `/learning-paths/${path.slug}`;

  return (
    <div className="mx-auto max-w-3xl pb-6">
      <Breadcrumbs items={[
        { label: t("mobile.home"), href: "/" },
        { label: t("paths.title"), href: "/learning-paths" },
        { label: title },
      ]} />

      <header className="neu mb-6 p-6 sm:p-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <LevelBadge level={path.level} />
          <span className="rounded-full bg-[color:var(--orange-soft)] px-2.5 py-1 text-[11px] font-bold text-[color:var(--orange)]">
            {path.steps.length} {t("paths.steps")}
          </span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-3 text-[16px] text-[color:var(--muted)]">{pick(lang, path.description, v?.description)}</p>
        <p className="mt-2 text-[13px] font-semibold text-[color:var(--faint)]">{t("paths.audience")}: {pick(lang, path.audience, v?.audience)}</p>
        <div className="mt-4"><FavoriteButton item={{ type: "path", id: path.slug, title, url, ts: 0 }} /></div>
      </header>

      <PathProgress path={path} stepArticles={stepArticles} />

      <p className="mt-8 px-1 text-[12px]">
        <Link href="/learning-paths" className="font-semibold text-[color:var(--orange)]">← {t("paths.backTo")}</Link>
      </p>
    </div>
  );
}

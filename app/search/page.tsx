"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { fuzzySearch } from "@/lib/fuzzy-search";
import { useLanguage, pick } from "@/lib/i18n";
import { Search, BookOpen, Dumbbell, Timer, Route, BookMarked, X } from "lucide-react";
import { Breadcrumbs, LevelBadge } from "@/components/ui";

interface Entry {
  type: "article" | "drill" | "workout" | "path" | "glossary";
  id: string; title: string; description: string; hub: string;
  subcategory: string; level: string; tags: string[]; url: string;
  titleVi?: string; descriptionVi?: string; tagsVi?: string[];
}
const TYPE_ICON = { article: BookOpen, drill: Dumbbell, workout: Timer, path: Route, glossary: BookMarked } as const;
const TYPES = ["article", "drill", "workout", "path", "glossary"] as const;
const LEVELS = ["beginner", "intermediate", "advanced", "elite"];

function SearchView() {
  const params = useSearchParams();
  const router = useRouter();
  const { lang, t } = useLanguage();
  const [index, setIndex] = useState<Entry[] | null>(null);
  const [q, setQ] = useState(params.get("q") ?? "");
  const [type, setType] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(params.get("level"));

  useEffect(() => {
    fetch("/search-index.json").then((r) => r.json()).then(setIndex).catch(() => {});
  }, []);

  const tag = params.get("tag");
  const results = useMemo(() => {
    if (!index) return [];
    let items: Entry[];
    const needle = q.trim();
    if (tag) items = index.filter((e) => [...e.tags, ...(e.tagsVi ?? [])].includes(tag.toLowerCase()));
    else if (level && !needle) items = index.filter((e) => e.level === level);
    else if (!needle) items = [];
    else items = fuzzySearch(index, needle, 60);
    if (type) items = items.filter((e) => e.type === type);
    if (level && needle) items = items.filter((e) => e.level === level);
    return items.slice(0, 60);
  }, [index, q, type, level, tag]);

  const clearTag = () => router.push("/search");
  const TYPE_LABEL: Record<string, string> = {
    article: t("search.articles"), drill: t("search.drills"), workout: t("search.workouts"),
    path: t("search.paths"), glossary: t("search.glossary"),
  };

  return (
    <div className="pb-6">
      <Breadcrumbs items={[{ label: t("mobile.home"), href: "/" }, { label: t("search.title") }]} />
      <header className="neu mb-6 p-6 sm:p-8">
        <h1 className="text-3xl font-extrabold tracking-tight">{t("search.pageTitle")}</h1>
        <div className="neu-input mt-4 flex items-center gap-2 px-5 py-3">
          <Search className="h-5 w-5 shrink-0 text-[color:var(--orange)]" aria-hidden />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("search.placeholder")}
            aria-label={t("search.title")} className="w-full bg-transparent text-[15px] outline-none placeholder:text-[color:var(--faint)]" />
          {q && <button onClick={() => setQ("")} aria-label={t("search.clear")}><X className="h-4 w-4 text-[color:var(--faint)]" /></button>}
        </div>
        {tag && (
          <p className="mt-3 text-sm text-[color:var(--muted)]">
            {t("search.tagged")} <strong className="text-[color:var(--orange)]">#{tag}</strong>
            <button onClick={clearTag} className="ml-2 font-semibold underline">{t("search.clearTag")}</button>
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {TYPES.map((ty) => (
            <button key={ty} onClick={() => setType(type === ty ? null : ty)} aria-pressed={type === ty}
              className={`neu-btn px-3.5 py-1.5 text-[13px] font-semibold ${type === ty ? "text-[color:var(--orange)] ring-2 ring-[color:var(--orange)]" : "text-[color:var(--muted)]"}`}>
              {TYPE_LABEL[ty]}
            </button>
          ))}
          <span className="mx-1 hidden h-6 w-px bg-[color:var(--line)] sm:block" aria-hidden />
          {LEVELS.map((l) => (
            <button key={l} onClick={() => setLevel(level === l ? null : l)} aria-pressed={level === l}
              className={`neu-btn px-3.5 py-1.5 text-[13px] font-semibold ${level === l ? "text-[color:var(--orange)] ring-2 ring-[color:var(--orange)]" : "text-[color:var(--muted)]"}`}>
              {t(`article.level.${l}`)}
            </button>
          ))}
        </div>
      </header>

      <p className="mb-4 px-1 text-sm text-[color:var(--muted)]" role="status">
        {!index ? t("common.loading") : `${results.length} ${t("search.results")}`}
      </p>
      <ul className="space-y-3">
        {results.map((r) => {
          const Icon = TYPE_ICON[r.type];
          return (
            <li key={r.type + r.id}>
              <Link href={r.url} className="neu-card flex items-center gap-4 p-4">
                <span className="neu-sm flex h-11 w-11 shrink-0 items-center justify-center">
                  <Icon className="h-5 w-5 text-[color:var(--orange)]" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-bold">{pick(lang, r.title, r.titleVi)}</span>
                  <span className="block truncate text-[13px] text-[color:var(--muted)]">{pick(lang, r.description, r.descriptionVi)}</span>
                </span>
                <LevelBadge level={r.level} className="hidden shrink-0 sm:inline-flex" />
              </Link>
            </li>
          );
        })}
      </ul>
      {index && results.length === 0 && (q.trim() || tag || level) && (
        <div className="neu p-10 text-center text-sm text-[color:var(--muted)]">
          {t("search.tryDifferent")}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="neu p-10 text-center text-sm text-[color:var(--muted)]">…</div>}>
      <SearchView />
    </Suspense>
  );
}

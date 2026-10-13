"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { fuzzySearch } from "@/lib/fuzzy-search";
import { useLanguage, pick } from "@/lib/i18n";
import { Search, BookOpen, Dumbbell, Timer, Route, BookMarked, Activity, X, type LucideIcon } from "lucide-react";
import { Breadcrumbs, LevelBadge } from "@/components/ui";

interface Entry {
  type: string;
  id: string; title: string; description: string; hub: string;
  subcategory: string; level: string; tags: string[]; url: string;
  titleVi?: string; descriptionVi?: string; tagsVi?: string[];
}
const TYPE_ICON: Record<string, LucideIcon> = { article: BookOpen, drill: Dumbbell, workout: Timer, path: Route, glossary: BookMarked, performance: Activity };
const TYPES = ["article", "drill", "workout", "path", "glossary", "performance"] as const;
const LEVELS = ["beginner", "intermediate", "advanced", "elite"];

function SearchView() {
  const params = useSearchParams();
  const router = useRouter();
  const { lang, t } = useLanguage();
  const [index, setIndex] = useState<Entry[] | null>(null);
  const [indexError, setIndexError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [q, setQ] = useState(params.get("q") ?? "");
  const [type, setType] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(params.get("level"));

  useEffect(() => {
    const controller = new AbortController();
    setIndexError(false);
    fetch("/search-index.json", { signal: controller.signal }).then(async (r) => {
      if (!r.ok) throw new Error("Search unavailable");
      const data = await r.json();
      if (!Array.isArray(data)) throw new Error("Invalid search index");
      return data.filter((entry) => entry && typeof entry.title === "string" && typeof entry.url === "string")
        .map((entry) => ({ ...entry, description: entry.description || "", hub: entry.hub || "", tags: Array.isArray(entry.tags) ? entry.tags : [], tagsVi: Array.isArray(entry.tagsVi) ? entry.tagsVi : [] }));
    }).then(setIndex).catch((error) => {
      if (error.name !== "AbortError") setIndexError(true);
    });
    return () => controller.abort();
  }, [attempt]);

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
    performance: t("search.performance"),
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

      {indexError ? <div className="neu mb-4 p-5" role="alert">
        <p>{lang === "vi" ? "Chưa tải được dữ liệu tìm kiếm. Kiểm tra kết nối rồi thử lại." : "Search data could not load. Check your connection and try again."}</p>
        <button className="neu-btn mt-3 px-4 py-2" onClick={() => setAttempt((value) => value + 1)}>{lang === "vi" ? "Thử lại" : "Try again"}</button>
      </div> : <p className="mb-4 px-1 text-sm text-[color:var(--muted)]" role="status">
        {!index ? t("common.loading") : `${results.length} ${t("search.results")}`}
      </p>}
      <ul className="space-y-3">
        {results.map((r) => {
          const Icon = Object.hasOwn(TYPE_ICON, r.type) ? TYPE_ICON[r.type] : BookOpen;
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

"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { fuzzySearch } from "@/lib/fuzzy-search";
import { useLanguage, pick } from "@/lib/i18n";
import { Search, X, BookOpen, Dumbbell, Timer, Route, BookMarked, TrendingUp, ArrowRight } from "lucide-react";

interface Entry {
  type: "article" | "drill" | "workout" | "path" | "glossary";
  id: string; title: string; description: string; hub: string;
  subcategory: string; level: string; tags: string[]; url: string;
  titleVi?: string; descriptionVi?: string; tagsVi?: string[];
}

const TYPE_ICON: Record<Entry["type"], typeof BookOpen> = {
  article: BookOpen, drill: Dumbbell, workout: Timer, path: Route, glossary: BookMarked,
};

export default function SearchModal() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [index, setIndex] = useState<Entry[] | null>(null);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { lang, t } = useLanguage();

  const TYPE_LABEL: Record<Entry["type"], string> = {
    article: t("search.articles"), drill: t("search.drills"), workout: t("search.workouts"),
    path: t("search.paths"), glossary: t("search.glossary"),
  };
  const POPULAR = lang === "vi"
    ? ["pick and roll", "ném rổ", "phòng thủ zone", "crossover", "giãn cách", "euro step"]
    : ["pick & roll", "shooting mechanics", "zone defense", "crossover", "spacing", "euro step"];

  const results = useMemo(() => {
    if (!index || q.trim().length < 2) return [];
    return fuzzySearch(index, q.trim(), 8);
  }, [index, q]);

  const openModal = useCallback(() => setOpen(true), []);
  useEffect(() => {
    const h = () => openModal();
    const kh = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openModal(); }
      else if (e.key === "/" && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) { e.preventDefault(); openModal(); }
    };
    window.addEventListener("dnd:open-search", h);
    window.addEventListener("keydown", kh);
    return () => { window.removeEventListener("dnd:open-search", h); window.removeEventListener("keydown", kh); };
  }, [openModal]);

  useEffect(() => {
    if (open) {
      setQ(""); setActive(0);
      if (!index) fetch("/search-index.json").then((r) => r.json()).then(setIndex).catch(() => {});
      setTimeout(() => inputRef.current?.focus(), 30);
      document.body.style.overflow = "hidden";
    } else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => setActive(0), [q]);

  const go = (url: string) => { setOpen(false); router.push(url); };
  const submit = () => {
    if (results[active]) go(results[active].url);
    else if (q.trim()) go(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center p-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label={t("search.title")}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setOpen(false)} />
      <div className="neu relative w-full max-w-xl overflow-hidden">
        <div className="flex items-center gap-2 border-b border-[color:var(--line)] px-4">
          <Search className="h-5 w-5 shrink-0 text-[color:var(--orange)]" aria-hidden />
          <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(false);
              else if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
              else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
              else if (e.key === "Enter") submit();
            }}
            placeholder={t("search.placeholder")}
            aria-label={t("search.title")}
            className="w-full bg-transparent py-4 text-[15px] outline-none placeholder:text-[color:var(--faint)]" />
          <button onClick={() => setOpen(false)} aria-label={t("common.close")} className="neu-btn flex h-8 w-8 items-center justify-center">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[55vh] overflow-y-auto nice-scroll p-2">
          {q.trim().length < 2 ? (
            <div className="p-3">
              <p className="mb-2 flex items-center gap-1.5 px-1 text-[11px] font-bold uppercase tracking-wider text-[color:var(--faint)]">
                <TrendingUp className="h-3.5 w-3.5" /> {t("search.popular")}
              </p>
              <div className="flex flex-wrap gap-2">
                {POPULAR.map((p) => (
                  <button key={p} onClick={() => setQ(p)} className="neu-btn px-3.5 py-1.5 text-[13px] font-medium text-[color:var(--muted)] hover:text-[color:var(--orange)]">{p}</button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-6 text-center text-sm text-[color:var(--muted)]">
              {t("search.noResults")} “{q}”.
              <button onClick={submit} className="mt-2 inline-flex items-center gap-1 font-semibold text-[color:var(--orange)]">
                {t("search.searchAll")} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <ul>
              {results.map((r, i) => {
                const Icon = TYPE_ICON[r.type];
                return (
                  <li key={r.type + r.id}>
                    <button onClick={() => go(r.url)}
                      onMouseEnter={() => setActive(i)}
                      className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left ${i === active ? "bg-[color:var(--orange-soft)]" : ""}`}>
                      <span className="neu-sm flex h-9 w-9 shrink-0 items-center justify-center">
                        <Icon className="h-4 w-4 text-[color:var(--orange)]" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">{pick(lang, r.title, r.titleVi)}</span>
                        <span className="block truncate text-xs text-[color:var(--muted)]">{pick(lang, r.description, r.descriptionVi)}</span>
                      </span>
                      <span className="shrink-0 rounded-full bg-[color:var(--surface-2)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[color:var(--muted)]">{TYPE_LABEL[r.type]}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-[color:var(--line)] px-4 py-2 text-[11px] text-[color:var(--faint)]">
          <span>{t("search.hint")}</span>
          {q.trim().length >= 2 && <button onClick={submit} className="font-semibold text-[color:var(--orange)]">{t("search.viewAll")} →</button>}
        </div>
      </div>
    </div>
  );
}

export function openSearch() {
  window.dispatchEvent(new Event("dnd:open-search"));
}

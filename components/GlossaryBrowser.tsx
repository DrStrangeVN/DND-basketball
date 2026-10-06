"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ArrowUpRight } from "lucide-react";
import { useLanguage, pick } from "@/lib/i18n";

export interface GlossaryEntry {
  term: string; slug: string; definition: string; definitionVi?: string;
  relatedArticles: { title: string; titleVi?: string; url: string }[];
}

export default function GlossaryBrowser({ terms }: { terms: GlossaryEntry[] }) {
  const [q, setQ] = useState("");
  const [letter, setLetter] = useState<string | null>(null);
  const { lang, t } = useLanguage();

  const letters = useMemo(() => {
    const s = new Set(terms.map((t) => t.term[0].toUpperCase()));
    return [...s].sort();
  }, [terms]);

  const filtered = useMemo(() => terms.filter((t) => {
    if (letter && t.term[0].toUpperCase() !== letter) return false;
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      const hay = (t.term + " " + t.definition + " " + (t.definitionVi ?? "")).toLowerCase();
      if (!hay.includes(needle)) return false;
    }
    return true;
  }), [terms, q, letter]);

  return (
    <div>
      <div className="neu mb-5 p-5 sm:p-6">
        <div className="neu-input flex items-center gap-2 px-4 py-2.5">
          <Search className="h-4 w-4 shrink-0 text-[color:var(--faint)]" aria-hidden />
          <input value={q} onChange={(e) => { setQ(e.target.value); setLetter(null); }}
            placeholder={t("glossary.searchPlaceholder")} aria-label={t("glossary.title")}
            className="w-full bg-transparent text-sm outline-none placeholder:text-[color:var(--faint)]" />
        </div>
        <div className="nice-scroll mt-4 flex gap-1.5 overflow-x-auto pb-1" role="group" aria-label={t("glossary.filterLetter")}>
          <button onClick={() => setLetter(null)}
            className={`neu-btn h-9 w-9 shrink-0 text-[13px] font-bold ${!letter ? "text-[color:var(--orange)] ring-2 ring-[color:var(--orange)]" : "text-[color:var(--muted)]"}`}
            aria-pressed={!letter}>{t("common.all")}</button>
          {letters.map((l) => (
            <button key={l} onClick={() => setLetter(letter === l ? null : l)}
              className={`neu-btn h-9 w-9 shrink-0 text-[13px] font-bold ${letter === l ? "text-[color:var(--orange)] ring-2 ring-[color:var(--orange)]" : "text-[color:var(--muted)]"}`}
              aria-pressed={letter === l}>{l}</button>
          ))}
        </div>
      </div>

      <p className="mb-4 px-1 text-sm text-[color:var(--muted)]" role="status">{filtered.length} {t("glossary.terms")}</p>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((term) => (
          <article key={term.slug} id={`term-${term.slug}`} className="neu scroll-mt-32 p-5">
            <h2 className="text-[17px] font-extrabold tracking-tight">{term.term}</h2>
            <p className="mt-1.5 text-[14px] leading-relaxed text-[color:var(--muted)]">{pick(lang, term.definition, term.definitionVi)}</p>
            {term.relatedArticles.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {term.relatedArticles.map((r) => (
                  <Link key={r.url} href={r.url}
                    className="inline-flex items-center gap-1 rounded-full bg-[color:var(--orange-soft)] px-3 py-1 text-[12px] font-semibold text-[color:var(--orange)] hover:underline">
                    {pick(lang, r.title, r.titleVi)} <ArrowUpRight className="h-3 w-3" aria-hidden />
                  </Link>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="neu p-10 text-center text-sm text-[color:var(--muted)]">{t("glossary.noMatch")}</div>
      )}
    </div>
  );
}

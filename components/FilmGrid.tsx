"use client";
import { useMemo, useState } from "react";
import VideoEmbed from "./VideoEmbed";
import type { FilmVideo } from "@/lib/types";
import { useLanguage, pick } from "@/lib/i18n";
import { LevelBadge } from "./ui";

export default function FilmGrid({ films }: { films: FilmVideo[] }) {
  const { lang, t } = useLanguage();
  const cats = useMemo(() => ["All", ...Array.from(new Set(films.map((f) => pick(lang, f.category, f.vi?.category))))], [films, lang]);
  const [cat, setCat] = useState("All");
  const filtered = cat === "All" ? films : films.filter((f) => pick(lang, f.category, f.vi?.category) === cat);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c}
            className={`neu-btn px-4 py-2 text-[13px] font-semibold ${cat === c ? "text-[color:var(--orange)] ring-2 ring-[color:var(--orange)]" : "text-[color:var(--muted)]"}`}>
            {c === "All" ? t("common.all") : c}
          </button>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {filtered.map((f) => (
          <article key={f.id} id={`film-${f.id}`} className="scroll-mt-32">
            <VideoEmbed youtubeId={f.youtubeId} title={pick(lang, f.title, f.vi?.title)} />
            <div className="mt-3 px-1">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[color:var(--orange)]">{pick(lang, f.category, f.vi?.category)}</span>
                <LevelBadge level={f.level} />
                <span className="text-[11px] text-[color:var(--faint)]">{f.source} · {f.duration}</span>
              </div>
              <h2 className="text-[16px] font-bold leading-snug">{pick(lang, f.title, f.vi?.title)}</h2>
              <p className="mt-1 text-[13px] leading-relaxed text-[color:var(--muted)]">{pick(lang, f.description, f.vi?.description)}</p>
            </div>
          </article>
        ))}
      </div>
      <p className="neu mt-8 p-5 text-[13px] leading-relaxed text-[color:var(--muted)]">
        {t("film.disclaimer")}
      </p>
    </div>
  );
}

"use client";
import { useMemo, useState } from "react";
import VideoEmbed from "./VideoEmbed";
import type { FilmVideo } from "@/lib/types";
import { LevelBadge } from "./ui";

export default function FilmGrid({ films }: { films: FilmVideo[] }) {
  const cats = useMemo(() => ["All", ...Array.from(new Set(films.map((f) => f.category)))], [films]);
  const [cat, setCat] = useState("All");
  const filtered = cat === "All" ? films : films.filter((f) => f.category === cat);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c}
            className={`neu-btn px-4 py-2 text-[13px] font-semibold ${cat === c ? "text-[color:var(--orange)] ring-2 ring-[color:var(--orange)]" : "text-[color:var(--muted)]"}`}>
            {c}
          </button>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {filtered.map((f) => (
          <article key={f.id} id={`film-${f.id}`} className="scroll-mt-32">
            <VideoEmbed youtubeId={f.youtubeId} title={f.title} />
            <div className="mt-3 px-1">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[color:var(--orange)]">{f.category}</span>
                <LevelBadge level={f.level} />
                <span className="text-[11px] text-[color:var(--faint)]">{f.source} · {f.duration}</span>
              </div>
              <h2 className="text-[16px] font-bold leading-snug">{f.title}</h2>
              <p className="mt-1 text-[13px] leading-relaxed text-[color:var(--muted)]">{f.description}</p>
            </div>
          </article>
        ))}
      </div>
      <p className="neu mt-8 p-5 text-[13px] leading-relaxed text-[color:var(--muted)]">
        Videos are embedded from public YouTube sources and load only when you press play. DND Basketball does not host any video —
        creators are credited by channel name above each breakdown.
      </p>
    </div>
  );
}

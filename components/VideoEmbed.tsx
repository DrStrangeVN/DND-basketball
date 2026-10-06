"use client";
import { useLanguage } from "@/lib/i18n";
import { useState } from "react";
import { Play } from "lucide-react";

export function youtubeIdFromUrl(url: string): string | null {
  const m = url.match(/[?&]v=([\w-]{11})/) ?? url.match(/youtu\.be\/([\w-]{11})/) ?? url.match(/embed\/([\w-]{11})/);
  return m ? m[1] : null;
}

export default function VideoEmbed({ youtubeId, title }: { youtubeId: string; title: string }) {
  const { t } = useLanguage();
  const [play, setPlay] = useState(false);
  if (play) {
    return (
      <div className="neu-inset overflow-hidden p-2">
        <div className="relative aspect-video overflow-hidden rounded-xl">
          <iframe src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
            title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen loading="lazy" className="absolute inset-0 h-full w-full" />
        </div>
      </div>
    );
  }
  return (
    <button onClick={() => setPlay(true)} aria-label={`${t("film.watch")}: ${title}`}
      className="neu-card group block w-full overflow-hidden p-2 text-left">
      <span className="relative block aspect-video overflow-hidden rounded-xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`} alt="" loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
        <span className="absolute inset-0 flex items-center justify-center bg-black/25">
          <span className="neu-sm flex h-14 w-14 items-center justify-center">
            <Play className="h-6 w-6 fill-[color:var(--orange)] text-[color:var(--orange)]" aria-hidden />
          </span>
        </span>
      </span>
      <span className="block px-2 py-2 text-sm font-semibold">▶ {t("film.watch")} — {title}</span>
    </button>
  );
}

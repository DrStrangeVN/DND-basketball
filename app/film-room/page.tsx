import type { Metadata } from "next";
import { getFilms } from "@/lib/content";
import FilmGrid from "@/components/FilmGrid";
import { Breadcrumbs } from "@/components/ui";

export const metadata: Metadata = {
  title: "Film Room — Basketball Breakdowns",
  description: "Curated public basketball breakdowns: pick & roll, Spain PnR, shooting mechanics, zone offense and film study. Lazy-loaded YouTube embeds.",
  alternates: { canonical: "https://dndbasketball.vercel.app/film-room" },
};

export default function FilmRoomPage() {
  const films = getFilms();
  return (
    <div className="pb-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Film Room" }]} />
      <header className="neu mb-6 p-6 sm:p-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--orange)]">🎬 Watch & Learn</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">Film Room</h1>
        <p className="mt-2 max-w-2xl text-[15px] text-[color:var(--muted)]">
          Hand-picked public breakdowns from respected coaches and analysts. Click any thumbnail to load the video — nothing autoplays, nothing is hosted here.
        </p>
      </header>
      <FilmGrid films={films} />
    </div>
  );
}

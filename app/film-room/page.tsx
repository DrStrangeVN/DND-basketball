import type { Metadata } from "next";
import { getFilms } from "@/lib/content";
import FilmGrid from "@/components/FilmGrid";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Phòng Film — Phân tích bóng rổ",
  description: "Video phân tích bóng rổ tuyển chọn: pick & roll, Spain PnR, kỹ thuật ném, tấn công zone và xem film. Nhúng YouTube tải lười.",
  alternates: { canonical: "https://dndbasketball.vercel.app/film-room" },
};

export default function FilmRoomPage() {
  const films = getFilms();
  return (
    <div className="pb-6">
      <PageHeader
        crumbs={[{ labelKey: "mobile.home", href: "/" }, { labelKey: "nav.filmRoom" }]}
        eyebrowKey="home.film.eyebrow"
        titleKey="film.title"
        descKey="film.pageDesc"
      />
      <FilmGrid films={films} />
    </div>
  );
}

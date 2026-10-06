import type { Metadata } from "next";
import { getFilms } from "@/lib/content";
import FilmGrid from "@/components/FilmGrid";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Phòng phim — Phân tích bóng rổ",
  description: "Video phân tích bóng rổ tuyển chọn: pick & roll, Spain PnR, kỹ thuật ném, tấn công zone và phân tích trận đấu. Video YouTube nhúng, chỉ tải khi bạn bấm xem.",
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

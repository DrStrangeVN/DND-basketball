import type { Metadata } from "next";
import LibraryView from "@/components/LibraryView";

export const metadata: Metadata = {
  title: "Thư viện bóng rổ của bạn",
  description: "Các khái niệm, bài tập, giáo án tập và lộ trình bóng rổ bạn đã lưu — lưu trên thiết bị của bạn.",
  alternates: { canonical: "https://learn.danangdragons.com/library" },
};

export default function LibraryPage() {
  return <LibraryView />;
}

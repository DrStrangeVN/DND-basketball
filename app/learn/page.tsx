import type { Metadata } from "next";
import LearnClient from "@/components/LearnClient";

export const metadata: Metadata = {
  title: "Học bóng rổ — Tất cả trung tâm kiến thức",
  description: "Duyệt mọi trung tâm kiến thức bóng rổ: căn bản, kỹ năng, chiến thuật, IQ bóng rổ, bài tập, huấn luyện và hơn nữa.",
  alternates: { canonical: "https://dndbasketball.vercel.app/learn" },
};

export default function LearnPage() {
  return <LearnClient />;
}

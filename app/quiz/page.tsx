import type { Metadata } from "next";
import QuizClient from "@/components/QuizClient";

export const metadata: Metadata = {
  title: "Quiz đầu vào — Tìm lộ trình học phù hợp",
  description:
    "Trả lời 9 câu hỏi ngắn để nhận lộ trình học bóng rổ phù hợp nhất với trình độ, mục tiêu và thời gian của bạn.",
  alternates: { canonical: "https://dndbasketball.vercel.app/quiz" },
};

export default function QuizPage() {
  return <QuizClient />;
}

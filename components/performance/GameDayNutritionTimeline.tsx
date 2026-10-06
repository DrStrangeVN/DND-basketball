"use client";

import { Coffee, UtensilsCrossed, Apple, Trophy, Salad, MoonStar } from "lucide-react";
import { useLanguage, pick } from "@/lib/i18n";

interface Stage {
  icon: typeof Coffee;
  en: string;
  vi: string;
  enBody: string;
  viBody: string;
}

const STAGES: Stage[] = [
  {
    icon: Coffee,
    en: "Breakfast", vi: "Bữa sáng",
    enBody: "Carb-rich meal 3–4 hours before tip-off. Familiar foods only.",
    viBody: "Ăn giàu tinh bột trước giờ bóng lăn 3–4 tiếng. Chỉ ăn món quen thuộc.",
  },
  {
    icon: UtensilsCrossed,
    en: "Pre-game meal", vi: "Bữa trước trận",
    enBody: "Eaten 3 hours before the game: rice or noodles, lean protein, light vegetables.",
    viBody: "Ăn trước trận 3 tiếng: cơm hoặc mì, đạm nạc, rau nhẹ.",
  },
  {
    icon: Apple,
    en: "Pre-game snack", vi: "Ăn nhẹ trước trận",
    enBody: "30–60 minutes before: banana, bread, or a small carb snack. Sip water.",
    viBody: "Trước trận 30–60 phút: chuối, bánh mì hoặc món nhẹ giàu tinh bột. Nhấp nước.",
  },
  {
    icon: Trophy,
    en: "Game", vi: "Thi đấu",
    enBody: "Small sips of water at breaks. Sports drink only if sweating heavily.",
    viBody: "Nhấp nước từng ngụm nhỏ khi nghỉ. Chỉ dùng nước điện giải khi ra nhiều mồ hôi.",
  },
  {
    icon: Salad,
    en: "Post-game recovery", vi: "Phục hồi sau trận",
    enBody: "Within 1 hour: carbs + protein + fluids. Example: rice, chicken, vegetables, water.",
    viBody: "Trong 1 giờ sau trận: tinh bột + đạm + nước. Ví dụ: cơm, thịt gà, rau, nước.",
  },
  {
    icon: MoonStar,
    en: "Dinner", vi: "Bữa tối",
    enBody: "Complete balanced meal. Keep hydrating through the evening.",
    viBody: "Bữa tối đầy đủ, cân bằng. Tiếp tục bù nước trong buổi tối.",
  },
];

export function GameDayNutritionTimeline() {
  const { lang } = useLanguage();
  const title = pick(lang, "Game-day nutrition timeline", "Dòng thời gian dinh dưỡng ngày thi đấu");

  return (
    <section aria-label={title} className="neu p-6 sm:p-8">
      <h2 className="text-xl font-extrabold sm:text-2xl">{title}</h2>
      <ol className="relative mt-6 space-y-5 before:absolute before:bottom-6 before:left-[23px] before:top-6 before:w-0.5 before:rounded before:bg-[color:var(--surface-2)]">
        {STAGES.map((s, i) => (
          <li key={s.en} className="relative flex gap-4 pl-1">
            <span
              className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                i === 3 ? "bg-[color:var(--orange)] text-white" : "neu-sm text-[color:var(--orange)]"
              }`}
              aria-hidden
            >
              <s.icon className="h-5 w-5" />
            </span>
            <div className="neu-sm flex-1 p-4">
              <p className="font-extrabold">{pick(lang, s.en, s.vi)}</p>
              <p className="mt-1 text-[14px] text-[color:var(--muted)]">{pick(lang, s.enBody, s.viBody)}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default GameDayNutritionTimeline;

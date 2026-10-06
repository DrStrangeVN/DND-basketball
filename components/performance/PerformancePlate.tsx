"use client";

import { useState } from "react";
import { Droplets } from "lucide-react";
import { useLanguage, pick } from "@/lib/i18n";

type DayType = "light" | "training" | "game";

const RATIOS: Record<DayType, { carb: number; protein: number; veg: number }> = {
  light: { carb: 35, protein: 30, veg: 35 },
  training: { carb: 40, protein: 25, veg: 35 },
  game: { carb: 50, protein: 20, veg: 30 },
};

const SEGMENTS = [
  { key: "carb", color: "#f59e0b", en: "Carbohydrates", vi: "Tinh bột" },
  { key: "protein", color: "#ef4444", en: "Protein", vi: "Đạm" },
  { key: "veg", color: "#22c55e", en: "Vegetables & fruit", vi: "Rau & trái cây" },
] as const;

function donutPaths(ratios: { carb: number; protein: number; veg: number }) {
  const vals = [ratios.carb, ratios.protein, ratios.veg];
  const R = 80;
  const C = 2 * Math.PI * R;
  let acc = 0;
  return vals.map((v) => {
    const frac = v / 100;
    const dash = `${(frac * C).toFixed(2)} ${C.toFixed(2)}`;
    const offset = (-acc * C).toFixed(2);
    acc += frac;
    return { dash, offset };
  });
}

export function PerformancePlate() {
  const { lang } = useLanguage();
  const [day, setDay] = useState<DayType>("training");
  const ratios = RATIOS[day];
  const paths = donutPaths(ratios);

  const L = {
    title: pick(lang, "Basketball performance plate", "Đĩa ăn của cầu thủ bóng rổ"),
    desc: pick(lang, "Adjust the plate to your day. Fluids on the side, always.", "Điều chỉnh đĩa ăn theo ngày tập. Luôn có nước bên cạnh."),
    light: pick(lang, "Light day", "Ngày nhẹ"),
    training: pick(lang, "Training day", "Ngày tập"),
    game: pick(lang, "Game day", "Ngày thi đấu"),
    fluids: pick(lang, "Fluids: water with every meal", "Nước: uống nước trong mọi bữa ăn"),
  };

  return (
    <section aria-label={L.title} className="neu p-6 sm:p-8">
      <h2 className="text-center text-xl font-extrabold sm:text-2xl">{L.title}</h2>
      <p className="mt-1 text-center text-sm text-[color:var(--muted)]">{L.desc}</p>

      <div className="mt-4 flex justify-center gap-2" role="group" aria-label={L.title}>
        {(["light", "training", "game"] as DayType[]).map((d) => (
          <button
            key={d}
            onClick={() => setDay(d)}
            aria-pressed={day === d}
            className={`rounded-xl px-4 py-2.5 text-[13px] font-bold transition-all ${
              day === d ? "neu-inset text-[color:var(--orange)]" : "neu-btn"
            }`}
          >
            {L[d]}
          </button>
        ))}
      </div>

      <div className="mx-auto mt-6 max-w-[280px]">
        <svg viewBox="0 0 200 200" className="w-full" role="img" aria-label={L.title}>
          <circle cx="100" cy="100" r="80" fill="none" stroke="var(--surface-2)" strokeWidth="34" />
          {SEGMENTS.map((s, i) => (
            <circle
              key={s.key}
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke={s.color}
              strokeWidth="34"
              strokeDasharray={paths[i].dash}
              strokeDashoffset={paths[i].offset}
              transform="rotate(-90 100 100)"
              className="transition-all duration-500"
            />
          ))}
          <circle cx="100" cy="100" r="58" fill="var(--surface)" />
          <text x="100" y="96" textAnchor="middle" fontSize="26" fontWeight="800" fill="var(--orange)">
            {ratios.carb}%
          </text>
          <text x="100" y="118" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--muted)">
            {pick(lang, SEGMENTS[0].en, SEGMENTS[0].vi)}
          </text>
        </svg>
      </div>

      <ul className="mx-auto mt-4 max-w-[320px] space-y-2">
        {SEGMENTS.map((s, i) => (
          <li key={s.key} className="flex items-center gap-3 text-[14px] font-semibold">
            <span className="h-4 w-4 shrink-0 rounded" style={{ backgroundColor: s.color }} aria-hidden />
            <span className="flex-1">{pick(lang, s.en, s.vi)}</span>
            <span className="font-extrabold">{[ratios.carb, ratios.protein, ratios.veg][i]}%</span>
          </li>
        ))}
        <li className="flex items-center gap-3 text-[14px] font-semibold text-[color:var(--muted)]">
          <Droplets className="h-4 w-4 shrink-0 text-sky-500" aria-hidden />
          <span>{L.fluids}</span>
        </li>
      </ul>
    </section>
  );
}

export default PerformancePlate;

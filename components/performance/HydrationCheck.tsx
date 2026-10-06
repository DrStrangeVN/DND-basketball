"use client";

import { useMemo, useState } from "react";
import { Droplets, Info } from "lucide-react";
import { useLanguage, pick, type Lang } from "@/lib/i18n";

const URINE_COLORS = ["#fef9c3", "#fef08a", "#fde047", "#facc15", "#eab308", "#ca8a04", "#a16207", "#713f12"];

function YesNo({
  label,
  value,
  onChange,
  lang,
}: {
  label: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
  lang: Lang;
}) {
  const yes = pick(lang, "Yes", "Có");
  const no = pick(lang, "No", "Không");
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[14px] font-bold">{label}</span>
      <div className="flex gap-2" role="group" aria-label={label}>
        {[
          { v: true, label: yes },
          { v: false, label: no },
        ].map((o) => (
          <button
            key={o.label}
            onClick={() => onChange(o.v)}
            aria-pressed={value === o.v}
            className={`min-w-[64px] rounded-xl px-4 py-2.5 text-[14px] font-bold transition-all ${
              value === o.v ? "neu-inset text-[color:var(--orange)]" : "neu-btn"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function HydrationCheck() {
  const { lang, t } = useLanguage();
  const [thirst, setThirst] = useState<boolean | null>(null);
  const [urine, setUrine] = useState<number | null>(null);
  const [hot, setHot] = useState<boolean | null>(null);
  const [intake, setIntake] = useState<boolean | null>(null);
  const [sweating, setSweating] = useState<boolean | null>(null);

  const score = useMemo(() => {
    let s = 0;
    if (thirst) s += 1;
    if (urine !== null) s += urine >= 6 ? 2 : urine >= 4 ? 1 : 0;
    if (hot) s += 1;
    if (intake === false) s += 1;
    if (sweating) s += 1;
    return s;
  }, [thirst, urine, hot, intake, sweating]);

  const answered = thirst !== null && urine !== null && hot !== null && intake !== null && sweating !== null;
  const level = !answered ? null : score <= 1 ? "hydrated" : score <= 3 ? "attention" : "risk";
  const levelStyle =
    level === "hydrated"
      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
      : level === "attention"
        ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
        : level === "risk"
          ? "bg-red-500/15 text-red-600 dark:text-red-400"
          : "";

  const L = {
    thirst: pick(lang, "Are you thirsty right now?", "Hiện tại bạn có khát không?"),
    urine: pick(lang, "Urine color (last time)", "Màu nước tiểu (lần gần nhất)"),
    hot: pick(lang, "Hot or humid environment?", "Trời nóng hoặc ẩm?"),
    intake: pick(lang, "Drank enough fluids in the last few hours?", "Vài giờ qua đã uống đủ nước?"),
    sweating: pick(lang, "Sweating heavily?", "Đang ra nhiều mồ hôi?"),
    pale: pick(lang, "Pale", "Nhạt"),
    dark: pick(lang, "Dark", "Đậm"),
  };

  return (
    <section aria-label={t("perf.hydrationCheck.title")} className="neu p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="neu-sm flex h-11 w-11 items-center justify-center text-[color:var(--orange)]">
          <Droplets className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h2 className="text-xl font-extrabold sm:text-2xl">{t("perf.hydrationCheck.title")}</h2>
          <p className="mt-0.5 text-sm text-[color:var(--muted)]">{t("perf.hydrationCheck.desc")}</p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <YesNo label={L.thirst} value={thirst} onChange={setThirst} lang={lang} />
        <div>
          <span className="mb-2 block text-[14px] font-bold">{L.urine}</span>
          <div className="flex items-center gap-1.5" role="group" aria-label={L.urine}>
            {URINE_COLORS.map((c, i) => (
              <button
                key={c}
                onClick={() => setUrine(i + 1)}
                aria-pressed={urine === i + 1}
                aria-label={`${i + 1}`}
                title={`${i + 1}`}
                className={`h-10 flex-1 rounded-lg transition-all ${
                  urine === i + 1 ? "ring-2 ring-[color:var(--orange)] ring-offset-2" : "opacity-80 hover:opacity-100"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <div className="mt-1 flex justify-between text-[12px] text-[color:var(--muted)]">
            <span>{L.pale}</span>
            <span>{L.dark}</span>
          </div>
        </div>
        <YesNo label={L.hot} value={hot} onChange={setHot} lang={lang} />
        <YesNo label={L.intake} value={intake} onChange={setIntake} lang={lang} />
        <YesNo label={L.sweating} value={sweating} onChange={setSweating} lang={lang} />
      </div>

      {level && (
        <div className="neu-inset mt-6 rounded-2xl p-5 text-center">
          <p className={`mx-auto inline-block rounded-full px-6 py-2 text-lg font-extrabold ${levelStyle}`}>
            {t(`perf.hydrationCheck.${level}`)}
          </p>
        </div>
      )}

      <p className="mt-4 flex items-start gap-2 text-[13px] text-[color:var(--muted)]">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        {t("perf.hydrationCheck.disclaimer")}
      </p>
    </section>
  );
}

export default HydrationCheck;

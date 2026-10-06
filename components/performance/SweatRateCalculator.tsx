"use client";

import { useMemo, useState } from "react";
import { Beaker, Info } from "lucide-react";
import { useLanguage, pick } from "@/lib/i18n";

function NumField({
  label,
  value,
  onChange,
  min = 0,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  min?: number;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[14px] font-bold">{label}</span>
      <input
        type="number"
        inputMode="decimal"
        min={min}
        step="any"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="neu-inset w-full rounded-2xl bg-transparent px-4 py-3.5 text-[16px] font-semibold outline-none"
      />
    </label>
  );
}

export function SweatRateCalculator() {
  const { lang, t } = useLanguage();
  const [before, setBefore] = useState("");
  const [after, setAfter] = useState("");
  const [fluid, setFluid] = useState("");
  const [duration, setDuration] = useState("");

  const result = useMemo(() => {
    const b = parseFloat(before);
    const a = parseFloat(after);
    const f = parseFloat(fluid);
    const d = parseFloat(duration);
    if ([b, a, f, d].some((n) => Number.isNaN(n)) || d <= 0) return null;
    const loss = b - a + f; // liters ≈ kg
    if (loss < 0) return null;
    return { total: loss, perHour: loss / (d / 60) };
  }, [before, after, fluid, duration]);

  const L: Record<string, string> = {
    formula: pick(lang, "Sweat loss ≈ (weight before − weight after) + fluid consumed", "Mồ hôi mất ≈ (cân nặng trước − cân nặng sau) + nước đã uống"),
    perHour: pick(lang, "per hour", "mỗi giờ"),
    total: pick(lang, "Total sweat loss", "Tổng mồ hôi mất"),
  };

  return (
    <section aria-label={t("perf.sweatRate.title")} className="neu p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="neu-sm flex h-11 w-11 items-center justify-center text-[color:var(--orange)]">
          <Beaker className="h-5 w-5" aria-hidden />
        </span>
        <h2 className="text-xl font-extrabold sm:text-2xl">{t("perf.sweatRate.title")}</h2>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <NumField label={t("perf.sweatRate.weightBefore")} value={before} onChange={setBefore} />
        <NumField label={t("perf.sweatRate.weightAfter")} value={after} onChange={setAfter} />
        <NumField label={t("perf.sweatRate.fluid")} value={fluid} onChange={setFluid} />
        <NumField label={t("perf.sweatRate.duration")} value={duration} onChange={setDuration} />
      </div>

      {result && (
        <div className="neu-inset mt-6 rounded-2xl p-5 text-center">
          <p className="text-[13px] font-bold uppercase tracking-wide text-[color:var(--muted)]">
            {t("perf.sweatRate.result")}
          </p>
          <p className="mt-2 text-4xl font-extrabold text-[color:var(--orange)]">
            {result.perHour.toFixed(2)}{" "}
            <span className="text-lg font-bold text-[color:var(--muted)]">L/h</span>
          </p>
          <p className="mt-1 text-sm text-[color:var(--muted)]">
            {L.total}: {result.total.toFixed(2)} L
          </p>
          <p className="mt-3 border-t border-[color:var(--surface-2)] pt-3 text-[13px] text-[color:var(--muted)]">
            {L.formula}
          </p>
        </div>
      )}

      <p className="mt-4 flex items-start gap-2 text-[13px] text-[color:var(--muted)]">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        {t("perf.sweatRate.note")}
      </p>
    </section>
  );
}

export default SweatRateCalculator;

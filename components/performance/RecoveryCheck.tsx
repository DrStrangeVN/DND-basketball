"use client";

import { useMemo, useState } from "react";
import { Activity, Info } from "lucide-react";
import { useLanguage, pick, type Lang } from "@/lib/i18n";

type Opt = { en: string; vi: string; score: number };

const SLEEP: Opt[] = [
  { en: "Under 5 hours", vi: "Dưới 5 tiếng", score: 0 },
  { en: "5–6 hours", vi: "5–6 tiếng", score: 1 },
  { en: "7–8 hours", vi: "7–8 tiếng", score: 2 },
  { en: "Over 8 hours", vi: "Trên 8 tiếng", score: 2 },
];
const SORENESS: Opt[] = [
  { en: "None", vi: "Không đau mỏi", score: 2 },
  { en: "Light", vi: "Nhẹ", score: 1.5 },
  { en: "Moderate", vi: "Vừa", score: 1 },
  { en: "High", vi: "Nhiều", score: 0 },
];
const ENERGY: Opt[] = [
  { en: "High", vi: "Cao", score: 2 },
  { en: "Medium", vi: "Trung bình", score: 1 },
  { en: "Low", vi: "Thấp", score: 0 },
];
const STRESS: Opt[] = [
  { en: "Low", vi: "Thấp", score: 2 },
  { en: "Medium", vi: "Trung bình", score: 1 },
  { en: "High", vi: "Cao", score: 0 },
];
const LOAD: Opt[] = [
  { en: "Light", vi: "Nhẹ", score: 2 },
  { en: "Moderate", vi: "Vừa", score: 1 },
  { en: "Heavy", vi: "Nặng", score: 0 },
];

function Field({
  label,
  options,
  value,
  onChange,
  lang,
}: {
  label: string;
  options: Opt[];
  value: number;
  onChange: (score: number) => void;
  lang: Lang;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[14px] font-bold">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="neu-inset w-full rounded-2xl bg-transparent px-4 py-3.5 text-[15px] font-semibold outline-none"
      >
        {options.map((o) => (
          <option key={o.en} value={o.score}>
            {pick(lang, o.en, o.vi)}
          </option>
        ))}
      </select>
    </label>
  );
}

export function RecoveryCheck() {
  const { lang, t } = useLanguage();
  const [sleep, setSleep] = useState(2);
  const [soreness, setSoreness] = useState(2);
  const [energy, setEnergy] = useState(2);
  const [stress, setStress] = useState(2);
  const [load, setLoad] = useState(2);

  const total = useMemo(() => sleep + soreness + energy + stress + load, [sleep, soreness, energy, stress, load]);
  const status = total >= 8 ? "good" : total >= 5 ? "moderate" : "low";
  const statusStyle =
    status === "good"
      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
      : status === "moderate"
        ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
        : "bg-red-500/15 text-red-600 dark:text-red-400";

  return (
    <section aria-label={t("perf.recoveryCheck.title")} className="neu p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="neu-sm flex h-11 w-11 items-center justify-center text-[color:var(--orange)]">
          <Activity className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h2 className="text-xl font-extrabold sm:text-2xl">{t("perf.recoveryCheck.title")}</h2>
          <p className="mt-0.5 text-sm text-[color:var(--muted)]">{t("perf.recoveryCheck.desc")}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label={t("perf.recoveryCheck.sleep")} options={SLEEP} value={sleep} onChange={setSleep} lang={lang} />
        <Field label={t("perf.recoveryCheck.soreness")} options={SORENESS} value={soreness} onChange={setSoreness} lang={lang} />
        <Field label={t("perf.recoveryCheck.energy")} options={ENERGY} value={energy} onChange={setEnergy} lang={lang} />
        <Field label={t("perf.recoveryCheck.stress")} options={STRESS} value={stress} onChange={setStress} lang={lang} />
        <Field label={t("perf.recoveryCheck.load")} options={LOAD} value={load} onChange={setLoad} lang={lang} />
      </div>

      <div className="neu-inset mt-6 rounded-2xl p-5 text-center">
        <p className="text-[13px] font-bold uppercase tracking-wide text-[color:var(--muted)]">
          {t("perf.recoveryCheck.title")}
        </p>
        <p className={`mx-auto mt-2 inline-block rounded-full px-6 py-2 text-xl font-extrabold ${statusStyle}`}>
          {t(`perf.recoveryCheck.${status}`)}
        </p>
        <p className="mt-3 text-[15px] font-semibold">{t(`perf.recoveryCheck.rec${status[0].toUpperCase()}${status.slice(1)}`)}</p>
      </div>

      <p className="mt-4 flex items-start gap-2 text-[13px] text-[color:var(--muted)]">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        {t("perf.medicalDisclaimer")}
      </p>
    </section>
  );
}

export default RecoveryCheck;

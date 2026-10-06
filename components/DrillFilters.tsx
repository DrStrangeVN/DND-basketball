"use client";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Drill } from "@/lib/types";
import { useLanguage, pick } from "@/lib/i18n";
import { DrillCard } from "@/components/cards";

const SKILLS: { en: string; vi: string }[] = [
  { en: "Ball Handling", vi: "Dẫn bóng" },
  { en: "Shooting", vi: "Ném rổ" },
  { en: "Finishing", vi: "Dứt điểm" },
  { en: "Passing", vi: "Chuyền bóng" },
  { en: "Footwork", vi: "Footwork" },
  { en: "Defense", vi: "Phòng thủ" },
  { en: "Rebounding", vi: "Bắt bóng bật bảng" },
  { en: "Offense", vi: "Tấn công" },
  { en: "Transition", vi: "Chuyển đổi" },
  { en: "Competition", vi: "Thi đấu" },
  { en: "Conditioning", vi: "Thể lực" },
];
const LEVELS = ["beginner", "intermediate", "advanced", "elite"];
const INTENSITIES = ["low", "medium", "high"];

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} aria-pressed={active}
      className={`neu-btn px-3.5 py-1.5 text-[13px] font-semibold ${active ? "text-[color:var(--orange)] ring-2 ring-[color:var(--orange)]" : "text-[color:var(--muted)]"}`}>
      {children}
    </button>
  );
}

export default function DrillFilters({ drills }: { drills: Drill[] }) {
  const [q, setQ] = useState("");
  const [skill, setSkill] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);
  const [intensity, setIntensity] = useState<string | null>(null);
  const [dur, setDur] = useState(999);
  const { lang, t } = useLanguage();

  const DURATIONS = [
    { label: `≤ 10 ${t("common.minutes")}`, max: 10 },
    { label: `≤ 15 ${t("common.minutes")}`, max: 15 },
    { label: t("drills.anyDuration"), max: 999 },
  ];

  const filtered = useMemo(() => drills.filter((d) => {
    if (skill && d.skill !== skill) return false;
    if (level && d.level !== level) return false;
    if (intensity && d.intensity !== intensity) return false;
    if (d.durationMin > dur) return false;
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      const hay = (d.title + " " + d.description + " " + d.skill + " " + (d.vi?.title ?? "") + " " + (d.vi?.description ?? "")).toLowerCase();
      if (!hay.includes(needle)) return false;
    }
    return true;
  }), [drills, q, skill, level, intensity, dur]);

  const skills = SKILLS.filter((s) => drills.some((d) => d.skill === s.en));

  return (
    <div>
      <div className="neu mb-6 space-y-4 p-5 sm:p-6">
        <div className="neu-input flex items-center gap-2 px-4 py-2.5">
          <Search className="h-4 w-4 shrink-0 text-[color:var(--faint)]" aria-hidden />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("drills.searchPlaceholder")}
            aria-label={t("drills.title")} className="w-full bg-transparent text-sm outline-none placeholder:text-[color:var(--faint)]" />
        </div>
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[color:var(--faint)]">{t("drills.filter.skill")}</p>
          <div className="flex flex-wrap gap-2">
            <Chip active={!skill} onClick={() => setSkill(null)}>{t("drills.filter.all")}</Chip>
            {skills.map((s) => <Chip key={s.en} active={skill === s.en} onClick={() => setSkill(skill === s.en ? null : s.en)}>{pick(lang, s.en, s.vi)}</Chip>)}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[color:var(--faint)]">{t("drills.filter.level")}</p>
            <div className="flex flex-wrap gap-2">
              <Chip active={!level} onClick={() => setLevel(null)}>{t("drills.filter.all")}</Chip>
              {LEVELS.map((l) => <Chip key={l} active={level === l} onClick={() => setLevel(level === l ? null : l)}>{t(`article.level.${l}`)}</Chip>)}
            </div>
          </div>
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[color:var(--faint)]">{t("drills.intensity")}</p>
            <div className="flex flex-wrap gap-2">
              <Chip active={!intensity} onClick={() => setIntensity(null)}>{t("drills.filter.all")}</Chip>
              {INTENSITIES.map((i) => <Chip key={i} active={intensity === i} onClick={() => setIntensity(intensity === i ? null : i)}>{t(`drills.intensity.${i}`)}</Chip>)}
            </div>
          </div>
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[color:var(--faint)]">{t("drills.duration")}</p>
            <div className="flex flex-wrap gap-2">
              {DURATIONS.map((d) => <Chip key={d.label} active={dur === d.max} onClick={() => setDur(d.max)}>{d.label}</Chip>)}
            </div>
          </div>
        </div>
      </div>

      <p className="mb-4 px-1 text-sm text-[color:var(--muted)]" role="status">
        {filtered.length} {t("drills.countLabel")}
      </p>
      {filtered.length === 0 ? (
        <div className="neu p-10 text-center text-sm text-[color:var(--muted)]">
          {t("drills.noMatch")}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => <DrillCard key={d.slug} drill={d} />)}
        </div>
      )}
    </div>
  );
}

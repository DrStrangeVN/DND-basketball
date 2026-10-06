"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n";

export type BodyPartId =
  | "foot" | "ankle" | "achilles" | "calf" | "knee" | "hamstring"
  | "groin" | "hip" | "lowerBack" | "shoulder" | "fingerWrist";

const PARTS: { id: BodyPartId; x: number; y: number }[] = [
  { id: "shoulder", x: 120, y: 64 },
  { id: "fingerWrist", x: 132, y: 122 },
  { id: "lowerBack", x: 100, y: 128 },
  { id: "hip", x: 84, y: 156 },
  { id: "groin", x: 100, y: 163 },
  { id: "hamstring", x: 112, y: 200 },
  { id: "knee", x: 87, y: 232 },
  { id: "calf", x: 113, y: 268 },
  { id: "achilles", x: 87, y: 290 },
  { id: "ankle", x: 113, y: 296 },
  { id: "foot", x: 87, y: 312 },
];

const KEY: Record<BodyPartId, string> = {
  foot: "perf.bodyMap.foot",
  ankle: "perf.bodyMap.ankle",
  achilles: "perf.bodyMap.achilles",
  calf: "perf.bodyMap.calf",
  knee: "perf.bodyMap.knee",
  hamstring: "perf.bodyMap.hamstring",
  groin: "perf.bodyMap.groin",
  hip: "perf.bodyMap.hip",
  lowerBack: "perf.bodyMap.lowerBack",
  shoulder: "perf.bodyMap.shoulder",
  fingerWrist: "perf.bodyMap.fingerWrist",
};

interface BodyMapProps {
  onSelect?: (partId: BodyPartId) => void;
  initial?: BodyPartId | null;
}

export function BodyMap({ onSelect, initial = null }: BodyMapProps) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<BodyPartId | null>(initial);

  const choose = (id: BodyPartId) => {
    setSelected(id);
    onSelect?.(id);
  };

  return (
    <section aria-label={t("perf.bodyMap.title")} className="neu p-6 sm:p-8">
      <h2 className="text-center text-xl font-extrabold sm:text-2xl">{t("perf.bodyMap.title")}</h2>
      <p className="mt-1 text-center text-sm text-[color:var(--muted)]">{t("perf.bodyMap.desc")}</p>

      <div className="mx-auto mt-4 max-w-[240px]">
        <svg viewBox="0 0 200 340" className="w-full" role="img" aria-label={t("perf.bodyMap.title")}>
          {/* figure */}
          <g stroke="currentColor" strokeWidth="10" strokeLinecap="round" fill="none" className="text-[color:var(--surface-2)]">
            <circle cx="100" cy="28" r="15" fill="currentColor" stroke="none" />
            <line x1="100" y1="52" x2="100" y2="150" />
            <line x1="100" y1="66" x2="72" y2="120" />
            <line x1="100" y1="66" x2="128" y2="120" />
            <line x1="100" y1="150" x2="88" y2="298" />
            <line x1="100" y1="150" x2="112" y2="298" />
            <line x1="88" y1="298" x2="76" y2="312" />
            <line x1="112" y1="298" x2="124" y2="312" />
          </g>
          {/* joints */}
          <g fill="currentColor" className="text-[color:var(--surface-2)]">
            <circle cx="100" cy="66" r="7" />
            <circle cx="88" cy="232" r="7" />
            <circle cx="112" cy="232" r="7" />
          </g>
          {/* tappable points */}
          {PARTS.map((p) => {
            const active = selected === p.id;
            return (
              <g key={p.id} onClick={() => choose(p.id)} className="cursor-pointer">
                <title>{t(KEY[p.id])}</title>
                <circle cx={p.x} cy={p.y} r="20" fill="transparent" />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={active ? 10 : 7}
                  fill={active ? "var(--orange)" : "var(--muted)"}
                  opacity={active ? 1 : 0.55}
                  className="transition-all"
                />
                {active && (
                  <circle cx={p.x} cy={p.y} r="15" fill="none" stroke="var(--orange)" strokeWidth="2" opacity="0.5" />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {selected && (
        <p className="mt-2 text-center text-lg font-extrabold text-[color:var(--orange)]" aria-live="polite">
          {t(KEY[selected])}
        </p>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {PARTS.map((p) => (
          <button
            key={p.id}
            onClick={() => choose(p.id)}
            aria-pressed={selected === p.id}
            className={`rounded-xl px-3 py-2.5 text-[13px] font-bold transition-all ${
              selected === p.id ? "neu-inset text-[color:var(--orange)]" : "neu-btn"
            }`}
          >
            {t(KEY[p.id])}
          </button>
        ))}
      </div>
    </section>
  );
}

export default BodyMap;

"use client";
import { useEffect, useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { getWorkoutChecks, toggleWorkoutCheck, resetWorkoutChecks } from "@/lib/storage";
import type { Workout } from "@/lib/types";

export default function WorkoutChecklist({ workout }: { workout: Workout }) {
  const [done, setDone] = useState<number[]>([]);
  useEffect(() => { setDone(getWorkoutChecks(workout.slug)); }, [workout.slug]);
  const pct = Math.round((done.length / workout.items.length) * 100);

  return (
    <div>
      <div className="neu mb-5 flex items-center gap-4 p-4">
        <div className="neu-inset h-3 flex-1 overflow-hidden rounded-full" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Workout progress">
          <div className="h-full rounded-full bg-[color:var(--orange)] transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-sm font-extrabold">{pct}%</span>
        <button onClick={() => setDone(resetWorkoutChecks(workout.slug) ?? getWorkoutChecks(workout.slug))}
          className="neu-btn inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-semibold text-[color:var(--muted)]" aria-label="Reset checklist">
          <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Reset
        </button>
      </div>
      <ol className="space-y-3">
        {workout.items.map((it, i) => {
          const checked = done.includes(i);
          return (
            <li key={i}>
              <button onClick={() => setDone(toggleWorkoutCheck(workout.slug, i))}
                aria-pressed={checked}
                className={`neu-sm flex w-full items-start gap-4 p-5 text-left ${checked ? "opacity-60" : ""}`}>
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${checked ? "bg-[color:var(--orange)] text-white" : "bg-[color:var(--surface-2)] text-[color:var(--faint)]"}`} aria-hidden>
                  {checked ? <Check className="h-4 w-4" /> : <span className="text-[12px] font-bold">{i + 1}</span>}
                </span>
                <span className="flex-1">
                  <span className={`block font-bold ${checked ? "line-through" : ""}`}>{it.name}</span>
                  <span className="mt-0.5 block text-[14px] text-[color:var(--muted)]">{it.detail}</span>
                </span>
                {(it.time || it.sets) && (
                  <span className="neu-btn shrink-0 px-3 py-1 text-[12px] font-bold text-[color:var(--orange)]">{it.time ?? it.sets}</span>
                )}
              </button>
            </li>
          );
        })}
      </ol>
      {pct === 100 && (
        <div className="neu mt-5 p-6 text-center">
          <p className="text-lg font-extrabold">Workout complete. 🏀</p>
          <p className="mt-1 text-sm text-[color:var(--muted)]">Consistency beats intensity. Come back tomorrow.</p>
        </div>
      )}
    </div>
  );
}

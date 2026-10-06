"use client";

import { useState } from "react";
import { Flag, Check } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const STAGES = ["m1", "m2", "m3", "m4", "m5"] as const;

export function FinishedGameTimeline() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState<Set<string>>(new Set());

  const toggle = (key: string) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <section aria-label={t("perf.finishedGame.title")}>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="neu flex w-full items-center justify-center gap-3 p-6 text-lg font-extrabold text-[color:var(--orange)] sm:p-8 sm:text-xl"
        >
          <Flag className="h-6 w-6" aria-hidden />
          {t("perf.finishedGame.title")}
        </button>
      ) : (
        <div className="neu p-6 sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold sm:text-2xl">{t("perf.finishedGame.title")}</h2>
              <p className="mt-1 text-sm text-[color:var(--muted)]">{t("perf.finishedGame.desc")}</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="neu-btn shrink-0 px-4 py-2 text-[13px] font-bold"
            >
              {t("common.close")}
            </button>
          </div>

          <ol className="relative mt-6 space-y-6 before:absolute before:bottom-4 before:left-[15px] before:top-4 before:w-0.5 before:rounded before:bg-[color:var(--surface-2)]">
            {STAGES.map((m) => {
              const body = t(`perf.finishedGame.${m}.body`);
              const items = body.split(".").map((s) => s.trim()).filter(Boolean);
              return (
                <li key={m} className="relative pl-12">
                  <span
                    className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--orange)] text-[13px] font-extrabold text-white"
                    aria-hidden
                  >
                    {m.slice(1)}
                  </span>
                  <p className="font-extrabold">{t(`perf.finishedGame.${m}.title`)}</p>
                  <ul className="mt-2 space-y-2">
                    {items.map((item, i) => {
                      const key = `${m}-${i}`;
                      const checked = done.has(key);
                      return (
                        <li key={key}>
                          <button
                            onClick={() => toggle(key)}
                            aria-pressed={checked}
                            className={`neu-sm flex w-full items-center gap-3 p-3 text-left text-[14px] ${
                              checked ? "opacity-60" : ""
                            }`}
                          >
                            <span
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors ${
                                checked
                                  ? "bg-[color:var(--orange)] text-white"
                                  : "bg-[color:var(--surface-2)] text-[color:var(--faint)]"
                              }`}
                              aria-hidden
                            >
                              {checked ? <Check className="h-4 w-4" /> : null}
                            </span>
                            <span className={checked ? "line-through" : ""}>{item}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </section>
  );
}

export default FinishedGameTimeline;

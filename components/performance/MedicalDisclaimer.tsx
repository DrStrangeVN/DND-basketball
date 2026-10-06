"use client";

import { TriangleAlert } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function MedicalDisclaimer({ className = "" }: { className?: string }) {
  const { t } = useLanguage();
  return (
    <aside
      aria-label={t("perf.medicalDisclaimer").slice(0, 40)}
      className={`flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 ${className}`}
    >
      <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
      <p className="text-[13px] leading-relaxed text-[color:var(--muted)]">{t("perf.medicalDisclaimer")}</p>
    </aside>
  );
}

export default MedicalDisclaimer;

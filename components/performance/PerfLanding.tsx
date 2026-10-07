"use client";
import Link from "next/link";
import { ArrowRight, Dumbbell, BatteryCharging, Salad, Droplets, ShieldPlus, Sparkles } from "lucide-react";
import { useLanguage, pick } from "@/lib/i18n";
import MetaSync from "../MetaSync";
import type { PerformanceArticle, PerfHubId } from "@/lib/types";
import { Breadcrumbs } from "../ui";

const HUB_ICONS: Record<PerfHubId, typeof Dumbbell> = {
  "athletic-performance": Dumbbell,
  recovery: BatteryCharging,
  nutrition: Salad,
  hydration: Droplets,
  "injury-prevention": ShieldPlus,
};

const HUB_KEYS: Record<PerfHubId, string> = {
  "athletic-performance": "athleticPerformance",
  recovery: "recovery",
  nutrition: "nutrition",
  hydration: "hydration",
  "injury-prevention": "injuryPrevention",
};

export interface LandingHub {
  id: PerfHubId;
  count: number;
  featured: PerformanceArticle | null;
}

export default function PerfLanding({ hubs }: { hubs: LandingHub[] }) {
  const { lang, t } = useLanguage();
  return (
    <div className="pb-6">
      <MetaSync
        title={`${t("perf.landing.title")} | DND Basketball`}
        description={t("perf.landing.subtitle")}
      />
      <Breadcrumbs items={[
        { label: t("mobile.home"), href: "/" },
        { label: t("perf.landing.title") },
      ]} />

      <header className="neu mb-8 p-6 text-center sm:p-10">
        <span className="neu-sm mx-auto mb-4 flex h-14 w-14 items-center justify-center">
          <Sparkles className="h-7 w-7 text-[color:var(--orange)]" aria-hidden />
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{t("perf.landing.title")}</h1>
        <p className="mx-auto mt-2 max-w-xl text-[15px] leading-relaxed text-[color:var(--muted)]">
          {t("perf.landing.subtitle")}
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {hubs.map((h) => {
          const Icon = HUB_ICONS[h.id];
          const key = HUB_KEYS[h.id];
          return (
            <article key={h.id} className="neu-card flex flex-col p-6">
              <span className="neu-sm mb-4 flex h-14 w-14 items-center justify-center">
                <Icon className="h-7 w-7 text-[color:var(--orange)]" aria-hidden />
              </span>
              <h2 className="text-xl font-extrabold tracking-tight">{t(`perf.hub.${key}`)}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-[color:var(--muted)]">{t(`perf.tagline.${key}`)}</p>
              <p className="mt-3 text-[13px] font-semibold text-[color:var(--muted)]">
                {h.count} {t("perf.guides")}
              </p>
              {h.featured && (
                <p className="mt-1 line-clamp-2 text-sm text-[color:var(--muted)]">
                  <span className="font-semibold text-[color:var(--ink)]">
                    {pick(lang, h.featured.title, h.featured.vi?.title)}
                  </span>
                </p>
              )}
              <Link
                href={`/performance/${h.id}`}
                className="neu-btn mt-4 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-[color:var(--orange)]"
              >
                {t("perf.explore")} <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}

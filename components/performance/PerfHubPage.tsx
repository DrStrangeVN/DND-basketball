"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, Clock, Dumbbell, BatteryCharging, Salad, Droplets, ShieldPlus,
  LayoutGrid, X, Coffee, UtensilsCrossed, Trophy, MoonStar, Apple, Scale, HeartPulse, Plane,
} from "lucide-react";
import { useLanguage, pick, type Lang } from "@/lib/i18n";
import type { PerformanceArticle, PerfHubId } from "@/lib/types";
import { performanceUrl } from "@/lib/urls";
import { Breadcrumbs, LevelBadge, SectionTitle } from "../ui";
import { GoalSelector } from "./GoalSelector";
import { FinishedGameTimeline } from "./FinishedGameTimeline";
import { RecoveryCheck } from "./RecoveryCheck";
import { HydrationCheck } from "./HydrationCheck";
import { SweatRateCalculator } from "./SweatRateCalculator";
import { BodyMap, type BodyPartId } from "./BodyMap";
import { GameDayNutritionTimeline } from "./GameDayNutritionTimeline";
import { PerformancePlate } from "./PerformancePlate";
import { MedicalDisclaimer } from "./MedicalDisclaimer";

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

/* Bilingual category labels; fallback prettifies kebab-case. */
const CATEGORY_LABELS: Record<string, { en: string; vi: string }> = {
  strength: { en: "Strength", vi: "Sức mạnh" },
  power: { en: "Power", vi: "Sức mạnh bùng nổ" },
  speed: { en: "Speed", vi: "Tốc độ" },
  agility: { en: "Agility", vi: "Nhanh nhẹn" },
  deceleration: { en: "Deceleration", vi: "Giảm tốc & tiếp đất" },
  "vertical-jump": { en: "Vertical Jump", vi: "Bật nhảy" },
  conditioning: { en: "Conditioning", vi: "Thể lực" },
  programs: { en: "Training Programs", vi: "Giáo án tập" },
  "post-practice": { en: "Post-Practice", vi: "Sau buổi tập" },
  "post-game": { en: "Post-Game", vi: "Sau trận đấu" },
  "game-day": { en: "Game Day", vi: "Ngày thi đấu" },
  tournament: { en: "Tournament", vi: "Giải đấu" },
  "food-library": { en: "Food Library", vi: "Thư viện món ăn" },
  "vietnamese-meals": { en: "Vietnamese Athlete Meals", vi: "Món Việt cho vận động viên" },
  basics: { en: "Basics", vi: "Kiến thức cơ bản" },
  "recovery-day": { en: "Recovery Day", vi: "Ngày hồi phục" },
  practice: { en: "Practice", vi: "Buổi tập" },
  "hot-weather": { en: "Hot Weather", vi: "Trời nóng" },
  electrolytes: { en: "Electrolytes", vi: "Điện giải" },
  travel: { en: "Travel", vi: "Di chuyển" },
  safety: { en: "Safety", vi: "An toàn" },
  "sweat-loss": { en: "Sweat Loss", vi: "Mất mồ hôi" },
  "knee-prevention": { en: "Knee Prevention", vi: "Bảo vệ đầu gối" },
  "training-load": { en: "Training Load", vi: "Khối lượng tập" },
};

function categoryLabel(cat: string, lang: Lang): string {
  const l = CATEGORY_LABELS[cat];
  if (l) return pick(lang, l.en, l.vi);
  return cat.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}

const GOALS = ["jump-higher", "get-faster", "get-stronger", "move-better", "conditioning", "explosive"] as const;
const GOAL_KEYS: Record<string, string> = {
  "jump-higher": "jumpHigher", "get-faster": "getFaster", "get-stronger": "getStronger",
  "move-better": "moveBetter", conditioning: "conditioning", explosive: "explosive",
};
const LEVELS = ["beginner", "intermediate", "advanced"] as const;
const POSITIONS = ["guard", "wing", "big", "all"] as const;
const PHASES = ["off-season", "pre-season", "in-season", "game-day", "recovery-day"] as const;

/* Nutrition scenario cards: "What Are You Preparing For?" */
interface Scenario { id: string; icon: typeof Coffee; en: string; vi: string; match: (a: PerformanceArticle) => boolean }
const SCENARIOS: Scenario[] = [
  { id: "before-practice", icon: Coffee, en: "Before Practice", vi: "Trước buổi tập",
    match: (a) => a.trainingPhase.includes("game-day") || a.category === "basics" || a.slug.includes("pre-") },
  { id: "after-practice", icon: UtensilsCrossed, en: "After Practice", vi: "Sau buổi tập",
    match: (a) => a.category === "recovery-day" || a.slug.includes("post-") || a.slug.includes("recovery") },
  { id: "game-day", icon: Trophy, en: "Game Day", vi: "Ngày thi đấu",
    match: (a) => a.category === "game-day" || a.trainingPhase.includes("game-day") },
  { id: "tournament-day", icon: LayoutGrid, en: "Tournament Day", vi: "Ngày đấu giải",
    match: (a) => a.category === "tournament" },
  { id: "recovery-day", icon: HeartPulse, en: "Recovery Day", vi: "Ngày hồi phục",
    match: (a) => a.trainingPhase.includes("recovery-day") || a.category === "recovery-day" },
  { id: "travel-day", icon: Plane, en: "Travel Day", vi: "Ngày di chuyển",
    match: (a) => a.category === "travel" || a.tags.includes("travel") },
  { id: "muscle-gain", icon: Dumbbell, en: "Muscle Gain", vi: "Tăng cơ",
    match: (a) => a.goal.includes("get-stronger") || a.tags.includes("muscle") },
  { id: "body-composition", icon: Scale, en: "Body Composition", vi: "Vóc dáng",
    match: (a) => a.tags.includes("body-composition") || a.category === "basics" },
];

/* Body map part -> slug keyword matching. */
const PART_KEYWORDS: Record<BodyPartId, string[]> = {
  foot: ["foot"], ankle: ["ankle"], achilles: ["achilles"], calf: ["calf"],
  knee: ["knee"], hamstring: ["hamstring"], groin: ["groin"], hip: ["hip"],
  lowerBack: ["back", "lumbar"], shoulder: ["shoulder"], fingerWrist: ["wrist", "finger"],
};

function localize(a: PerformanceArticle, lang: Lang) {
  const v = lang === "vi" ? a.vi : undefined;
  return {
    title: pick(lang, a.title, v?.title),
    description: pick(lang, a.description, v?.description),
    duration: pick(lang, a.duration, v?.duration),
  };
}

function PerfCard({ article }: { article: PerformanceArticle }) {
  const { lang } = useLanguage();
  const L = localize(article, lang);
  return (
    <Link id={`perf-${article.slug}`} href={performanceUrl(article.hub, article.slug)}
      className="neu-card flex scroll-mt-24 flex-col p-5">
      <div className="mb-2 flex items-center justify-between gap-2">
        <LevelBadge level={article.level} />
        <span className="inline-flex items-center gap-1 text-[12px] text-[color:var(--muted)]">
          <Clock className="h-3.5 w-3.5" aria-hidden /> {L.duration}
        </span>
      </div>
      <h3 className="text-[17px] font-bold leading-snug tracking-tight">{L.title}</h3>
      <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-[color:var(--muted)]">{L.description}</p>
      <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-bold text-[color:var(--orange)]">
        {categoryLabel(article.category, lang)} <ArrowRight className="h-4 w-4" aria-hidden />
      </span>
    </Link>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`neu-btn inline-flex items-center px-3 py-1.5 text-[12px] font-semibold ${
        active ? "bg-[color:var(--orange)] !text-white" : "text-[color:var(--muted)]"
      }`}
    >
      {children}
    </button>
  );
}

export default function PerfHubPage({ hubId, articles }: { hubId: PerfHubId; articles: PerformanceArticle[] }) {
  const { lang, t } = useLanguage();
  const key = HUB_KEYS[hubId];
  const Icon = HUB_ICONS[hubId];

  const [category, setCategory] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);
  const [position, setPosition] = useState<string | null>(null);
  const [phase, setPhase] = useState<string | null>(null);
  const [goal, setGoal] = useState<string | null>(null);
  const [scenario, setScenario] = useState<string | null>(null);

  /* Deep-link support: /performance/[hub]?cat=post-game preselects the category filter. */
  useEffect(() => {
    try {
      const cat = new URLSearchParams(window.location.search).get("cat");
      if (cat && articles.some((a) => a.category === cat)) setCategory(cat);
    } catch { /* ignore */ }
  }, [articles]);

  const categories = useMemo(() => {
    const map = new Map<string, PerformanceArticle[]>();
    for (const a of articles) {
      const arr = map.get(a.category) ?? [];
      arr.push(a);
      map.set(a.category, arr);
    }
    return [...map.entries()].sort((x, y) => y[1].length - x[1].length);
  }, [articles]);

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      if (category && a.category !== category) return false;
      if (level && a.level !== level) return false;
      if (position && position !== "all" && !a.positions.includes(position) && !a.positions.includes("all")) return false;
      if (phase && !a.trainingPhase.includes(phase)) return false;
      if (goal && !a.goal.includes(goal)) return false;
      if (scenario) {
        const s = SCENARIOS.find((x) => x.id === scenario);
        if (s && !s.match(a)) return false;
      }
      return true;
    });
  }, [articles, category, level, position, phase, goal, scenario]);

  const hasFilter = category || level || position || phase || goal || scenario;
  const clearAll = () => { setCategory(null); setLevel(null); setPosition(null); setPhase(null); setGoal(null); setScenario(null); };

  const scrollToList = () => document.getElementById("perf-list")?.scrollIntoView({ behavior: "smooth" });

  const pickCategory = (c: string) => { setCategory((v) => (v === c ? null : c)); scrollToList(); };
  const pickScenario = (id: string) => { setScenario((v) => (v === id ? null : id)); scrollToList(); };

  const onBodyPart = (part: BodyPartId) => {
    const keywords = PART_KEYWORDS[part];
    const hit = articles.find((a) => keywords.some((k) => a.slug.includes(k)));
    if (hit) document.getElementById(`perf-${hit.slug}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const programs = articles.filter((a) => a.category === "programs");

  return (
    <div className="pb-6">
      <Breadcrumbs items={[
        { label: t("mobile.home"), href: "/" },
        { label: t("perf.landing.title"), href: "/performance" },
        { label: t(`perf.hub.${key}`) },
      ]} />

      <header className="neu mb-8 flex items-start gap-4 p-6 sm:p-8">
        <span className="neu-sm flex h-14 w-14 shrink-0 items-center justify-center">
          <Icon className="h-7 w-7 text-[color:var(--orange)]" aria-hidden />
        </span>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--orange)]">
            {t(`perf.tagline.${key}`)}
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">{t(`perf.hub.${key}`)}</h1>
          <p className="mt-2 text-sm font-semibold text-[color:var(--muted)]">
            {articles.length} {t("perf.guides")}
          </p>
        </div>
      </header>

      {/* Hub-specific interactive sections */}
      {hubId === "athletic-performance" && (
        <div className="mb-10 space-y-6">
          <GoalSelector articles={articles} />
          {programs.length > 0 && (
            <section aria-labelledby="perf-programs-h">
              <div id="perf-programs-h">
                <SectionTitle title={categoryLabel("programs", lang)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {programs.map((a) => <PerfCard key={a.slug} article={a} />)}
              </div>
            </section>
          )}
        </div>
      )}

      {hubId === "recovery" && (
        <div className="mb-10 space-y-6">
          <FinishedGameTimeline />
          <RecoveryCheck />
          <MedicalDisclaimer />
        </div>
      )}

      {hubId === "nutrition" && (
        <div className="mb-10 space-y-6">
          <section aria-labelledby="perf-scenario-h">
            <div id="perf-scenario-h">
              <SectionTitle
                title={pick(lang, "What Are You Preparing For?", "Bạn đang chuẩn bị cho gì?")}
                description={pick(lang, "Pick a situation to surface the right guides.", "Chọn tình huống để xem các bài hướng dẫn phù hợp.")}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {SCENARIOS.map((s) => {
                const SIcon = s.icon;
                const active = scenario === s.id;
                return (
                  <button key={s.id} onClick={() => pickScenario(s.id)} aria-pressed={active}
                    className={`neu-card flex flex-col items-center gap-2 p-4 text-center ${active ? "ring-2 ring-[color:var(--orange)]" : ""}`}>
                    <SIcon className="h-6 w-6 text-[color:var(--orange)]" aria-hidden />
                    <span className="text-[13px] font-bold leading-tight">{pick(lang, s.en, s.vi)}</span>
                  </button>
                );
              })}
            </div>
          </section>
          <GameDayNutritionTimeline />
          <PerformancePlate />
        </div>
      )}

      {hubId === "hydration" && (
        <div className="mb-10 space-y-6">
          <HydrationCheck />
          <SweatRateCalculator />
        </div>
      )}

      {hubId === "injury-prevention" && (
        <div className="mb-10 space-y-6">
          <section className="neu p-6 sm:p-8" aria-labelledby="perf-bodymap-h">
            <h2 id="perf-bodymap-h" className="text-xl font-extrabold tracking-tight">{t("perf.bodyMap.title")}</h2>
            <p className="mt-1 text-sm text-[color:var(--muted)]">{t("perf.bodyMap.desc")}</p>
            <div className="mt-4">
              <BodyMap onSelect={onBodyPart} />
            </div>
          </section>
          <MedicalDisclaimer />
        </div>
      )}

      {/* Category cards */}
      {categories.length > 0 && (
        <section className="mb-10" aria-labelledby="perf-cats-h">
          <div id="perf-cats-h">
            <SectionTitle title={pick(lang, "Browse by Category", "Duyệt theo nhóm")} />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map(([cat, arr]) => (
              <button key={cat} onClick={() => pickCategory(cat)} aria-pressed={category === cat}
                className={`neu-card p-4 text-left ${category === cat ? "ring-2 ring-[color:var(--orange)]" : ""}`}>
                <p className="text-[15px] font-bold leading-tight">{categoryLabel(cat, lang)}</p>
                <p className="mt-1 text-[12px] font-semibold text-[color:var(--muted)]">
                  {arr.length} {t("perf.guides")}
                </p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Filters + article list */}
      <section id="perf-list" className="scroll-mt-24" aria-labelledby="perf-list-h">
        <div id="perf-list-h">
          <SectionTitle title={pick(lang, "All Guides", "Tất cả bài hướng dẫn")} />
        </div>

        <div className="mb-5 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[12px] font-bold uppercase tracking-wide text-[color:var(--muted)]">{t("perf.filter.level")}:</span>
            {LEVELS.map((l) => <Chip key={l} active={level === l} onClick={() => setLevel((v) => (v === l ? null : l))}>{t(`perf.level.${l}`)}</Chip>)}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[12px] font-bold uppercase tracking-wide text-[color:var(--muted)]">{t("perf.filter.position")}:</span>
            {POSITIONS.map((p) => <Chip key={p} active={position === p} onClick={() => setPosition((v) => (v === p ? null : p))}>{t(`perf.position.${p}`)}</Chip>)}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[12px] font-bold uppercase tracking-wide text-[color:var(--muted)]">{t("perf.filter.phase")}:</span>
            {PHASES.map((p) => <Chip key={p} active={phase === p} onClick={() => setPhase((v) => (v === p ? null : p))}>{t(`perf.phase.${p === "off-season" ? "offSeason" : p === "pre-season" ? "preSeason" : p === "in-season" ? "inSeason" : p === "game-day" ? "gameDay" : "recoveryDay"}`)}</Chip>)}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[12px] font-bold uppercase tracking-wide text-[color:var(--muted)]">{t("perf.filter.goal")}:</span>
            {GOALS.map((g) => <Chip key={g} active={goal === g} onClick={() => setGoal((v) => (v === g ? null : g))}>{t(`perf.goal.${GOAL_KEYS[g]}`)}</Chip>)}
          </div>
          {hasFilter && (
            <button onClick={clearAll} className="inline-flex items-center gap-1 text-[13px] font-bold text-[color:var(--orange)]">
              <X className="h-4 w-4" aria-hidden /> {t("common.all")}
            </button>
          )}
        </div>

        {filtered.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a) => <PerfCard key={a.slug} article={a} />)}
          </div>
        ) : (
          <p className="neu-inset p-6 text-center text-sm text-[color:var(--muted)]">
            {pick(lang, "No guides match these filters yet.", "Chưa có bài nào khớp bộ lọc này.")}
          </p>
        )}
      </section>
    </div>
  );
}

/** Re-export for the article page. */
export { categoryLabel };
export function PerfCardItem({ article }: { article: PerformanceArticle }) {
  return <PerfCard article={article} />;
}

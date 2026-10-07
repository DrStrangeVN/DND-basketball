"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, Menu, X, ChevronDown } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";
import { openSearch } from "./SearchModal";
import { useLanguage } from "@/lib/i18n";

type SubLink = { labelKey: string; href: string };
type TopLink = { labelKey: string; href: string; menu: SubLink[] };

/* Main hubs only — sub-items live in dropdowns. */
const TOP_LINKS: TopLink[] = [
  {
    labelKey: "nav.learn", href: "/learn", menu: [
      { labelKey: "nav.quiz", href: "/quiz" },
      { labelKey: "nav.fundamentals", href: "/fundamentals" },
      { labelKey: "nav.skills", href: "/skills" },
      { labelKey: "nav.basketballIq", href: "/basketball-iq" },
      { labelKey: "nav.positions", href: "/positions" },
      { labelKey: "nav.glossary", href: "/glossary" },
      { labelKey: "nav.flashcards", href: "/flashcards" },
    ],
  },
  {
    labelKey: "nav.tactics", href: "/tactics", menu: [
      { labelKey: "nav.offense", href: "/offense" },
      { labelKey: "nav.defense", href: "/defense" },
      { labelKey: "nav.pickAndRoll", href: "/pick-and-roll" },
      { labelKey: "nav.actions", href: "/tactics" },
      { labelKey: "nav.transition", href: "/transition" },
    ],
  },
  {
    labelKey: "nav.athletic", href: "/performance/athletic-performance", menu: [
      { labelKey: "nav.sub.strength", href: "/performance/athletic-performance?cat=strength" },
      { labelKey: "nav.sub.power", href: "/performance/athletic-performance?cat=power" },
      { labelKey: "nav.sub.speed", href: "/performance/athletic-performance?cat=speed" },
      { labelKey: "nav.sub.deceleration", href: "/performance/athletic-performance?cat=deceleration" },
      { labelKey: "nav.sub.verticalJump", href: "/performance/athletic-performance?cat=vertical-jump" },
      { labelKey: "nav.sub.programs", href: "/performance/athletic-performance?cat=programs" },
    ],
  },
  {
    labelKey: "nav.recovery", href: "/performance/recovery", menu: [
      { labelKey: "nav.sub.postPractice", href: "/performance/recovery?cat=post-practice" },
      { labelKey: "nav.sub.postGame", href: "/performance/recovery?cat=post-game" },
      { labelKey: "nav.sub.tournament", href: "/performance/recovery?cat=tournament" },
      { labelKey: "nav.sub.methods", href: "/performance/recovery?cat=methods" },
      { labelKey: "nav.sub.myths", href: "/performance/recovery?cat=myths" },
    ],
  },
  {
    labelKey: "nav.nutrition", href: "/performance/nutrition", menu: [
      { labelKey: "nav.sub.preTraining", href: "/performance/nutrition?cat=pre-training" },
      { labelKey: "nav.sub.postTraining", href: "/performance/nutrition?cat=post-training" },
      { labelKey: "nav.sub.gameDay", href: "/performance/nutrition?cat=game-day" },
      { labelKey: "nav.sub.vnMeals", href: "/performance/nutrition?cat=vietnamese-meals" },
      { labelKey: "nav.sub.foodLibrary", href: "/performance/nutrition?cat=food-library" },
      { labelKey: "nav.sub.supplements", href: "/performance/nutrition?cat=supplements" },
    ],
  },
  {
    labelKey: "nav.hydration", href: "/performance/hydration", menu: [
      { labelKey: "nav.sub.basics", href: "/performance/hydration?cat=basics" },
      { labelKey: "nav.sub.practice", href: "/performance/hydration?cat=practice" },
      { labelKey: "nav.sub.gameDay", href: "/performance/hydration?cat=game-day" },
      { labelKey: "nav.sub.hotWeather", href: "/performance/hydration?cat=hot-weather" },
      { labelKey: "nav.sub.electrolytes", href: "/performance/hydration?cat=electrolytes" },
    ],
  },
  {
    labelKey: "nav.injuryPrevention", href: "/performance/injury-prevention", menu: [
      { labelKey: "nav.sub.bodyMap", href: "/performance/injury-prevention?cat=body-map" },
      { labelKey: "nav.sub.warmUp", href: "/performance/injury-prevention?cat=warm-up" },
      { labelKey: "nav.sub.landing", href: "/performance/injury-prevention?cat=landing-deceleration" },
      { labelKey: "nav.sub.ankle", href: "/performance/injury-prevention?cat=ankle-prevention" },
      { labelKey: "nav.sub.knee", href: "/performance/injury-prevention?cat=knee-prevention" },
      { labelKey: "nav.sub.trainingLoad", href: "/performance/injury-prevention?cat=training-load" },
    ],
  },
  {
    labelKey: "nav.coaching", href: "/coaching", menu: [
      { labelKey: "nav.coachesCorner", href: "/coaching" },
      { labelKey: "nav.drillLibrary", href: "/drills" },
      { labelKey: "nav.workouts", href: "/workouts" },
      { labelKey: "nav.trainingLog", href: "/log" },
      { labelKey: "nav.learningPaths", href: "/learning-paths" },
      { labelKey: "nav.filmRoom", href: "/film-room" },
    ],
  },
];

function Logo() {
  const { t } = useLanguage();
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label={t("brand.home")}>
      <svg viewBox="0 0 64 64" className="h-9 w-9" aria-hidden>
        <circle cx="32" cy="32" r="29" fill="#f26b1d" />
        <path d="M32 3v58M3 32h58" stroke="#7a3a10" strokeWidth="2.5" fill="none" />
        <path d="M10 14c8 6 8 30 0 36M54 14c-8 6-8 30 0 36" stroke="#7a3a10" strokeWidth="2.5" fill="none" />
      </svg>
      <span className="leading-none">
        <span className="block text-[15px] font-extrabold tracking-tight">DND BASKETBALL</span>
        <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-[color:var(--orange)]">{t("brand.tagline")}</span>
      </span>
    </Link>
  );
}

function DropMenu({ link }: { link: TopLink }) {
  const { t } = useLanguage();
  return (
    <div className="group relative">
      <Link href={link.href} className="flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-2 text-[13px] font-semibold text-[color:var(--muted)] hover:text-[color:var(--ink)] xl:px-3 xl:text-sm">
        {t(link.labelKey)} <ChevronDown className="h-3.5 w-3.5" aria-hidden />
      </Link>
      <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <div className="neu w-[240px] p-2">
          {link.menu.map((m) => (
            <Link key={m.href} href={m.href}
              className="block rounded-xl px-3 py-2 text-sm font-medium text-[color:var(--muted)] hover:bg-[color:var(--orange-soft)] hover:text-[color:var(--ink)]">
              {t(m.labelKey)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-[60]">
      <div className="mx-auto max-w-7xl px-3 sm:px-5">
        <div className="neu-sm mt-3 flex items-center gap-2 px-3 py-2.5 sm:px-4">
          <Logo />
          <nav className="ml-4 hidden items-center gap-0.5 lg:flex" aria-label="Primary">
            {TOP_LINKS.map((l) => <DropMenu key={l.href} link={l} />)}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={openSearch} aria-label={t("nav.search.label")}
              className="neu-btn hidden h-10 items-center gap-2 px-4 text-sm font-medium text-[color:var(--muted)] sm:inline-flex">
              <Search className="h-4 w-4" aria-hidden />
              <span className="hidden max-w-[150px] truncate whitespace-nowrap xl:inline">{t("nav.search.placeholder")}</span>
              <kbd className="hidden rounded-md bg-[color:var(--surface-2)] px-1.5 py-0.5 text-[10px] font-bold xl:inline">⌘K</kbd>
            </button>
            <button onClick={openSearch} aria-label={t("nav.search.label")} className="neu-btn inline-flex h-10 w-10 items-center justify-center sm:hidden">
              <Search className="h-[18px] w-[18px]" aria-hidden />
            </button>
            <LanguageToggle />
            <ThemeToggle />
            <button onClick={() => setMobileOpen((v) => !v)} aria-label={mobileOpen ? t("nav.menu.close") : t("nav.menu.open")} aria-expanded={mobileOpen}
              className="neu-btn inline-flex h-10 w-10 items-center justify-center lg:hidden">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="neu mt-2 p-3 lg:hidden" aria-label="Mobile">
            <button onClick={() => { openSearch(); setMobileOpen(false); }}
              className="neu-inset mb-2 flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-sm text-[color:var(--faint)]">
              <Search className="h-4 w-4 text-[color:var(--orange)]" /> {t("nav.search.placeholder")}
            </button>
            {TOP_LINKS.map((col) => (
              <div key={col.href} className="border-b border-[color:var(--line)] last:border-0">
                <div className="flex w-full items-center justify-between py-1">
                  <Link href={col.href} onClick={() => setMobileOpen(false)}
                    className="flex-1 px-2 py-2.5 text-sm font-bold">
                    {t(col.labelKey)}
                  </Link>
                  <button onClick={() => setOpenGroup(openGroup === col.href ? null : col.href)}
                    aria-label={t(col.labelKey)} aria-expanded={openGroup === col.href}
                    className="rounded-full p-2">
                    <ChevronDown className={`h-4 w-4 transition-transform ${openGroup === col.href ? "rotate-180" : ""}`} aria-hidden />
                  </button>
                </div>
                {openGroup === col.href && (
                  <div className="pb-2">
                    {col.menu.map((l) => (
                      <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                        className="block rounded-xl px-4 py-2 text-sm text-[color:var(--muted)] hover:bg-[color:var(--orange-soft)]">
                        {t(l.labelKey)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}

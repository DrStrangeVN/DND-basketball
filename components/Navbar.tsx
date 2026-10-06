"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, Menu, X, ChevronDown } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";
import { openSearch } from "./SearchModal";
import { useLanguage } from "@/lib/i18n";

const LEARN_COLS: { titleKey: string; links: { labelKey: string; href: string }[] }[] = [
  {
    titleKey: "nav.learn", links: [
      { labelKey: "nav.fundamentals", href: "/fundamentals" },
      { labelKey: "nav.skills", href: "/skills" },
      { labelKey: "nav.basketballIq", href: "/basketball-iq" },
      { labelKey: "nav.positions", href: "/positions" },
      { labelKey: "nav.glossary", href: "/glossary" },
    ],
  },
  {
    titleKey: "nav.tactics", links: [
      { labelKey: "nav.offense", href: "/offense" },
      { labelKey: "nav.defense", href: "/defense" },
      { labelKey: "nav.pickAndRoll", href: "/pick-and-roll" },
      { labelKey: "nav.actions", href: "/tactics" },
      { labelKey: "nav.transition", href: "/transition" },
    ],
  },
  {
    titleKey: "nav.coaching", links: [
      { labelKey: "nav.coachesCorner", href: "/coaching" },
      { labelKey: "nav.drillLibrary", href: "/drills" },
      { labelKey: "nav.workouts", href: "/workouts" },
      { labelKey: "nav.learningPaths", href: "/learning-paths" },
      { labelKey: "nav.filmRoom", href: "/film-room" },
    ],
  },
];

const TOP_LINKS = [
  { labelKey: "nav.skills", href: "/skills" },
  { labelKey: "nav.drills", href: "/drills" },
  { labelKey: "nav.tactics", href: "/tactics" },
  { labelKey: "nav.basketballIq", href: "/basketball-iq" },
  { labelKey: "nav.coaching", href: "/coaching" },
  { labelKey: "nav.filmRoom", href: "/film-room" },
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

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-[60]">
      <div className="mx-auto max-w-7xl px-3 sm:px-5">
        <div className="neu-sm mt-3 flex items-center gap-2 px-3 py-2.5 sm:px-4">
          <Logo />
          <nav className="ml-4 hidden items-center gap-1 lg:flex" aria-label="Primary">
            <div className="group relative">
              <button className="flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-semibold text-[color:var(--muted)] hover:text-[color:var(--ink)]">
                {t("nav.learn")} <ChevronDown className="h-3.5 w-3.5" aria-hidden />
              </button>
              <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <div className="neu grid w-[560px] grid-cols-3 gap-2 p-4">
                  {LEARN_COLS.map((col) => (
                    <div key={col.titleKey}>
                      <p className="mb-1 px-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--orange)]">{t(col.titleKey)}</p>
                      {col.links.map((l) => (
                        <Link key={l.href} href={l.href} className="block rounded-xl px-2 py-1.5 text-sm font-medium text-[color:var(--muted)] hover:bg-[color:var(--orange-soft)] hover:text-[color:var(--ink)]">
                          {t(l.labelKey)}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {TOP_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="rounded-full px-3.5 py-2 text-sm font-semibold text-[color:var(--muted)] hover:text-[color:var(--ink)]">
                {t(l.labelKey)}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={openSearch} aria-label={t("nav.search.label")}
              className="neu-btn hidden h-10 items-center gap-2 px-4 text-sm font-medium text-[color:var(--muted)] sm:inline-flex">
              <Search className="h-4 w-4" aria-hidden />
              <span className="hidden xl:inline">{t("nav.search.placeholder")}</span>
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
            {LEARN_COLS.map((col) => (
              <div key={col.titleKey} className="border-b border-[color:var(--line)] last:border-0">
                <button onClick={() => setOpenGroup(openGroup === col.titleKey ? null : col.titleKey)}
                  className="flex w-full items-center justify-between px-2 py-3 text-sm font-bold">
                  {t(col.titleKey)}
                  <ChevronDown className={`h-4 w-4 transition-transform ${openGroup === col.titleKey ? "rotate-180" : ""}`} aria-hidden />
                </button>
                {openGroup === col.titleKey && (
                  <div className="pb-2">
                    {col.links.map((l) => (
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

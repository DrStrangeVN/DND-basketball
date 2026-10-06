"use client";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

const COLS: { titleKey: string; links: { labelKey: string; href: string }[] }[] = [
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
    titleKey: "footer.train", links: [
      { labelKey: "nav.drillLibrary", href: "/drills" },
      { labelKey: "nav.workouts", href: "/workouts" },
      { labelKey: "nav.learningPaths", href: "/learning-paths" },
      { labelKey: "nav.filmRoom", href: "/film-room" },
      { labelKey: "nav.library", href: "/library" },
    ],
  },
  {
    titleKey: "nav.tactics", links: [
      { labelKey: "nav.offense", href: "/offense" },
      { labelKey: "nav.defense", href: "/defense" },
      { labelKey: "nav.pickAndRoll", href: "/pick-and-roll" },
      { labelKey: "nav.actions", href: "/tactics" },
      { labelKey: "nav.coachesCorner", href: "/coaching" },
    ],
  },
];

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="mx-auto max-w-7xl px-3 pb-28 pt-10 sm:px-5 md:pb-10">
      <div className="neu p-6 sm:p-10">
        <div className="grid gap-8 md:grid-cols-[1.2fr_2fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <svg viewBox="0 0 64 64" className="h-10 w-10" aria-hidden>
                <circle cx="32" cy="32" r="29" fill="#f26b1d" />
                <path d="M32 3v58M3 32h58" stroke="#7a3a10" strokeWidth="2.5" fill="none" />
                <path d="M10 14c8 6 8 30 0 36M54 14c-8 6-8 30 0 36" stroke="#7a3a10" strokeWidth="2.5" fill="none" />
              </svg>
              <div className="leading-none">
                <p className="text-base font-extrabold tracking-tight">DND BASKETBALL</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[color:var(--orange)]">{t("footer.tagline")}</p>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[color:var(--muted)]">
              {t("footer.about")}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            {COLS.map((col) => (
              <div key={col.titleKey}>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--orange)]">{t(col.titleKey)}</p>
                <ul className="space-y-1.5">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm text-[color:var(--muted)] hover:text-[color:var(--ink)]">{t(l.labelKey)}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-col items-start justify-between gap-2 border-t border-[color:var(--line)] pt-5 text-xs text-[color:var(--faint)] sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} DND Basketball. {t("footer.rights")}</p>
          <p>{t("footer.diagrams")}</p>
        </div>
      </div>
    </footer>
  );
}

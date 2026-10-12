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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/dnd-logo.webp" alt="Danang Dragons" width="60" height="48" className="h-12 w-[60px] shrink-0 object-contain" />
              <div className="leading-none">
                <p className="text-base font-extrabold tracking-tight">DANANG DRAGONS</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[color:var(--orange)]">{t("footer.tagline")}</p>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[color:var(--muted)]">
              {t("footer.about")}
            </p>
            <address className="mt-4 space-y-2 text-sm not-italic leading-relaxed text-[color:var(--muted)]">
              <p>Công ty Cổ phần Bóng rổ Đà Nẵng</p>
              <p>696 Ngô Quyền, Phường An Hải, Thành phố Đà Nẵng, Việt Nam</p>
              <p><a href="tel:0946163139" className="hover:text-[color:var(--ink)]">0946.163.139</a></p>
              <p><a href="mailto:danangdragons.gm@gmail.com" className="break-all hover:text-[color:var(--ink)]">danangdragons.gm@gmail.com</a></p>
              <p><a href="mailto:Danangdragons.info@gmail.com" className="break-all hover:text-[color:var(--ink)]">Danangdragons.info@gmail.com</a></p>
              <p><a href="https://www.facebook.com/DanangDragons" target="_blank" rel="noreferrer" className="hover:text-[color:var(--ink)]">Facebook · Danang Dragons ↗</a></p>
            </address>
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
          <p>© {new Date().getFullYear()} Danang Dragons Learn. {t("footer.rights")}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2"><a href="https://danangdragons.com/" className="hover:text-[color:var(--ink)]">Danang Dragons ↗</a><a href="https://board.danangdragons.com/" className="hover:text-[color:var(--ink)]">{t("nav.tactics")} · Sa bàn ↗</a><p>{t("footer.diagrams")}</p></div>
        </div>
      </div>
    </footer>
  );
}

"use client";
import Link from "next/link";
import { Breadcrumbs, SectionTitle } from "@/components/ui";
import HubIcon from "@/components/HubIcon";
import { HUBS, hubText } from "@/lib/hubs";
import { useLanguage } from "@/lib/i18n";

const DISCOVER: { titleKey: string; links: { labelKey: string; href: string }[] }[] = [
  {
    titleKey: "learn.bySkill", links: [
      { labelKey: "home.explore.shooting.t", href: "/skills/shooting" },
      { labelKey: "home.explore.skills.t", href: "/skills/ball-handling" },
      { labelKey: "nav.pickAndRoll", href: "/pick-and-roll" },
      { labelKey: "home.explore.iq.t", href: "/basketball-iq" },
    ],
  },
  {
    titleKey: "learn.byLevel", links: [
      { labelKey: "article.level.beginner", href: "/search?level=beginner" },
      { labelKey: "article.level.intermediate", href: "/search?level=intermediate" },
      { labelKey: "article.level.advanced", href: "/search?level=advanced" },
      { labelKey: "article.level.elite", href: "/search?level=elite" },
    ],
  },
  {
    titleKey: "learn.byRole", links: [
      { labelKey: "learn.rolePlayer", href: "/skills" },
      { labelKey: "learn.rolePG", href: "/positions/point-guard" },
      { labelKey: "learn.roleCoach", href: "/coaching" },
      { labelKey: "learn.roleFan", href: "/fundamentals" },
    ],
  },
  {
    titleKey: "learn.bySituation", links: [
      { labelKey: "learn.sitHalfCourt", href: "/tactics" },
      { labelKey: "nav.transition", href: "/transition" },
      { labelKey: "nav.pickAndRoll", href: "/pick-and-roll" },
      { labelKey: "learn.sitLateGame", href: "/basketball-iq" },
    ],
  },
];

const MORE: { href: string; titleKey: string; tagKey: string; icon: string }[] = [
  { href: "/drills", titleKey: "nav.drillLibrary", tagKey: "learn.moreDrills", icon: "dribbble" },
  { href: "/workouts", titleKey: "nav.workouts", tagKey: "learn.moreWorkouts", icon: "zap" },
  { href: "/learning-paths", titleKey: "nav.learningPaths", tagKey: "learn.morePaths", icon: "route" },
  { href: "/film-room", titleKey: "nav.filmRoom", tagKey: "learn.moreFilm", icon: "clapperboard" },
  { href: "/glossary", titleKey: "glossary.title", tagKey: "learn.moreGlossary", icon: "book-open" },
];

export default function LearnClient() {
  const { lang, t } = useLanguage();
  return (
    <div className="pb-6">
      <Breadcrumbs items={[{ label: t("mobile.home"), href: "/" }, { label: t("nav.learn") }]} />
      <header className="neu mb-8 p-6 sm:p-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--orange)]">{t("learn.eyebrow")}</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">{t("learn.title")}</h1>
        <p className="mt-2 max-w-2xl text-[15px] text-[color:var(--muted)]">{t("learn.desc")}</p>
      </header>

      <section aria-label="Knowledge hubs">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HUBS.map((h) => (
            <Link key={h.id} href={h.route} className="neu-card flex items-start gap-4 p-5">
              <span className="neu-sm flex h-12 w-12 shrink-0 items-center justify-center">
                <HubIcon icon={h.icon} />
              </span>
              <span>
                <span className="block text-[16px] font-bold tracking-tight">{hubText(h, lang, "title")}</span>
                <span className="mt-0.5 block text-[13px] leading-relaxed text-[color:var(--muted)]">{hubText(h, lang, "tagline")}</span>
              </span>
            </Link>
          ))}
          {MORE.map((x) => (
            <Link key={x.href} href={x.href} className="neu-card flex items-start gap-4 p-5">
              <span className="neu-sm flex h-12 w-12 shrink-0 items-center justify-center">
                <HubIcon icon={x.icon} />
              </span>
              <span>
                <span className="block text-[16px] font-bold tracking-tight">{t(x.titleKey)}</span>
                <span className="mt-0.5 block text-[13px] leading-relaxed text-[color:var(--muted)]">{t(x.tagKey)}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12" aria-label="Discover content">
        <SectionTitle eyebrow={t("learn.discoverEyebrow")} title={t("learn.discoverTitle")} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DISCOVER.map((d) => (
            <div key={d.titleKey} className="neu p-5">
              <h2 className="mb-2 text-sm font-extrabold uppercase tracking-wider text-[color:var(--orange)]">{t(d.titleKey)}</h2>
              <ul className="space-y-1">
                {d.links.map((l) => (
                  <li key={l.href + l.labelKey}>
                    <Link href={l.href} className="block rounded-xl px-2 py-1.5 text-sm font-medium text-[color:var(--muted)] hover:bg-[color:var(--orange-soft)] hover:text-[color:var(--ink)]">
                      {t(l.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

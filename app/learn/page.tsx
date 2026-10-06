import Link from "next/link";
import type { Metadata } from "next";
import { HUBS } from "@/lib/hubs";
import { Breadcrumbs, SectionTitle } from "@/components/ui";
import HubIcon from "@/components/HubIcon";

export const metadata: Metadata = {
  title: "Learn Basketball — All Knowledge Hubs",
  description: "Browse every basketball knowledge hub: fundamentals, skills, tactics, basketball IQ, drills, coaching and more.",
  alternates: { canonical: "https://dndbasketball.vercel.app/learn" },
};

const DISCOVER: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "By Skill", links: [
      { label: "Shooting", href: "/skills/shooting" },
      { label: "Ball Handling", href: "/skills/ball-handling" },
      { label: "Passing", href: "/skills/passing" },
      { label: "Finishing", href: "/skills/finishing" },
    ],
  },
  {
    title: "By Level", links: [
      { label: "Beginner", href: "/search?level=beginner" },
      { label: "Intermediate", href: "/search?level=intermediate" },
      { label: "Advanced", href: "/search?level=advanced" },
      { label: "Elite", href: "/search?level=elite" },
    ],
  },
  {
    title: "By Role", links: [
      { label: "Player", href: "/skills" },
      { label: "Point Guard", href: "/positions/point-guard" },
      { label: "Coach", href: "/coaching" },
      { label: "Parent / New Fan", href: "/fundamentals" },
    ],
  },
  {
    title: "By Situation", links: [
      { label: "Half Court", href: "/tactics" },
      { label: "Transition", href: "/transition" },
      { label: "Pick & Roll", href: "/pick-and-roll" },
      { label: "Late Game", href: "/basketball-iq" },
    ],
  },
];

export default function LearnPage() {
  return (
    <div className="pb-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Learn" }]} />
      <header className="neu mb-8 p-6 sm:p-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--orange)]">Start Learning</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">Learn Basketball</h1>
        <p className="mt-2 max-w-2xl text-[15px] text-[color:var(--muted)]">
          Every hub in the DND Basketball knowledge system. Browse by topic, or discover content by skill, level, role or game situation.
        </p>
      </header>

      <section aria-label="Knowledge hubs">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HUBS.map((h) => (
            <Link key={h.id} href={h.route} className="neu-card flex items-start gap-4 p-5">
              <span className="neu-sm flex h-12 w-12 shrink-0 items-center justify-center">
                <HubIcon icon={h.icon} />
              </span>
              <span>
                <span className="block text-[16px] font-bold tracking-tight">{h.title}</span>
                <span className="mt-0.5 block text-[13px] leading-relaxed text-[color:var(--muted)]">{h.tagline}</span>
              </span>
            </Link>
          ))}
          {[
            { href: "/drills", title: "Drill Library", tagline: "Train with purpose" },
            { href: "/workouts", title: "Workouts", tagline: "Follow-along checklists" },
            { href: "/learning-paths", title: "Learning Paths", tagline: "Structured progression" },
            { href: "/film-room", title: "Film Room", tagline: "Watch breakdowns" },
            { href: "/glossary", title: "Basketball Dictionary", tagline: "A–Z terminology" },
          ].map((x) => (
            <Link key={x.href} href={x.href} className="neu-card flex items-start gap-4 p-5">
              <span className="neu-sm flex h-12 w-12 shrink-0 items-center justify-center">
                <HubIcon icon="book-open" />
              </span>
              <span>
                <span className="block text-[16px] font-bold tracking-tight">{x.title}</span>
                <span className="mt-0.5 block text-[13px] leading-relaxed text-[color:var(--muted)]">{x.tagline}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12" aria-label="Discover content">
        <SectionTitle eyebrow="Discovery" title="Find Your Way In" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DISCOVER.map((d) => (
            <div key={d.title} className="neu p-5">
              <h2 className="mb-2 text-sm font-extrabold uppercase tracking-wider text-[color:var(--orange)]">{d.title}</h2>
              <ul className="space-y-1">
                {d.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link href={l.href} className="block rounded-xl px-2 py-1.5 text-sm font-medium text-[color:var(--muted)] hover:bg-[color:var(--orange-soft)] hover:text-[color:var(--ink)]">
                      {l.label}
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

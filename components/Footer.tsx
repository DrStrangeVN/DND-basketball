import Link from "next/link";

const COLS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Learn", links: [
      { label: "Fundamentals", href: "/fundamentals" },
      { label: "Skills", href: "/skills" },
      { label: "Basketball IQ", href: "/basketball-iq" },
      { label: "Positions", href: "/positions" },
      { label: "Glossary", href: "/glossary" },
    ],
  },
  {
    title: "Train", links: [
      { label: "Drill Library", href: "/drills" },
      { label: "Workouts", href: "/workouts" },
      { label: "Learning Paths", href: "/learning-paths" },
      { label: "Film Room", href: "/film-room" },
      { label: "My Library", href: "/library" },
    ],
  },
  {
    title: "Tactics", links: [
      { label: "Offense", href: "/offense" },
      { label: "Defense", href: "/defense" },
      { label: "Pick & Roll", href: "/pick-and-roll" },
      { label: "Actions", href: "/tactics" },
      { label: "Coaches Corner", href: "/coaching" },
    ],
  },
];

export default function Footer() {
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
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[color:var(--orange)]">Learn. Train. Understand the Game.</p>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[color:var(--muted)]">
              Built to help players understand the game, train smarter and play better.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            {COLS.map((col) => (
              <div key={col.title}>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--orange)]">{col.title}</p>
                <ul className="space-y-1.5">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm text-[color:var(--muted)] hover:text-[color:var(--ink)]">{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-col items-start justify-between gap-2 border-t border-[color:var(--line)] pt-5 text-xs text-[color:var(--faint)] sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} DND Basketball. The Complete Basketball Knowledge Hub.</p>
          <p>All diagrams and illustrations are original, drawn for learning.</p>
        </div>
      </div>
    </footer>
  );
}

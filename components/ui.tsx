import Link from "next/link";
import { ChevronRight, Clock } from "lucide-react";
import { LEVEL_META } from "@/lib/hubs";

export function LevelBadge({ level, className = "" }: { level: string; className?: string }) {
  const meta = LEVEL_META[level] ?? LEVEL_META.beginner;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold text-[color:var(--muted)] ${className}`}>
      <span className={`h-2 w-2 rounded-full ${meta.dot}`} aria-hidden />
      {meta.label}
      <span className="sr-only">level</span>
    </span>
  );
}

export function TagChip({ tag }: { tag: string }) {
  return (
    <Link href={`/search?tag=${encodeURIComponent(tag)}`}
      className="neu-btn inline-flex items-center px-3 py-1 text-[11px] font-medium text-[color:var(--muted)] hover:text-[color:var(--orange)]">
      #{tag}
    </Link>
  );
}

export function SectionTitle({ eyebrow, title, description, href }: {
  eyebrow?: string; title: string; description?: string; href?: string;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--orange)]">{eyebrow}</p>}
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h2>
        {description && <p className="mt-1 max-w-2xl text-sm text-[color:var(--muted)]">{description}</p>}
      </div>
      {href && (
        <Link href={href} className="neu-btn hidden shrink-0 items-center gap-1 px-4 py-2 text-sm font-semibold sm:inline-flex">
          View all <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1 text-[13px] text-[color:var(--muted)]">
      {items.map((it, i) => (
        <span key={i} className="inline-flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-[color:var(--faint)]" aria-hidden />}
          {it.href ? <Link href={it.href} className="hover:text-[color:var(--orange)]">{it.label}</Link>
            : <span className="font-medium text-[color:var(--ink)]">{it.label}</span>}
        </span>
      ))}
    </nav>
  );
}

export function ReadTime({ minutes }: { minutes: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-[12px] text-[color:var(--muted)]">
      <Clock className="h-3.5 w-3.5" aria-hidden /> {minutes} min
    </span>
  );
}

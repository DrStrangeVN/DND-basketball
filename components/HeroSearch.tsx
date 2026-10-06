"use client";
import { Search } from "lucide-react";
import { openSearch } from "./SearchModal";

const EXAMPLES = ["pick & roll", "zone defense", "crossover", "spacing"];

export default function HeroSearch() {
  return (
    <div className="mt-6">
      <button onClick={openSearch}
        className="neu-input flex w-full items-center gap-3 px-5 py-4 text-left"
        aria-label="Search basketball knowledge">
        <Search className="h-5 w-5 shrink-0 text-[color:var(--orange)]" aria-hidden />
        <span className="flex-1 truncate text-[15px] text-[color:var(--faint)]">
          Search shooting, pick &amp; roll, zone defense, crossover…
        </span>
        <kbd className="hidden rounded-lg bg-[color:var(--surface-2)] px-2 py-1 text-[11px] font-bold text-[color:var(--muted)] sm:block">⌘K</kbd>
      </button>
      <div className="mt-3 flex flex-wrap items-center gap-2 px-1">
        <span className="text-[12px] font-semibold text-[color:var(--faint)]">Try:</span>
        {EXAMPLES.map((e) => (
          <button key={e} onClick={openSearch}
            className="rounded-full bg-[color:var(--orange-soft)] px-3 py-1 text-[12px] font-semibold text-[color:var(--orange)] hover:underline">
            {e}
          </button>
        ))}
      </div>
    </div>
  );
}

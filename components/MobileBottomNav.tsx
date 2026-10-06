"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, GraduationCap, Search, Dumbbell, Bookmark } from "lucide-react";
import { openSearch } from "./SearchModal";

const ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Learn", href: "/learn", icon: GraduationCap },
  { label: "Search", href: "", icon: Search, action: true },
  { label: "Drills", href: "/drills", icon: Dumbbell },
  { label: "Saved", href: "/library", icon: Bookmark },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Quick navigation"
      className="fixed inset-x-3 bottom-3 z-[60] md:hidden">
      <div className="neu-sm flex items-center justify-around px-2 py-2">
        {ITEMS.map((it) => {
          const active = it.href === pathname;
          const cls = `flex flex-col items-center gap-0.5 rounded-2xl px-4 py-1.5 text-[10px] font-semibold ${active ? "text-[color:var(--orange)]" : "text-[color:var(--muted)]"}`;
          return it.action ? (
            <button key={it.label} onClick={openSearch} className={cls} aria-label="Search">
              <it.icon className="h-5 w-5" aria-hidden /> {it.label}
            </button>
          ) : (
            <Link key={it.label} href={it.href} className={cls} aria-current={active ? "page" : undefined}>
              <it.icon className="h-5 w-5" aria-hidden /> {it.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

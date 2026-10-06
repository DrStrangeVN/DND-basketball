"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, GraduationCap, Search, Dumbbell, Bookmark } from "lucide-react";
import { openSearch } from "./SearchModal";
import { useLanguage } from "@/lib/i18n";

const ITEMS = [
  { labelKey: "mobile.home", href: "/", icon: Home },
  { labelKey: "mobile.learn", href: "/learn", icon: GraduationCap },
  { labelKey: "mobile.search", href: "", icon: Search, action: true },
  { labelKey: "mobile.drills", href: "/drills", icon: Dumbbell },
  { labelKey: "mobile.saved", href: "/library", icon: Bookmark },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  return (
    <nav aria-label="Quick navigation"
      className="fixed inset-x-3 bottom-3 z-[60] md:hidden">
      <div className="neu-sm flex items-center justify-around px-2 py-2">
        {ITEMS.map((it) => {
          const active = it.href === pathname;
          const cls = `flex flex-col items-center gap-0.5 rounded-2xl px-4 py-1.5 text-[10px] font-semibold ${active ? "text-[color:var(--orange)]" : "text-[color:var(--muted)]"}`;
          return it.action ? (
            <button key={it.labelKey} onClick={openSearch} className={cls} aria-label={t("mobile.search")}>
              <it.icon className="h-5 w-5" aria-hidden /> {t(it.labelKey)}
            </button>
          ) : (
            <Link key={it.labelKey} href={it.href} className={cls} aria-current={active ? "page" : undefined}>
              <it.icon className="h-5 w-5" aria-hidden /> {t(it.labelKey)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

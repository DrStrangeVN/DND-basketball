"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, History, Trash2, ArrowRight } from "lucide-react";
import { getFavs, getRecent, toggleFav, type SavedItem } from "@/lib/storage";
import { Breadcrumbs } from "@/components/ui";
import { useLanguage } from "@/lib/i18n";

const TYPE_LABEL: Record<string, { vi: string; en: string }> = {
  article: { vi: "Bài viết", en: "Article" },
  drill: { vi: "Bài tập", en: "Drill" },
  workout: { vi: "Giáo án", en: "Workout" },
  path: { vi: "Lộ trình", en: "Path" },
};

function ItemRow({ item, onRemove }: { item: SavedItem; onRemove?: () => void }) {
  const { lang } = useLanguage();
  return (
    <div className="neu-sm flex items-center gap-3 p-4">
      <Link href={item.url} className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-bold">{item.title}</span>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[color:var(--faint)]">
          {(TYPE_LABEL[item.type] ?? { vi: item.type, en: item.type })[lang]}
        </span>
      </Link>
      {onRemove && (
        <button onClick={onRemove} aria-label={`${item.title}`} className="neu-btn flex h-8 w-8 shrink-0 items-center justify-center text-[color:var(--muted)]">
          <Trash2 className="h-4 w-4" aria-hidden />
        </button>
      )}
      <Link href={item.url} aria-label={item.title} className="neu-btn flex h-8 w-8 shrink-0 items-center justify-center text-[color:var(--orange)]">
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </div>
  );
}

export default function LibraryView() {
  const [favs, setFavs] = useState<SavedItem[]>([]);
  const [recent, setRecent] = useState<SavedItem[]>([]);
  const [tab, setTab] = useState<"saved" | "recent">("saved");
  const { t } = useLanguage();

  useEffect(() => { setFavs(getFavs()); setRecent(getRecent()); }, []);

  return (
    <div className="mx-auto max-w-3xl pb-6">
      <Breadcrumbs items={[{ label: t("mobile.home"), href: "/" }, { label: t("library.title") }]} />
      <header className="neu mb-6 p-6 sm:p-8">
        <h1 className="text-3xl font-extrabold tracking-tight">{t("library.title")}</h1>
        <p className="mt-2 text-[15px] text-[color:var(--muted)]">
          {t("library.subtitle")}
        </p>
        <div className="mt-4 flex gap-2">
          {(
            [
              { id: "saved", labelKey: "library.favorites", icon: Bookmark, count: favs.length },
              { id: "recent", labelKey: "library.recent", icon: History, count: recent.length },
            ] as const
          ).map((tb) => (
            <button key={tb.id} onClick={() => setTab(tb.id)} aria-pressed={tab === tb.id}
              className={`neu-btn inline-flex items-center gap-2 px-4 py-2 text-sm font-bold ${tab === tb.id ? "text-[color:var(--orange)] ring-2 ring-[color:var(--orange)]" : "text-[color:var(--muted)]"}`}>
              <tb.icon className="h-4 w-4" aria-hidden /> {t(tb.labelKey)} ({tb.count})
            </button>
          ))}
        </div>
      </header>

      {tab === "saved" ? (
        favs.length === 0 ? (
          <Empty text={t("library.empty.favorites")} />
        ) : (
          <div className="space-y-3">
            {favs.map((f) => (
              <ItemRow key={f.type + f.id} item={f} onRemove={() => { toggleFav(f); setFavs(getFavs()); }} />
            ))}
          </div>
        )
      ) : recent.length === 0 ? (
        <Empty text={t("library.empty.recent")} />
      ) : (
        <div className="space-y-3">
          {recent.map((r) => <ItemRow key={r.type + r.id} item={r} />)}
        </div>
      )}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  const { t } = useLanguage();
  return (
    <div className="neu p-10 text-center">
      <p className="text-sm text-[color:var(--muted)]">{text}</p>
      <Link href="/learn" className="neu-btn mt-4 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-[color:var(--orange)]">
        {t("home.hero.startLearning")} <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </div>
  );
}

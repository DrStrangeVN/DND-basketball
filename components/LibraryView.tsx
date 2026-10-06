"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, History, Trash2, ArrowRight } from "lucide-react";
import { getFavs, getRecent, toggleFav, type SavedItem } from "@/lib/storage";
import { Breadcrumbs } from "@/components/ui";

function ItemRow({ item, onRemove }: { item: SavedItem; onRemove?: () => void }) {
  return (
    <div className="neu-sm flex items-center gap-3 p-4">
      <Link href={item.url} className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-bold">{item.title}</span>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[color:var(--faint)]">{item.type}</span>
      </Link>
      {onRemove && (
        <button onClick={onRemove} aria-label={`Remove ${item.title}`} className="neu-btn flex h-8 w-8 shrink-0 items-center justify-center text-[color:var(--muted)]">
          <Trash2 className="h-4 w-4" aria-hidden />
        </button>
      )}
      <Link href={item.url} aria-label={`Open ${item.title}`} className="neu-btn flex h-8 w-8 shrink-0 items-center justify-center text-[color:var(--orange)]">
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </div>
  );
}

export default function LibraryView() {
  const [favs, setFavs] = useState<SavedItem[]>([]);
  const [recent, setRecent] = useState<SavedItem[]>([]);
  const [tab, setTab] = useState<"saved" | "recent">("saved");

  useEffect(() => { setFavs(getFavs()); setRecent(getRecent()); }, []);

  return (
    <div className="mx-auto max-w-3xl pb-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "My Basketball Library" }]} />
      <header className="neu mb-6 p-6 sm:p-8">
        <h1 className="text-3xl font-extrabold tracking-tight">My Basketball Library</h1>
        <p className="mt-2 text-[15px] text-[color:var(--muted)]">
          Everything you save lives on this device — no account, no sync, no fuss.
        </p>
        <div className="mt-4 flex gap-2">
          {(
            [
              { id: "saved", label: "Saved", icon: Bookmark, count: favs.length },
              { id: "recent", label: "Recently Viewed", icon: History, count: recent.length },
            ] as const
          ).map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} aria-pressed={tab === t.id}
              className={`neu-btn inline-flex items-center gap-2 px-4 py-2 text-sm font-bold ${tab === t.id ? "text-[color:var(--orange)] ring-2 ring-[color:var(--orange)]" : "text-[color:var(--muted)]"}`}>
              <t.icon className="h-4 w-4" aria-hidden /> {t.label} ({t.count})
            </button>
          ))}
        </div>
      </header>

      {tab === "saved" ? (
        favs.length === 0 ? (
          <Empty text="Nothing saved yet. Tap “Save” on any concept, drill, workout or path to build your library." />
        ) : (
          <div className="space-y-3">
            {favs.map((f) => (
              <ItemRow key={f.type + f.id} item={f} onRemove={() => { toggleFav(f); setFavs(getFavs()); }} />
            ))}
          </div>
        )
      ) : recent.length === 0 ? (
        <Empty text="Nothing viewed yet. Start exploring — your recent reads will appear here." />
      ) : (
        <div className="space-y-3">
          {recent.map((r) => <ItemRow key={r.type + r.id} item={r} />)}
        </div>
      )}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="neu p-10 text-center">
      <p className="text-sm text-[color:var(--muted)]">{text}</p>
      <Link href="/learn" className="neu-btn mt-4 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-[color:var(--orange)]">
        Start Learning <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </div>
  );
}


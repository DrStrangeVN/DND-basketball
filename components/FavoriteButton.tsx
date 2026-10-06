"use client";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { isFav, toggleFav, type SavedItem } from "@/lib/storage";

export default function FavoriteButton({ item, className = "" }: { item: SavedItem; className?: string }) {
  const [saved, setSaved] = useState(false);
  useEffect(() => { setSaved(isFav(item.type, item.id)); }, [item.type, item.id]);
  return (
    <button
      onClick={() => setSaved(toggleFav(item))}
      aria-pressed={saved}
      aria-label={saved ? "Remove from my library" : "Save to my library"}
      className={`neu-btn inline-flex h-10 items-center gap-2 px-4 text-sm font-semibold ${saved ? "text-[color:var(--orange)]" : "text-[color:var(--muted)]"} ${className}`}>
      <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} aria-hidden />
      {saved ? "Saved" : "Save"}
    </button>
  );
}

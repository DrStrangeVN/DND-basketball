"use client";
import { useEffect } from "react";
import { pushRecent, type SavedItem } from "@/lib/storage";

export default function RecentTracker({ item }: { item: SavedItem }) {
  useEffect(() => { pushRecent(item); }, [item.type, item.id]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

"use client";

export interface SavedItem { type: string; id: string; title: string; url: string; ts: number }

const FAV_KEY = "dnd:favs";
const RECENT_KEY = "dnd:recent";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}
function write(key: string, val: unknown) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

export function getFavs(): SavedItem[] { return read<SavedItem[]>(FAV_KEY, []); }
export function isFav(type: string, id: string): boolean {
  return getFavs().some((f) => f.type === type && f.id === id);
}
export function toggleFav(item: SavedItem): boolean {
  const favs = getFavs();
  const i = favs.findIndex((f) => f.type === item.type && f.id === item.id);
  if (i >= 0) { favs.splice(i, 1); write(FAV_KEY, favs); return false; }
  favs.unshift({ ...item, ts: Date.now() });
  write(FAV_KEY, favs.slice(0, 200));
  return true;
}

export function pushRecent(item: SavedItem) {
  const rec = read<SavedItem[]>(RECENT_KEY, []).filter((r) => !(r.type === item.type && r.id === item.id));
  rec.unshift({ ...item, ts: Date.now() });
  write(RECENT_KEY, rec.slice(0, 12));
}
export function getRecent(): SavedItem[] { return read<SavedItem[]>(RECENT_KEY, []); }

const PATH_CHECK_KEY = "dnd:path:";
export function getPathChecks(slug: string): string[] {
  return read<string[]>(PATH_CHECK_KEY + slug, []);
}
export function togglePathCheck(slug: string, stepIdx: number, articleSlug: string) {
  const key = `${stepIdx}:${articleSlug}`;
  const cur = getPathChecks(slug);
  const next = cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key];
  write(PATH_CHECK_KEY + slug, next);
  return next;
}

const WORKOUT_KEY = "dnd:workout:";
export function getWorkoutChecks(slug: string): number[] {
  return read<number[]>(WORKOUT_KEY + slug, []);
}
export function toggleWorkoutCheck(slug: string, idx: number) {
  const cur = getWorkoutChecks(slug);
  const next = cur.includes(idx) ? cur.filter((i) => i !== idx) : [...cur, idx];
  write(WORKOUT_KEY + slug, next);
  return next;
}
export function resetWorkoutChecks(slug: string) { write(WORKOUT_KEY + slug, []); }

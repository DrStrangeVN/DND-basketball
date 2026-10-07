"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Flame, CalendarDays, Trash2, ChevronLeft, ChevronRight, Clock, ClipboardList,
  BarChart3, NotebookPen, CheckCircle2, X, Search, Medal, ListChecks,
} from "lucide-react";
import { useLanguage, pick, type Lang } from "@/lib/i18n";

/* ------------------------------------------------------------------ */
/* Types + storage                                                     */
/* ------------------------------------------------------------------ */

interface Session {
  id: string;
  date: string; // "YYYY-MM-DD"
  minutes: number;
  drills: string[]; // drill slugs
  note: string;
}

export interface DrillOption {
  slug: string;
  title: string;
  viTitle: string;
}

const STORAGE_KEY = "dnd-training-log";

/* ------------------------------------------------------------------ */
/* Date helpers (local timezone, string-based to avoid TZ drift)        */
/* ------------------------------------------------------------------ */

function pad(n: number): string {
  return String(n).padStart(2, "0");
}
function dayStr(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function addDays(dateStr: string, n: number): string {
  const [y, m, dd] = dateStr.split("-").map(Number);
  const d = new Date(y, m - 1, dd);
  d.setDate(d.getDate() + n);
  return dayStr(d);
}
function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}
function fmtDate(dateStr: string, lang: Lang): string {
  const [y, m, dd] = dateStr.split("-").map(Number);
  return new Intl.DateTimeFormat(lang === "vi" ? "vi-VN" : "en-US", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  }).format(new Date(y, m - 1, dd));
}

/** Current streak = consecutive days with a session, counting back from today
 *  (or yesterday if nothing logged today yet). Longest = best run ever. */
function calcStreaks(dateSet: Set<string>): { current: number; longest: number } {
  const today = dayStr(new Date());
  let current = 0;
  const start = dateSet.has(today) ? today : addDays(today, -1);
  if (dateSet.has(start)) {
    let d = start;
    while (dateSet.has(d)) {
      current += 1;
      d = addDays(d, -1);
    }
  }
  const sorted = [...dateSet].sort();
  let longest = 0;
  let run = 0;
  let prev: string | null = null;
  for (const d of sorted) {
    run = prev !== null && addDays(prev, 1) === d ? run + 1 : 1;
    if (run > longest) longest = run;
    prev = d;
  }
  return { current, longest };
}

/* ------------------------------------------------------------------ */
/* Session card                                                        */
/* ------------------------------------------------------------------ */

function SessionCard({
  session, drillMap, onDelete,
}: {
  session: Session;
  drillMap: Map<string, DrillOption>;
  onDelete: (id: string) => void;
}) {
  const { lang, t } = useLanguage();
  return (
    <article className="neu-sm p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-extrabold">{fmtDate(session.date, lang)}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-[color:var(--muted)]">
            <Clock className="h-4 w-4 text-[color:var(--orange)]" aria-hidden />
            {session.minutes} {t("common.minutes")}
          </p>
        </div>
        <button
          onClick={() => onDelete(session.id)}
          aria-label={t("log.delete")}
          title={t("log.delete")}
          className="neu-btn inline-flex h-9 w-9 shrink-0 items-center justify-center !rounded-full text-[color:var(--muted)] hover:text-red-500"
        >
          <Trash2 className="h-4 w-4" aria-hidden />
        </button>
      </div>
      {session.drills.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {session.drills.map((slug) => {
            const d = drillMap.get(slug);
            const label = d ? pick(lang, d.title, d.viTitle) : slug;
            return (
              <Link
                key={slug}
                href={`/drills/${slug}`}
                className="neu-inset rounded-full px-3 py-1 text-[13px] font-semibold text-[color:var(--orange)] hover:underline"
              >
                {label}
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="mt-3 text-sm italic text-[color:var(--faint)]">{t("log.noDrillSelected")}</p>
      )}
      {session.note.trim() !== "" && (
        <p className="mt-3 rounded-xl bg-[color:var(--surface-2)] p-3 text-sm leading-relaxed text-[color:var(--muted)]">
          {session.note}
        </p>
      )}
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Main view                                                           */
/* ------------------------------------------------------------------ */

export default function TrainingLog({ drills }: { drills: DrillOption[] }) {
  const { lang, t } = useLanguage();

  const [mounted, setMounted] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);

  // Form state
  const [date, setDate] = useState(() => dayStr(new Date()));
  const [minutes, setMinutes] = useState("45");
  const [selectedDrills, setSelectedDrills] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [drillSearch, setDrillSearch] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Calendar state
  const now = new Date();
  const [view, setView] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  /* Load from localStorage once (client-only). */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed)) {
          setSessions(
            parsed.filter(
              (s): s is Session =>
                typeof s === "object" && s !== null &&
                typeof (s as Session).id === "string" &&
                typeof (s as Session).date === "string" &&
                typeof (s as Session).minutes === "number"
            ).map((s) => ({
              id: s.id,
              date: s.date,
              minutes: s.minutes,
              drills: Array.isArray(s.drills) ? s.drills.filter((x) => typeof x === "string") : [],
              note: typeof s.note === "string" ? s.note : "",
            }))
          );
        }
      }
    } catch {}
    setMounted(true);
  }, []);

  function persist(next: Session[]) {
    setSessions(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }

  function showToast(msg: string) {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }

  const drillMap = useMemo(() => new Map(drills.map((d) => [d.slug, d])), [drills]);
  const sortedDrills = useMemo(
    () =>
      [...drills].sort((a, b) =>
        pick(lang, a.title, a.viTitle).localeCompare(pick(lang, b.title, b.viTitle), lang === "vi" ? "vi" : "en")
      ),
    [drills, lang]
  );
  const filteredDrills = useMemo(() => {
    const q = drillSearch.trim().toLowerCase();
    if (!q) return sortedDrills;
    return sortedDrills.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.viTitle.toLowerCase().includes(q) ||
        d.slug.toLowerCase().includes(q)
    );
  }, [sortedDrills, drillSearch]);

  const sessionsByDate = useMemo(() => {
    const map = new Map<string, Session[]>();
    for (const s of sessions) {
      const arr = map.get(s.date) ?? [];
      arr.push(s);
      map.set(s.date, arr);
    }
    return map;
  }, [sessions]);

  const { current: streak, longest: longestStreak } = useMemo(
    () => calcStreaks(new Set(sessions.map((s) => s.date))),
    [sessions]
  );

  const stats = useMemo(() => {
    const totalSessions = sessions.length;
    const totalMinutes = sessions.reduce((a, s) => a + s.minutes, 0);
    const avg = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;
    const counts = new Map<string, number>();
    for (const s of sessions) for (const slug of s.drills) counts.set(slug, (counts.get(slug) ?? 0) + 1);
    const topDrills = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
    return { totalSessions, totalMinutes, avg, topDrills };
  }, [sessions]);

  const recent = useMemo(
    () => [...sessions].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)).slice(0, 10),
    [sessions]
  );

  /* Calendar grid (Monday-first) */
  const cells = useMemo(() => {
    const first = new Date(view.y, view.m, 1);
    const leading = (first.getDay() + 6) % 7; // Monday = 0
    const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
    const out: (string | null)[] = [];
    for (let i = 0; i < leading; i++) out.push(null);
    for (let d = 1; d <= daysInMonth; d++) out.push(`${view.y}-${pad(view.m + 1)}-${pad(d)}`);
    return out;
  }, [view]);
  const weekdayHeaders = useMemo(() => {
    // 2026-10-05 is a Monday — build a fixed Monday-first week.
    const base = new Date(2026, 9, 5);
    return Array.from({ length: 7 }, (_, i) =>
      new Intl.DateTimeFormat(lang === "vi" ? "vi-VN" : "en-US", { weekday: "short" }).format(
        new Date(base.getFullYear(), base.getMonth(), base.getDate() + i)
      )
    );
  }, [lang]);
  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(lang === "vi" ? "vi-VN" : "en-US", { month: "long", year: "numeric" }).format(
        new Date(view.y, view.m, 1)
      ),
    [view, lang]
  );

  function toggleDrill(slug: string) {
    setSelectedDrills((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const mins = Math.round(Number(minutes));
    if (!date || !Number.isFinite(mins) || mins < 1) {
      setFormError(t("log.invalidMinutes"));
      return;
    }
    setFormError(null);
    const next: Session = {
      id: newId(),
      date,
      minutes: mins,
      drills: [...selectedDrills],
      note: note.trim(),
    };
    persist([next, ...sessions]);
    setSelectedDrills([]);
    setNote("");
    setMinutes("45");
    setDate(dayStr(new Date()));
    showToast(t("log.saved"));
  }

  function handleDelete(id: string) {
    if (!window.confirm(t("log.deleteConfirm"))) return;
    persist(sessions.filter((s) => s.id !== id));
  }

  if (!mounted) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <p className="text-[color:var(--muted)]">{t("common.loading")}</p>
      </div>
    );
  }

  const selectedDaySessions = selectedDay ? sessionsByDate.get(selectedDay) ?? [] : [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      {/* Header */}
      <div className="text-center">
        <p className="text-[12px] font-bold uppercase tracking-[0.25em] text-[color:var(--orange)]">
          <NotebookPen className="mr-1.5 inline h-4 w-4" aria-hidden />
          {t("log.title")}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{t("log.title")}</h1>
        <p className="mx-auto mt-2 max-w-xl text-[15px] text-[color:var(--muted)]">{t("log.subtitle")}</p>
      </div>

      {/* Streak hero */}
      <section aria-label={t("log.currentStreak")} className="neu mt-8 p-6 sm:p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-around">
          <div className="flex items-center gap-5">
            <span className="neu-inset flex h-20 w-20 items-center justify-center rounded-full">
              <Flame className="h-10 w-10 text-[color:var(--orange)]" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[color:var(--muted)]">
                {t("log.currentStreak")}
              </p>
              {streak > 0 ? (
                <p className="text-4xl font-extrabold leading-tight sm:text-5xl">
                  {streak}{" "}
                  <span className="text-lg font-bold text-[color:var(--muted)]">{t("log.daysUnit")}</span>
                </p>
              ) : (
                <p className="mt-1 max-w-xs text-[15px] font-medium text-[color:var(--muted)]">{t("log.noStreak")}</p>
              )}
            </div>
          </div>
          <div className="neu-inset flex items-center gap-3 rounded-2xl px-5 py-4">
            <Medal className="h-8 w-8 text-[color:var(--orange)]" aria-hidden />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)]">
                {t("log.longestStreak")}
              </p>
              <p className="text-2xl font-extrabold">
                {longestStreak}{" "}
                <span className="text-sm font-bold text-[color:var(--muted)]">{t("log.daysUnit")}</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <section aria-label={t("log.formTitle")} className="neu p-6 sm:p-7">
          <h2 className="flex items-center gap-2 text-xl font-extrabold">
            <ClipboardList className="h-5 w-5 text-[color:var(--orange)]" aria-hidden />
            {t("log.formTitle")}
          </h2>
          <form onSubmit={handleSave} className="mt-5 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="log-date" className="mb-1.5 block text-sm font-bold">{t("log.date")}</label>
                <input
                  id="log-date" type="date" value={date} max={dayStr(new Date())}
                  onChange={(e) => setDate(e.target.value)}
                  className="neu-inset w-full rounded-2xl px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[color:var(--orange)]"
                />
              </div>
              <div>
                <label htmlFor="log-minutes" className="mb-1.5 block text-sm font-bold">{t("log.minutes")}</label>
                <input
                  id="log-minutes" type="number" min={1} step={1} value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  className="neu-inset w-full rounded-2xl px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[color:var(--orange)]"
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="log-drill-search" className="text-sm font-bold">{t("log.drills")}</label>
                <span className="text-[13px] font-semibold text-[color:var(--orange)]">
                  {t("log.drillsSelected").replace("{n}", String(selectedDrills.length))}
                </span>
              </div>
              <div className="neu-inset mb-2 flex items-center gap-2 rounded-2xl px-4 py-2.5">
                <Search className="h-4 w-4 shrink-0 text-[color:var(--faint)]" aria-hidden />
                <input
                  id="log-drill-search" type="text" value={drillSearch}
                  onChange={(e) => setDrillSearch(e.target.value)}
                  placeholder={t("log.drillsSearch")}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-[color:var(--faint)]"
                />
                {drillSearch && (
                  <button type="button" onClick={() => setDrillSearch("")} aria-label={t("common.close")}
                    className="text-[color:var(--faint)] hover:text-[color:var(--ink)]">
                    <X className="h-4 w-4" aria-hidden />
                  </button>
                )}
              </div>
              <div role="group" aria-label={t("log.drills")}
                className="neu-inset max-h-56 space-y-1 overflow-y-auto rounded-2xl p-2">
                {filteredDrills.length === 0 && (
                  <p className="p-3 text-sm text-[color:var(--faint)]">{t("search.noResults")} “{drillSearch}”</p>
                )}
                {filteredDrills.map((d) => {
                  const checked = selectedDrills.includes(d.slug);
                  return (
                    <label key={d.slug}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors ${
                        checked ? "bg-[color:var(--orange-soft)] font-bold text-[color:var(--orange)]" : "hover:bg-[color:var(--surface-2)]"
                      }`}>
                      <input
                        type="checkbox" checked={checked} onChange={() => toggleDrill(d.slug)}
                        className="h-4 w-4 shrink-0 accent-[color:var(--orange)]"
                      />
                      <span>{pick(lang, d.title, d.viTitle)}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="log-note" className="mb-1.5 block text-sm font-bold">{t("log.note")}</label>
              <textarea
                id="log-note" rows={3} value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t("log.notePlaceholder")}
                className="neu-inset w-full resize-y rounded-2xl px-4 py-3 text-[15px] outline-none placeholder:text-[color:var(--faint)] focus:ring-2 focus:ring-[color:var(--orange)]"
              />
            </div>

            {formError && (
              <p role="alert" className="rounded-xl bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-500">
                {formError}
              </p>
            )}

            <button type="submit" className="neu-btn-primary w-full rounded-2xl px-6 py-3.5 text-[15px] font-bold">
              {t("log.save")}
            </button>
          </form>
        </section>

        <div className="space-y-6">
          {/* Calendar */}
          <section aria-label={t("log.calendar")} className="neu p-6 sm:p-7">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-extrabold">
                <CalendarDays className="h-5 w-5 text-[color:var(--orange)]" aria-hidden />
                {t("log.calendar")}
              </h2>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setView((v) => (v.m === 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 }))}
                  aria-label={lang === "vi" ? "Tháng trước" : "Previous month"}
                  className="neu-btn inline-flex h-9 w-9 items-center justify-center !rounded-full">
                  <ChevronLeft className="h-4 w-4" aria-hidden />
                </button>
                <span className="min-w-[120px] text-center text-sm font-extrabold capitalize">{monthLabel}</span>
                <button
                  onClick={() => setView((v) => (v.m === 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m: v.m + 1 }))}
                  aria-label={lang === "vi" ? "Tháng sau" : "Next month"}
                  className="neu-btn inline-flex h-9 w-9 items-center justify-center !rounded-full">
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-1 text-center" role="grid" aria-label={monthLabel}>
              {weekdayHeaders.map((w, i) => (
                <span key={i} className="py-1 text-[11px] font-bold uppercase text-[color:var(--faint)]">{w}</span>
              ))}
              {cells.map((ds, i) => {
                if (!ds) return <span key={`blank-${i}`} />;
                const has = sessionsByDate.has(ds);
                const dayNum = Number(ds.split("-")[2]);
                const selected = selectedDay === ds;
                return (
                  <button
                    key={ds}
                    onClick={() => setSelectedDay(selected ? null : ds)}
                    aria-pressed={selected}
                    aria-label={`${fmtDate(ds, lang)}${has ? ` — ${sessionsByDate.get(ds)!.length} ${t("log.sessionOnDay")}` : ""}`}
                    className={`flex aspect-square flex-col items-center justify-center rounded-xl text-sm font-semibold transition-all ${
                      selected
                        ? "neu-inset text-[color:var(--orange)]"
                        : has
                          ? "bg-[color:var(--orange-soft)] font-extrabold text-[color:var(--orange)] hover:brightness-95"
                          : "text-[color:var(--muted)] hover:bg-[color:var(--surface-2)]"
                    }`}
                  >
                    <span>{dayNum}</span>
                    {has && !selected && (
                      <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-[color:var(--orange)]" aria-hidden />
                    )}
                  </button>
                );
              })}
            </div>

            {selectedDay && (
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-extrabold">
                    {t("log.sessionDetail")} — {fmtDate(selectedDay, lang)}
                  </h3>
                  <button onClick={() => setSelectedDay(null)} aria-label={t("common.close")}
                    className="neu-btn inline-flex h-8 w-8 items-center justify-center !rounded-full">
                    <X className="h-4 w-4" aria-hidden />
                  </button>
                </div>
                {selectedDaySessions.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDaySessions.map((s) => (
                      <SessionCard key={s.id} session={s} drillMap={drillMap} onDelete={handleDelete} />
                    ))}
                  </div>
                ) : (
                  <p className="rounded-xl bg-[color:var(--surface-2)] p-4 text-sm text-[color:var(--muted)]">
                    {t("log.noSessionDay")}
                  </p>
                )}
              </div>
            )}
          </section>

          {/* Stats */}
          <section aria-label={t("log.stats.title")} className="neu p-6 sm:p-7">
            <h2 className="flex items-center gap-2 text-xl font-extrabold">
              <BarChart3 className="h-5 w-5 text-[color:var(--orange)]" aria-hidden />
              {t("log.stats.title")}
            </h2>
            {stats.totalSessions === 0 ? (
              <p className="mt-4 rounded-xl bg-[color:var(--surface-2)] p-4 text-sm text-[color:var(--muted)]">
                {t("log.stats.noneYet")}
              </p>
            ) : (
              <div className="mt-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="neu-inset rounded-2xl p-4 text-center">
                    <p className="text-2xl font-extrabold text-[color:var(--orange)]">{stats.totalSessions}</p>
                    <p className="mt-1 text-[12px] font-semibold text-[color:var(--muted)]">{t("log.stats.sessions")}</p>
                  </div>
                  <div className="neu-inset rounded-2xl p-4 text-center">
                    <p className="text-2xl font-extrabold text-[color:var(--orange)]">{stats.totalMinutes}</p>
                    <p className="mt-1 text-[12px] font-semibold text-[color:var(--muted)]">{t("log.stats.totalMinutes")}</p>
                  </div>
                  <div className="neu-inset rounded-2xl p-4 text-center">
                    <p className="text-2xl font-extrabold text-[color:var(--orange)]">{stats.avg}</p>
                    <p className="mt-1 text-[12px] font-semibold text-[color:var(--muted)]">{t("log.stats.avgMinutes")}</p>
                  </div>
                </div>
                {stats.topDrills.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-extrabold">{t("log.stats.topDrills")}</h3>
                    <ol className="mt-2 space-y-2">
                      {stats.topDrills.map(([slug, count], idx) => {
                        const d = drillMap.get(slug);
                        return (
                          <li key={slug} className="flex items-center gap-3">
                            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold ${
                              idx === 0 ? "bg-[color:var(--orange)] text-white" : "neu-inset text-[color:var(--muted)]"
                            }`}>
                              {idx + 1}
                            </span>
                            <Link href={`/drills/${slug}`} className="flex-1 text-sm font-semibold hover:text-[color:var(--orange)]">
                              {d ? pick(lang, d.title, d.viTitle) : slug}
                            </Link>
                            <span className="text-[13px] font-bold text-[color:var(--muted)]">
                              {count} {t("log.sessionOnDay")}
                            </span>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Recent sessions */}
      <section aria-label={t("log.recent.title")} className="mt-8">
        <h2 className="flex items-center gap-2 text-xl font-extrabold">
          <ListChecks className="h-5 w-5 text-[color:var(--orange)]" aria-hidden />
          {t("log.recent.title")}
        </h2>
        {recent.length === 0 ? (
          <div className="neu mt-4 p-6 text-center text-[15px] text-[color:var(--muted)]">
            {t("log.empty")}
          </div>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {recent.map((s) => (
              <SessionCard key={s.id} session={s} drillMap={drillMap} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </section>

      {/* Toast */}
      {toast && (
        <div role="status" className="fixed bottom-6 left-1/2 z-[70] -translate-x-1/2">
          <div className="neu flex items-center gap-2 px-5 py-3 text-sm font-bold">
            <CheckCircle2 className="h-5 w-5 text-[color:var(--orange)]" aria-hidden />
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}

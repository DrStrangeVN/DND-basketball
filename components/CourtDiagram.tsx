"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export interface DiagramMarker { label: string; x: number; y: number }
export interface DiagramMove { from: string; to: string; kind: "move" | "dribble" | "cut" | "screen-run" }
export interface DiagramPass { from: string; to: string }
export interface DiagramSpec {
  title?: string;
  offense?: DiagramMarker[];
  defense?: DiagramMarker[];
  ball?: string;
  screens?: { x: number; y: number; angle?: number }[];
  moves?: DiagramMove[];
  passes?: DiagramPass[];
  shots?: { x: number; y: number }[];
}

const INK = "#2b2f36";
const ORANGE = "#f26b1d";
const LINE = "rgba(43,47,54,0.28)";

const MOVE_MS = 1400;
const PASS_MS = 700;
const GAP_MS = 250;
const END_MS = 1200;

function arcPath(cx: number, cy: number, r: number, fromDeg: number, toDeg: number) {
  const pts: string[] = [];
  for (let d = fromDeg; d <= toDeg; d += 2) {
    const rad = (d * Math.PI) / 180;
    pts.push(`${(cx + r * Math.sin(rad)).toFixed(2)},${(cy + r * Math.cos(rad)).toFixed(2)}`);
  }
  return `M${pts.join(" L")}`;
}

/* ---------------- shared static pieces (visuals unchanged) ---------------- */

function Defs() {
  return (
    <defs>
      <marker id="dnd-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" fill={INK} />
      </marker>
      <marker id="dnd-arr-o" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" fill={ORANGE} />
      </marker>
    </defs>
  );
}

function Markings({ diagram }: { diagram: DiagramSpec }) {
  return (
    <>
      <rect x="1" y="1" width="98" height="92" rx="1.5" fill="none" stroke={LINE} strokeWidth="0.7" />
      <rect x="42" y="1" width="16" height="18" fill="rgba(242,107,29,0.07)" stroke={LINE} strokeWidth="0.7" />
      <circle cx="50" cy="19" r="6" fill="none" stroke={LINE} strokeWidth="0.7" strokeDasharray="2.2,1.8" />
      <path d={arcPath(50, 5.25, 4, -72, 72)} fill="none" stroke={LINE} strokeWidth="0.7" />
      <line x1="28" y1="1" x2="28" y2="14.2" stroke={LINE} strokeWidth="0.7" />
      <line x1="72" y1="1" x2="72" y2="14.2" stroke={LINE} strokeWidth="0.7" />
      <path d={arcPath(50, 5.25, 23.75, -68, 68)} fill="none" stroke={LINE} strokeWidth="0.7" />
      <line x1="46.5" y1="4" x2="53.5" y2="4" stroke={INK} strokeWidth="0.9" />
      <circle cx="50" cy="5.25" r="1.4" fill="none" stroke={ORANGE} strokeWidth="0.8" />
      {(diagram.screens ?? []).map((s, i) => (
        <rect key={i} x={s.x - 2.2} y={s.y - 1.2} width="4.4" height="2.4" rx="0.8"
          fill="rgba(242,107,29,0.25)" stroke={ORANGE} strokeWidth="0.7"
          transform={`rotate(${s.angle ?? 0} ${s.x} ${s.y})`} />
      ))}
    </>
  );
}

function Shots({ diagram }: { diagram: DiagramSpec }) {
  return (
    <>
      {(diagram.shots ?? []).map((s, i) => (
        <g key={i}>
          <circle cx={s.x} cy={s.y} r="2.2" fill="none" stroke={ORANGE} strokeWidth="0.8" strokeDasharray="1.4,1.2" />
          <circle cx={s.x} cy={s.y} r="0.7" fill={ORANGE} />
        </g>
      ))}
    </>
  );
}

function OMarker({ x, y, label, hasBall }: { x: number; y: number; label: string; hasBall: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r="3.4" fill={INK} />
      <text x={x} y={y + 1.3} textAnchor="middle" fontSize="2.9" fill="#fff" fontWeight="700">{label}</text>
      {hasBall && <circle cx={x + 4.1} cy={y - 2.6} r="1.5" fill={ORANGE} stroke="#fff" strokeWidth="0.5" />}
    </g>
  );
}

function XMarker({ x, y, label, hasBall }: { x: number; y: number; label: string; hasBall: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r="3.4" fill="rgba(255,255,255,0.85)" stroke={LINE} strokeWidth="0.6" />
      <path d={`M${x - 1.7},${y - 1.7} L${x + 1.7},${y + 1.7} M${x + 1.7},${y - 1.7} L${x - 1.7},${y + 1.7}`}
        stroke={INK} strokeWidth="1.1" strokeLinecap="round" />
      <text x={x} y={y + 6.4} textAnchor="middle" fontSize="2.6" fill={INK} fontWeight="600">{label}</text>
      {hasBall && <circle cx={x + 3.4} cy={y - 3.4} r="1.5" fill={ORANGE} />}
    </g>
  );
}

function Legend({ diagram }: { diagram: DiagramSpec }) {
  return (
    <figcaption className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[color:var(--muted)]">
      {diagram.title && <span className="w-full font-medium text-[color:var(--ink)]">{diagram.title}</span>}
      <span className="inline-flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full bg-[#2b2f36]" /> Offense</span>
      <span className="inline-flex items-center gap-1"><span className="font-bold text-[#2b2f36]">×</span> Defense</span>
      <span className="inline-flex items-center gap-1"><span className="text-[#f26b1d]">●</span> Ball</span>
      <span className="inline-flex items-center gap-1"><span className="inline-block h-2 w-4 rounded-sm border border-[#f26b1d] bg-[#f26b1d]/25" /> Screen</span>
      <span className="inline-flex items-center gap-1"><span className="text-[#2b2f36]">⤍</span> Movement</span>
      <span className="inline-flex items-center gap-1"><span className="text-[#f26b1d]">→</span> Pass</span>
    </figcaption>
  );
}

function movePathD(m: DiagramMove, byLabel: Map<string, { x: number; y: number }>) {
  const a = byLabel.get(m.from)!; const b = byLabel.get(m.to)!;
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 - 2;
  return `M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}`;
}

/* ---------------- animation engine ---------------- */

interface AnimAction {
  kind: "move" | "pass";
  from: string; to: string;
  moveKind?: DiagramMove["kind"];
  start: number; dur: number;
  holderBefore: string | null;
}
interface AnimMove { start: number; dur: number; ax: number; ay: number; cx: number; cy: number; bx: number; by: number }
interface Timeline {
  actions: AnimAction[];
  movesByPlayer: Map<string, AnimMove[]>;
  byLabel: Map<string, { x: number; y: number }>;
  offenseSet: Set<string>;
  initialHolder: string | null;
  total: number;
}

function buildTimeline(diagram: DiagramSpec): Timeline {
  const offense = diagram.offense ?? [];
  const defense = diagram.defense ?? [];
  const byLabel = new Map<string, { x: number; y: number }>();
  [...offense, ...defense].forEach((m) => byLabel.set(m.label, { x: m.x, y: m.y }));
  byLabel.set("rim", { x: 50, y: 5.25 });
  const offenseSet = new Set(offense.map((m) => m.label));
  const moves = (diagram.moves ?? []).filter((m) => byLabel.has(m.from) && byLabel.has(m.to));
  const passes = (diagram.passes ?? []).filter((p) => byLabel.has(p.from) && byLabel.has(p.to));

  const actions: AnimAction[] = [];
  const movesByPlayer = new Map<string, AnimMove[]>();
  const pos = new Map<string, { x: number; y: number }>();
  byLabel.forEach((v, k) => pos.set(k, { x: v.x, y: v.y }));
  let t = 0;
  let holder = diagram.ball && byLabel.has(diagram.ball) ? diagram.ball : null;
  const initialHolder = holder;

  for (const m of moves) {
    const a = pos.get(m.from)!;
    const b = byLabel.get(m.to)!;
    const cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2 - 2;
    const list = movesByPlayer.get(m.from) ?? [];
    list.push({ start: t, dur: MOVE_MS, ax: a.x, ay: a.y, cx, cy, bx: b.x, by: b.y });
    movesByPlayer.set(m.from, list);
    actions.push({ kind: "move", from: m.from, to: m.to, moveKind: m.kind, start: t, dur: MOVE_MS, holderBefore: holder });
    pos.set(m.from, { x: b.x, y: b.y });
    t += MOVE_MS + GAP_MS;
  }
  for (const p of passes) {
    actions.push({ kind: "pass", from: p.from, to: p.to, start: t, dur: PASS_MS, holderBefore: holder });
    if (p.from === holder) holder = p.to;
    t += PASS_MS + GAP_MS;
  }
  const total = actions.length > 0 ? t - GAP_MS + END_MS : 0;
  return { actions, movesByPlayer, byLabel, offenseSet, initialHolder, total };
}

function qpoint(ax: number, ay: number, cx: number, cy: number, bx: number, by: number, k: number) {
  const u = 1 - k;
  return { x: u * u * ax + 2 * u * k * cx + k * k * bx, y: u * u * ay + 2 * u * k * cy + k * k * by };
}

function playerPosAt(tl: Timeline, label: string, t: number) {
  const list = tl.movesByPlayer.get(label);
  if (list) {
    for (let i = list.length - 1; i >= 0; i--) {
      const m = list[i];
      if (t >= m.start + m.dur) return { x: m.bx, y: m.by };
      if (t >= m.start) return qpoint(m.ax, m.ay, m.cx, m.cy, m.bx, m.by, (t - m.start) / m.dur);
    }
  }
  return tl.byLabel.get(label)!;
}

function holderAt(tl: Timeline, t: number): string | null {
  let h = tl.initialHolder;
  for (const a of tl.actions) {
    if (t >= a.start + a.dur && a.kind === "pass" && a.from === h) h = a.to;
  }
  return h;
}

function ballSpot(tl: Timeline, holder: string, p: { x: number; y: number }) {
  return tl.offenseSet.has(holder) ? { x: p.x + 4.1, y: p.y - 2.6 } : { x: p.x + 3.4, y: p.y - 3.4 };
}

function ballAt(tl: Timeline, t: number): { x: number; y: number } | null {
  const act = tl.actions.find((a) => t >= a.start && t < a.start + a.dur);
  if (act && act.holderBefore) {
    if (act.kind === "move" && act.from === act.holderBefore) {
      return ballSpot(tl, act.holderBefore, playerPosAt(tl, act.from, t));
    }
    if (act.kind === "pass" && act.from === act.holderBefore) {
      const k = (t - act.start) / act.dur;
      const a = playerPosAt(tl, act.from, act.start);
      const b = playerPosAt(tl, act.to, act.start);
      return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k };
    }
  }
  const h = holderAt(tl, t);
  if (!h) return null;
  return ballSpot(tl, h, playerPosAt(tl, h, t));
}

/* ---------------- main component ---------------- */

export default function CourtDiagram({ diagram, className = "" }: { diagram: DiagramSpec; className?: string }) {
  const { t } = useLanguage();
  const timeline = useMemo(() => buildTimeline(diagram), [diagram]);
  const hasActions = timeline.actions.length > 0;
  const [reduced] = useState(
    () => typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [started, setStarted] = useState(false); // reduced-motion manual start
  const [playing, setPlaying] = useState(false);
  const [tMs, setTMs] = useState(0);
  const timeRef = useRef(0);
  const interactedRef = useRef(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  /* autoplay when scrolled into view, pause when out */
  useEffect(() => {
    if (!hasActions || reduced) return;
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") { setPlaying(true); return; }
    const io = new IntersectionObserver(
      (es) => { if (!interactedRef.current) setPlaying(es[0].isIntersecting); },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasActions, reduced]);

  /* animation clock (loops forever) */
  useEffect(() => {
    if (!playing || !hasActions) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      timeRef.current += dt;
      if (timeRef.current >= timeline.total) timeRef.current -= timeline.total;
      setTMs(timeRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, hasActions, timeline.total]);

  const doPlay = () => { interactedRef.current = true; setStarted(true); setPlaying(true); };
  const doPause = () => { interactedRef.current = true; setPlaying(false); };
  const doReplay = () => { interactedRef.current = true; timeRef.current = 0; setTMs(0); setStarted(true); setPlaying(true); };

  const badge = (
    <span className="absolute left-2 top-2 rounded-full bg-[#f26b1d] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
      {t("diagram.animated")}
    </span>
  );
  const ctrlBtn = "flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#2b2f36] shadow-md transition hover:scale-105";

  /* no moves/passes: pure static render, controls hidden */
  if (!hasActions) {
    const offense = diagram.offense ?? [];
    const defense = diagram.defense ?? [];
    const byLabel = new Map<string, { x: number; y: number }>();
    [...offense, ...defense].forEach((m) => byLabel.set(m.label, { x: m.x, y: m.y }));
    byLabel.set("rim", { x: 50, y: 5.25 });
    const moves = (diagram.moves ?? []).filter((m) => byLabel.has(m.from) && byLabel.has(m.to));
    const passes = (diagram.passes ?? []).filter((p) => byLabel.has(p.from) && byLabel.has(p.to));
    return (
      <figure className={className}>
        <svg viewBox="0 0 100 94" className="w-full h-auto" role="img" aria-label={diagram.title ?? "Basketball court diagram"}>
          <Defs />
          <Markings diagram={diagram} />
          {moves.map((m, i) => (
            <path key={i} d={movePathD(m, byLabel)} fill="none"
              stroke={INK} strokeWidth="0.9" strokeDasharray={m.kind === "dribble" ? "3,1.6" : "1.4,1.4"}
              markerEnd="url(#dnd-arr)" opacity="0.85" />
          ))}
          {passes.map((p, i) => {
            const a = byLabel.get(p.from)!; const b = byLabel.get(p.to)!;
            return (
              <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke={ORANGE} strokeWidth="1" markerEnd="url(#dnd-arr-o)" opacity="0.9" />
            );
          })}
          <Shots diagram={diagram} />
          {defense.map((m) => <XMarker key={m.label} x={m.x} y={m.y} label={m.label} hasBall={diagram.ball === m.label} />)}
          {offense.map((m) => <OMarker key={m.label} x={m.x} y={m.y} label={m.label} hasBall={diagram.ball === m.label} />)}
        </svg>
        <Legend diagram={diagram} />
      </figure>
    );
  }

  /* reduced motion: static look, manual play only */
  if (reduced && !started) {
    return (
      <figure className={className}>
        <div ref={wrapRef} className="relative">
          <svg viewBox="0 0 100 94" className="w-full h-auto" role="img" aria-label={diagram.title ?? "Basketball court diagram"}>
            <Defs />
            <Markings diagram={diagram} />
            {(diagram.moves ?? []).map((m, i) => {
              const a = timeline.byLabel.get(m.from); const b = timeline.byLabel.get(m.to);
              if (!a || !b) return null;
              return (
                <path key={i} d={movePathD(m, timeline.byLabel)} fill="none"
                  stroke={INK} strokeWidth="0.9" strokeDasharray={m.kind === "dribble" ? "3,1.6" : "1.4,1.4"}
                  markerEnd="url(#dnd-arr)" opacity="0.85" />
              );
            })}
            {(diagram.passes ?? []).map((p, i) => {
              const a = timeline.byLabel.get(p.from); const b = timeline.byLabel.get(p.to);
              if (!a || !b) return null;
              return (
                <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke={ORANGE} strokeWidth="1" markerEnd="url(#dnd-arr-o)" opacity="0.9" />
              );
            })}
            <Shots diagram={diagram} />
            {(diagram.defense ?? []).map((m) => <XMarker key={m.label} x={m.x} y={m.y} label={m.label} hasBall={diagram.ball === m.label} />)}
            {(diagram.offense ?? []).map((m) => <OMarker key={m.label} x={m.x} y={m.y} label={m.label} hasBall={diagram.ball === m.label} />)}
          </svg>
          {badge}
          <div className="absolute right-2 top-2">
            <button onClick={doPlay} aria-label={t("diagram.play")} className={ctrlBtn}>
              <Play className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
        <Legend diagram={diagram} />
      </figure>
    );
  }

  /* animated */
  const tNow = tMs;
  const ball = ballAt(timeline, tNow);
  return (
    <figure className={className}>
      <div ref={wrapRef} className="relative">
        <svg viewBox="0 0 100 94" className="w-full h-auto" role="img" aria-label={diagram.title ?? "Basketball court diagram"}>
          <Defs />
          <Markings diagram={diagram} />
          {timeline.actions.map((a, i) => {
            const p = Math.min(1, Math.max(0, (tNow - a.start) / a.dur));
            if (p <= 0) return null;
            const done = p >= 1;
            if (a.kind === "move") {
              const d = movePathD({ from: a.from, to: a.to, kind: a.moveKind ?? "move" }, timeline.byLabel);
              const dash = a.moveKind === "dribble" ? "3,1.6" : "1.4,1.4";
              return done ? (
                <path key={i} d={d} fill="none" stroke={INK} strokeWidth="0.9" strokeDasharray={dash}
                  markerEnd="url(#dnd-arr)" opacity="0.35" />
              ) : (
                <path key={i} d={d} fill="none" stroke={INK} strokeWidth="0.9" pathLength={100}
                  strokeDasharray="100" strokeDashoffset={100 * (1 - p)}
                  markerEnd="url(#dnd-arr)" opacity="0.85" />
              );
            }
            const A = timeline.byLabel.get(a.from)!; const B = timeline.byLabel.get(a.to)!;
            const d = `M${A.x},${A.y} L${B.x},${B.y}`;
            return done ? (
              <path key={i} d={d} fill="none" stroke={ORANGE} strokeWidth="1" markerEnd="url(#dnd-arr-o)" opacity="0.35" />
            ) : (
              <path key={i} d={d} fill="none" stroke={ORANGE} strokeWidth="1" pathLength={100}
                strokeDasharray="100" strokeDashoffset={100 * (1 - p)}
                markerEnd="url(#dnd-arr-o)" opacity="0.9" />
            );
          })}
          <Shots diagram={diagram} />
          {(diagram.defense ?? []).map((m) => {
            const p = playerPosAt(timeline, m.label, tNow);
            return <XMarker key={m.label} x={p.x} y={p.y} label={m.label} hasBall={false} />;
          })}
          {(diagram.offense ?? []).map((m) => {
            const p = playerPosAt(timeline, m.label, tNow);
            return <OMarker key={m.label} x={p.x} y={p.y} label={m.label} hasBall={false} />;
          })}
          {ball && <circle cx={ball.x} cy={ball.y} r="1.5" fill={ORANGE} stroke="#fff" strokeWidth="0.5" />}
        </svg>
        {badge}
        <div className="absolute right-2 top-2 flex gap-1.5">
          <button onClick={playing ? doPause : doPlay} aria-label={playing ? t("diagram.pause") : t("diagram.play")} className={ctrlBtn}>
            {playing ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
          </button>
          <button onClick={doReplay} aria-label={t("diagram.replay")} className={ctrlBtn}>
            <RotateCcw className="h-4 w-4" aria-hidden />
          </button>
        </div>
        <div className="absolute inset-x-0 top-0 h-[3px] overflow-hidden rounded-full bg-black/10" aria-hidden>
          <div className="h-full bg-[#f26b1d]" style={{ width: `${(tNow / timeline.total) * 100}%` }} />
        </div>
      </div>
      <Legend diagram={diagram} />
    </figure>
  );
}

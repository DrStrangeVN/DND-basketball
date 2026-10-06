"use client";

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

function arcPath(cx: number, cy: number, r: number, fromDeg: number, toDeg: number) {
  const pts: string[] = [];
  for (let d = fromDeg; d <= toDeg; d += 2) {
    const rad = (d * Math.PI) / 180;
    pts.push(`${(cx + r * Math.sin(rad)).toFixed(2)},${(cy + r * Math.cos(rad)).toFixed(2)}`);
  }
  return `M${pts.join(" L")}`;
}

export default function CourtDiagram({ diagram, className = "" }: { diagram: DiagramSpec; className?: string }) {
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
        <defs>
          <marker id="dnd-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={INK} />
          </marker>
          <marker id="dnd-arr-o" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={ORANGE} />
          </marker>
        </defs>

        {/* court shell */}
        <rect x="1" y="1" width="98" height="92" rx="1.5" fill="none" stroke={LINE} strokeWidth="0.7" />
        {/* paint */}
        <rect x="42" y="1" width="16" height="18" fill="rgba(242,107,29,0.07)" stroke={LINE} strokeWidth="0.7" />
        {/* free throw circle */}
        <circle cx="50" cy="19" r="6" fill="none" stroke={LINE} strokeWidth="0.7" strokeDasharray="2.2,1.8" />
        {/* restricted arc */}
        <path d={arcPath(50, 5.25, 4, -72, 72)} fill="none" stroke={LINE} strokeWidth="0.7" />
        {/* three point */}
        <line x1="28" y1="1" x2="28" y2="14.2" stroke={LINE} strokeWidth="0.7" />
        <line x1="72" y1="1" x2="72" y2="14.2" stroke={LINE} strokeWidth="0.7" />
        <path d={arcPath(50, 5.25, 23.75, -68, 68)} fill="none" stroke={LINE} strokeWidth="0.7" />
        {/* backboard + rim */}
        <line x1="46.5" y1="4" x2="53.5" y2="4" stroke={INK} strokeWidth="0.9" />
        <circle cx="50" cy="5.25" r="1.4" fill="none" stroke={ORANGE} strokeWidth="0.8" />

        {/* screens */}
        {(diagram.screens ?? []).map((s, i) => (
          <rect key={i} x={s.x - 2.2} y={s.y - 1.2} width="4.4" height="2.4" rx="0.8"
            fill="rgba(242,107,29,0.25)" stroke={ORANGE} strokeWidth="0.7"
            transform={`rotate(${s.angle ?? 0} ${s.x} ${s.y})`} />
        ))}

        {/* moves */}
        {moves.map((m, i) => {
          const a = byLabel.get(m.from)!; const b = byLabel.get(m.to)!;
          const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 - 2;
          return (
            <g key={i}>
              <path d={`M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}`} fill="none"
                stroke={INK} strokeWidth="0.9" strokeDasharray={m.kind === "dribble" ? "3,1.6" : "1.4,1.4"}
                markerEnd="url(#dnd-arr)" opacity="0.85" />
            </g>
          );
        })}

        {/* passes */}
        {passes.map((p, i) => {
          const a = byLabel.get(p.from)!; const b = byLabel.get(p.to)!;
          return (
            <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={ORANGE} strokeWidth="1" markerEnd="url(#dnd-arr-o)" opacity="0.9" />
          );
        })}

        {/* shots */}
        {(diagram.shots ?? []).map((s, i) => (
          <g key={i}>
            <circle cx={s.x} cy={s.y} r="2.2" fill="none" stroke={ORANGE} strokeWidth="0.8" strokeDasharray="1.4,1.2" />
            <circle cx={s.x} cy={s.y} r="0.7" fill={ORANGE} />
          </g>
        ))}

        {/* defense X markers */}
        {defense.map((m) => (
          <g key={m.label}>
            <circle cx={m.x} cy={m.y} r="3.4" fill="rgba(255,255,255,0.85)" stroke={LINE} strokeWidth="0.6" />
            <path d={`M${m.x - 1.7},${m.y - 1.7} L${m.x + 1.7},${m.y + 1.7} M${m.x + 1.7},${m.y - 1.7} L${m.x - 1.7},${m.y + 1.7}`}
              stroke={INK} strokeWidth="1.1" strokeLinecap="round" />
            <text x={m.x} y={m.y + 6.4} textAnchor="middle" fontSize="2.6" fill={INK} fontWeight="600">{m.label}</text>
            {diagram.ball === m.label && <circle cx={m.x + 3.4} cy={m.y - 3.4} r="1.5" fill={ORANGE} />}
          </g>
        ))}

        {/* offense O markers */}
        {offense.map((m) => (
          <g key={m.label}>
            <circle cx={m.x} cy={m.y} r="3.4" fill={INK} />
            <text x={m.x} y={m.y + 1.3} textAnchor="middle" fontSize="2.9" fill="#fff" fontWeight="700">{m.label}</text>
            {diagram.ball === m.label && <circle cx={m.x + 4.1} cy={m.y - 2.6} r="1.5" fill={ORANGE} stroke="#fff" strokeWidth="0.5" />}
          </g>
        ))}
      </svg>
      <figcaption className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[color:var(--muted)]">
        {diagram.title && <span className="w-full font-medium text-[color:var(--ink)]">{diagram.title}</span>}
        <span className="inline-flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full bg-[#2b2f36]" /> Offense</span>
        <span className="inline-flex items-center gap-1"><span className="font-bold text-[#2b2f36]">×</span> Defense</span>
        <span className="inline-flex items-center gap-1"><span className="text-[#f26b1d]">●</span> Ball</span>
        <span className="inline-flex items-center gap-1"><span className="inline-block h-2 w-4 rounded-sm border border-[#f26b1d] bg-[#f26b1d]/25" /> Screen</span>
        <span className="inline-flex items-center gap-1"><span className="text-[#2b2f36]">⤍</span> Movement</span>
        <span className="inline-flex items-center gap-1"><span className="text-[#f26b1d]">→</span> Pass</span>
      </figcaption>
    </figure>
  );
}

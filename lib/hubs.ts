export type HubId =
  | "fundamentals" | "skills" | "defense" | "offense" | "pick-and-roll"
  | "tactics" | "transition" | "basketball-iq" | "positions" | "coaching";

export interface HubGroup { id: string; title: string; description: string }
export interface HubMeta {
  id: HubId; route: string; title: string; tagline: string; description: string;
  icon: string; groups: HubGroup[];
}

export const HUBS: HubMeta[] = [
  {
    id: "fundamentals", route: "/fundamentals", title: "Fundamentals",
    tagline: "Basketball Basics", icon: "book-open",
    description: "The essential foundation: rules, court, positions, scoring, violations, fouls, spacing and core principles of the game.",
    groups: [{ id: "fundamentals", title: "Basketball Basics", description: "Start here — how the game works." }],
  },
  {
    id: "skills", route: "/skills", title: "Skills",
    tagline: "Individual Skill Development", icon: "dribbble",
    description: "Ball handling, shooting, finishing, passing, footwork, post play and rebounding — every skill broken into learnable steps.",
    groups: [
      { id: "ball-handling", title: "Ball Handling", description: "Dribbling moves, control and change of pace." },
      { id: "shooting", title: "Shooting", description: "Mechanics, footwork and every shot type." },
      { id: "finishing", title: "Finishing", description: "Layups, euro steps, floaters and contact finishes." },
      { id: "passing", title: "Passing", description: "Every pass type and passing reads." },
      { id: "footwork", title: "Footwork", description: "Stops, pivots, jab steps and triple threat." },
      { id: "post-play", title: "Post Play", description: "Positioning, seals and post moves." },
      { id: "rebounding", title: "Rebounding", description: "Box outs and rebounding technique." },
    ],
  },
  {
    id: "defense", route: "/defense", title: "Defense",
    tagline: "Individual & Team Defense", icon: "shield",
    description: "Stance, on-ball defense, help rotations, ball-screen coverages and complete defensive systems.",
    groups: [
      { id: "defense-fundamentals", title: "Defense Fundamentals", description: "Stance, closeouts, help and rotations." },
      { id: "defensive-systems", title: "Defensive Systems", description: "Man, pack line, zones, junk defenses and press." },
    ],
  },
  {
    id: "offense", route: "/offense", title: "Offense",
    tagline: "Team Offense Concepts", icon: "zap",
    description: "Spacing, motion, 5-out, drive & kick, cutting and screening — how modern team offense works.",
    groups: [{ id: "team-offense", title: "Team Offense", description: "Systems and concepts for scoring together." }],
  },
  {
    id: "pick-and-roll", route: "/pick-and-roll", title: "Pick & Roll",
    tagline: "The Complete Ball-Screen Hub", icon: "git-branch",
    description: "Basketball's most important action: basics, reads, coverages, counters and advanced variations like Spain PnR.",
    groups: [{ id: "pick-and-roll", title: "Pick & Roll Mastery", description: "From first screen to elite reads." }],
  },
  {
    id: "tactics", route: "/tactics", title: "Offensive Actions",
    tagline: "Basketball Action Encyclopedia", icon: "network",
    description: "DHO, Zoom, Chicago, Horns, Floppy, Iverson cuts, staggers, elevator screens — every action explained with diagrams.",
    groups: [{ id: "offensive-actions", title: "Actions Encyclopedia", description: "The plays behind the plays." }],
  },
  {
    id: "transition", route: "/transition", title: "Transition",
    tagline: "Fast-Break Basketball", icon: "wind",
    description: "Transition offense, running lanes, advance passes and getting stops before the defense sets.",
    groups: [{ id: "transition", title: "Transition Basketball", description: "Speed, spacing and early offense." }],
  },
  {
    id: "basketball-iq", route: "/basketball-iq", title: "Basketball IQ",
    tagline: "See the Game Before It Happens", icon: "brain",
    description: "Reads, timing, advantages, decision making and clock management — train your mind, not just your moves.",
    groups: [{ id: "basketball-iq", title: "Basketball IQ", description: "Think the game at a higher level." }],
  },
  {
    id: "positions", route: "/positions", title: "Positions",
    tagline: "Position Development", icon: "users",
    description: "What each position must master — from point guard craft to modern positionless basketball.",
    groups: [{ id: "positions", title: "By Position", description: "Train for your role." }],
  },
  {
    id: "coaching", route: "/coaching", title: "Coaches Corner",
    tagline: "Coaching Knowledge Hub", icon: "clipboard-list",
    description: "Practice planning, player development, teaching, scouting, film study and team culture.",
    groups: [{ id: "coaching", title: "Coaching", description: "Coach smarter." }],
  },
];

export const hubById = (id: string): HubMeta | undefined => HUBS.find((h) => h.id === id);

export const LEVEL_META: Record<string, { label: string; dot: string }> = {
  beginner: { label: "Beginner", dot: "bg-emerald-500" },
  intermediate: { label: "Intermediate", dot: "bg-sky-500" },
  advanced: { label: "Advanced", dot: "bg-orange-500" },
  elite: { label: "Elite", dot: "bg-rose-600" },
};

export const AGE_GROUPS = ["U8","U10","U12","U14","U16","U18","Adult","Competitive"];
export const POSITION_FILTERS = ["PG","SG","SF","PF","C"];

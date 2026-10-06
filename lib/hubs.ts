export type HubId =
  | "fundamentals" | "skills" | "defense" | "offense" | "pick-and-roll"
  | "tactics" | "transition" | "basketball-iq" | "positions" | "coaching";

export interface HubGroup { id: string; title: string; description: string; titleVi?: string; descriptionVi?: string }
export interface HubMeta {
  id: HubId; route: string; title: string; tagline: string; description: string;
  icon: string; groups: HubGroup[];
  titleVi?: string; taglineVi?: string; descriptionVi?: string;
}

/** Localized hub field accessor. */
export function hubText(h: HubMeta, lang: "vi" | "en", field: "title" | "tagline" | "description"): string {
  if (lang === "vi") {
    if (field === "title" && h.titleVi) return h.titleVi;
    if (field === "tagline" && h.taglineVi) return h.taglineVi;
    if (field === "description" && h.descriptionVi) return h.descriptionVi;
  }
  return h[field];
}
export function hubGroupText(g: HubGroup, lang: "vi" | "en", field: "title" | "description"): string {
  if (lang === "vi") {
    if (field === "title" && g.titleVi) return g.titleVi;
    if (field === "description" && g.descriptionVi) return g.descriptionVi;
  }
  return g[field];
}

export const HUBS: HubMeta[] = [
  {
    id: "fundamentals", route: "/fundamentals", title: "Fundamentals",
    tagline: "Basketball Basics", icon: "book-open",
    description: "The essential foundation: rules, court, positions, scoring, violations, fouls, spacing and core principles of the game.",
    titleVi: "Căn bản", taglineVi: "Kiến thức bóng rổ cơ bản",
    descriptionVi: "Nền tảng thiết yếu: luật, sân, vị trí, cách tính điểm, lỗi vi phạm, lỗi cá nhân, giãn cách đội hình và các nguyên tắc cốt lõi của trận đấu.",
    groups: [{ id: "fundamentals", title: "Basketball Basics", titleVi: "Kiến thức cơ bản", descriptionVi: "Bắt đầu từ đây — cách trận đấu vận hành.", description: "Start here — how the game works." }],
  },
  {
    id: "skills", route: "/skills", title: "Skills",
    tagline: "Individual Skill Development", icon: "dribbble",
    description: "Ball handling, shooting, finishing, passing, footwork, post play and rebounding — every skill broken into learnable steps.",
    titleVi: "Kỹ năng", taglineVi: "Phát triển kỹ năng cá nhân",
    descriptionVi: "Dẫn bóng, ném rổ, dứt điểm, chuyền bóng, footwork, đánh post và bắt bóng bật bảng — mọi kỹ năng được chia thành từng bước dễ học.",
    groups: [
      { id: "ball-handling", title: "Ball Handling", titleVi: "Dẫn bóng", descriptionVi: "Các động tác qua người, kiểm soát bóng và đổi nhịp.", description: "Dribbling moves, control and change of pace." },
      { id: "shooting", title: "Shooting", titleVi: "Ném rổ", descriptionVi: "Kỹ thuật, footwork và mọi kiểu ném.", description: "Mechanics, footwork and every shot type." },
      { id: "finishing", title: "Finishing", titleVi: "Dứt điểm", descriptionVi: "Layup, euro step, floater và dứt điểm khi va chạm.", description: "Layups, euro steps, floaters and contact finishes." },
      { id: "passing", title: "Passing", titleVi: "Chuyền bóng", descriptionVi: "Mọi kiểu chuyền và đọc tình huống chuyền.", description: "Every pass type and passing reads." },
      { id: "footwork", title: "Footwork", titleVi: "Footwork", descriptionVi: "Dừng bước, pivot, jab step và tư thế triple threat.", description: "Stops, pivots, jab steps and triple threat." },
      { id: "post-play", title: "Post Play", titleVi: "Đánh post", descriptionVi: "Chọn vị trí, che người và các động tác post.", description: "Positioning, seals and post moves." },
      { id: "rebounding", title: "Rebounding", titleVi: "Bắt bóng bật bảng", descriptionVi: "Box out và kỹ thuật rebound.", description: "Box outs and rebounding technique." },
    ],
  },
  {
    id: "defense", route: "/defense", title: "Defense",
    tagline: "Individual & Team Defense", icon: "shield",
    description: "Stance, on-ball defense, help rotations, ball-screen coverages and complete defensive systems.",
    titleVi: "Phòng thủ", taglineVi: "Phòng thủ cá nhân & đồng đội",
    descriptionVi: "Tư thế thủ, kèm người có bóng, xoay bọc lót, các cách chống pick and roll và hệ thống phòng thủ hoàn chỉnh.",
    groups: [
      { id: "defense-fundamentals", title: "Defense Fundamentals", titleVi: "Căn bản phòng thủ", descriptionVi: "Tư thế, closeout, bọc lót và xoay đội hình.", description: "Stance, closeouts, help and rotations." },
      { id: "defensive-systems", title: "Defensive Systems", titleVi: "Hệ thống phòng thủ", descriptionVi: "Kèm người, pack line, zone, các biến thể đặc biệt và pressing.", description: "Man, pack line, zones, junk defenses and press." },
    ],
  },
  {
    id: "offense", route: "/offense", title: "Offense",
    tagline: "Team Offense Concepts", icon: "zap",
    description: "Spacing, motion, 5-out, drive & kick, cutting and screening — how modern team offense works.",
    titleVi: "Tấn công", taglineVi: "Khái niệm tấn công đồng đội",
    descriptionVi: "Giãn cách, motion, 5-out, drive & kick, cắt rổ và chắn người — cách vận hành của lối đánh đồng đội hiện đại.",
    groups: [{ id: "team-offense", title: "Team Offense", titleVi: "Tấn công đồng đội", descriptionVi: "Hệ thống và khái niệm để ghi điểm cùng nhau.", description: "Systems and concepts for scoring together." }],
  },
  {
    id: "pick-and-roll", route: "/pick-and-roll", title: "Pick & Roll",
    tagline: "The Complete Ball-Screen Hub", icon: "git-branch",
    description: "Basketball's most important action: basics, reads, coverages, counters and advanced variations like Spain PnR.",
    titleVi: "Pick & Roll", taglineVi: "Trung tâm toàn diện về chắn bóng",
    descriptionVi: "Miếng đánh quan trọng nhất của bóng rổ: căn bản, cách đọc, các kiểu chống, đòn phản công và biến thể nâng cao như Spain PnR.",
    groups: [{ id: "pick-and-roll", title: "Pick & Roll Mastery", titleVi: "Chinh phục Pick & Roll", descriptionVi: "Từ lần chắn đầu tiên đến những pha đọc đẳng cấp.", description: "From first screen to elite reads." }],
  },
  {
    id: "tactics", route: "/tactics", title: "Offensive Actions",
    tagline: "Basketball Action Encyclopedia", icon: "network",
    description: "DHO, Zoom, Chicago, Horns, Floppy, Iverson cuts, staggers, elevator screens — every action explained with diagrams.",
    titleVi: "Các miếng đánh", taglineVi: "Bách khoa toàn thư chiến thuật",
    descriptionVi: "DHO, Zoom, Chicago, Horns, Floppy, cắt Iverson, stagger, elevator screen — mọi miếng đánh được giải thích kèm sơ đồ.",
    groups: [{ id: "offensive-actions", title: "Actions Encyclopedia", titleVi: "Bách khoa miếng đánh", descriptionVi: "Những miếng đánh đằng sau các miếng đánh.", description: "The plays behind the plays." }],
  },
  {
    id: "transition", route: "/transition", title: "Transition",
    tagline: "Fast-Break Basketball", icon: "wind",
    description: "Transition offense, running lanes, advance passes and getting stops before the defense sets.",
    titleVi: "Chuyển đổi", taglineVi: "Bóng rổ tốc độ cao",
    descriptionVi: "Tấn công chuyển đổi, chạy lane, chuyền vượt tuyến và chặn đứng đối phương trước khi hàng thủ kịp về vị trí.",
    groups: [{ id: "transition", title: "Transition Basketball", titleVi: "Bóng rổ chuyển đổi", descriptionVi: "Tốc độ, giãn cách và tấn công sớm.", description: "Speed, spacing and early offense." }],
  },
  {
    id: "basketball-iq", route: "/basketball-iq", title: "Basketball IQ",
    tagline: "See the Game Before It Happens", icon: "brain",
    description: "Reads, timing, advantages, decision making and clock management — train your mind, not just your moves.",
    titleVi: "IQ Bóng rổ", taglineVi: "Nhìn thấy trận đấu trước khi nó diễn ra",
    descriptionVi: "Đọc tình huống, thời điểm, tạo lợi thế, ra quyết định và quản lý đồng hồ — rèn trí óc, không chỉ động tác.",
    groups: [{ id: "basketball-iq", title: "Basketball IQ", titleVi: "IQ Bóng rổ", descriptionVi: "Tư duy trận đấu ở đẳng cấp cao hơn.", description: "Think the game at a higher level." }],
  },
  {
    id: "positions", route: "/positions", title: "Positions",
    tagline: "Position Development", icon: "users",
    description: "What each position must master — from point guard craft to modern positionless basketball.",
    titleVi: "Vị trí", taglineVi: "Phát triển theo vị trí",
    descriptionVi: "Mỗi vị trí cần thành thạo những gì — từ nghệ thuật của hậu vệ dẫn bóng đến lối chơi không vị trí hiện đại.",
    groups: [{ id: "positions", title: "By Position", titleVi: "Theo vị trí", descriptionVi: "Tập luyện cho vai trò của bạn.", description: "Train for your role." }],
  },
  {
    id: "coaching", route: "/coaching", title: "Coaches Corner",
    tagline: "Coaching Knowledge Hub", icon: "clipboard-list",
    description: "Practice planning, player development, teaching, scouting, film study and team culture.",
    titleVi: "Góc HLV", taglineVi: "Trung tâm kiến thức huấn luyện",
    descriptionVi: "Lập kế hoạch buổi tập, phát triển cầu thủ, giảng dạy, trinh sát đối thủ, xem film và xây dựng văn hóa đội bóng.",
    groups: [{ id: "coaching", title: "Coaching", titleVi: "Huấn luyện", descriptionVi: "Huấn luyện thông minh hơn.", description: "Coach smarter." }],
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

"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "vi" | "en";
const STORAGE_KEY = "dnd:lang";

/** Pick the localized value: Vietnamese when lang is vi and a translation exists. */
export function pick<T>(lang: Lang, en: T, vi?: T): T {
  return lang === "vi" && vi !== undefined ? vi : en;
}

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Translate a UI string key. */
  t: (key: string) => string;
}

const Ctx = createContext<LangCtx>({ lang: "vi", setLang: () => {}, t: (k) => k });

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Always start with 'vi' so the first client render matches the pre-rendered HTML.
  const [lang, setLangState] = useState<Lang>("vi");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "vi") setLangState(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {}
  }, [lang]);

  const t = (key: string): string => {
    const e = STRINGS[key];
    if (!e) return key;
    return lang === "vi" ? e.vi : e.en;
  };

  return <Ctx.Provider value={{ lang, setLang: setLangState, t }}>{children}</Ctx.Provider>;
}

export function useLanguage(): LangCtx {
  return useContext(Ctx);
}

/* ------------------------------------------------------------------ */
/* UI string dictionary: English (original) + Vietnamese translations. */
/* ------------------------------------------------------------------ */

const STRINGS: Record<string, { vi: string; en: string }> = {
  /* Brand */
  "brand.tagline": { vi: "Trung tâm kiến thức", en: "Knowledge Hub" },
  "brand.home": { vi: "Trang chủ DND Basketball", en: "DND Basketball home" },

  /* Nav */
  "nav.learn": { vi: "Học", en: "Learn" },
  "nav.tactics": { vi: "Chiến thuật", en: "Tactics" },
  "nav.coaching": { vi: "Huấn luyện", en: "Coaching" },
  "nav.skills": { vi: "Kỹ năng", en: "Skills" },
  "nav.drills": { vi: "Bài tập", en: "Drills" },
  "nav.basketballIq": { vi: "IQ bóng rổ", en: "Basketball IQ" },
  "nav.filmRoom": { vi: "Phòng phim", en: "Film Room" },
  "nav.fundamentals": { vi: "Căn bản", en: "Fundamentals" },
  "nav.positions": { vi: "Vị trí", en: "Positions" },
  "nav.glossary": { vi: "Thuật ngữ", en: "Glossary" },
  "nav.offense": { vi: "Tấn công", en: "Offense" },
  "nav.defense": { vi: "Phòng thủ", en: "Defense" },
  "nav.pickAndRoll": { vi: "Pick & Roll", en: "Pick & Roll" },
  "nav.actions": { vi: "Các miếng đánh", en: "Actions" },
  "nav.transition": { vi: "Chuyển trạng thái", en: "Transition" },
  "nav.coachesCorner": { vi: "Góc HLV", en: "Coaches Corner" },
  "nav.drillLibrary": { vi: "Thư viện bài tập", en: "Drill Library" },
  "nav.workouts": { vi: "Giáo án tập", en: "Workouts" },
  "nav.learningPaths": { vi: "Lộ trình học", en: "Learning Paths" },
  "nav.search.placeholder": { vi: "Tìm kiếm kỹ năng, chiến thuật, bài tập…", en: "Search skills, tactics, drills…" },
  "nav.search.label": { vi: "Tìm kiếm", en: "Search" },
  "nav.menu.open": { vi: "Mở menu", en: "Open menu" },
  "nav.menu.close": { vi: "Đóng menu", en: "Close menu" },
  "nav.library": { vi: "Thư viện", en: "Library" },

  /* Search */
  "search.title": { vi: "Tìm kiếm", en: "Search" },
  "search.pageTitle": { vi: "Tìm kiếm kiến thức bóng rổ", en: "Search Basketball Knowledge" },
  "search.clear": { vi: "Xóa tìm kiếm", en: "Clear search" },
  "search.tagged": { vi: "Gắn thẻ", en: "Tagged" },
  "search.clearTag": { vi: "Bỏ thẻ", en: "clear" },
  "search.tryLabel": { vi: "Thử", en: "Try" },
  "search.placeholder": { vi: "Nhập kỹ năng, chiến thuật, bài tập, thuật ngữ…", en: "Type a skill, tactic, drill, term…" },
  "search.noResults": { vi: "Không tìm thấy kết quả cho", en: "No results for" },
  "search.tryDifferent": { vi: "Thử từ khóa khác, ví dụ “pick and roll”, “shooting”, “zone”.", en: "Try a different keyword, e.g. “pick and roll”, “shooting”, “zone”." },
  "search.results": { vi: "kết quả", en: "results" },
  "search.hint": { vi: "Mẹo: nhấn Enter để xem tất cả kết quả", en: "Tip: press Enter to see all results" },
  "search.articles": { vi: "Bài viết", en: "Articles" },
  "search.drills": { vi: "Bài tập", en: "Drills" },
  "search.workouts": { vi: "Giáo án tập", en: "Workouts" },
  "search.paths": { vi: "Lộ trình", en: "Paths" },
  "search.glossary": { vi: "Thuật ngữ", en: "Glossary" },
  "search.performance": { vi: "Thể lực", en: "Performance" },
  "search.viewAll": { vi: "Xem tất cả kết quả", en: "View all results" },
  "search.popular": { vi: "Tìm kiếm phổ biến", en: "Popular searches" },
  "search.searchAll": { vi: "Tìm trong toàn bộ nội dung", en: "Search all content" },

  /* Learn page */
  "learn.eyebrow": { vi: "Bắt đầu học", en: "Start Learning" },
  "learn.title": { vi: "Học bóng rổ", en: "Learn Basketball" },
  "learn.desc": { vi: "Toàn bộ hệ thống kiến thức DND Basketball. Duyệt theo chủ đề, hoặc khám phá theo kỹ năng, trình độ, vai trò và tình huống thi đấu.", en: "Every hub in the DND Basketball knowledge system. Browse by topic, or discover content by skill, level, role or game situation." },
  "learn.discoverEyebrow": { vi: "Khám phá", en: "Discovery" },
  "learn.discoverTitle": { vi: "Chọn cách học của bạn", en: "Find Your Way In" },
  "learn.bySkill": { vi: "Theo kỹ năng", en: "By Skill" },
  "learn.byLevel": { vi: "Theo trình độ", en: "By Level" },
  "learn.byRole": { vi: "Theo vai trò", en: "By Role" },
  "learn.bySituation": { vi: "Theo tình huống", en: "By Situation" },
  "learn.rolePlayer": { vi: "Cầu thủ", en: "Player" },
  "learn.rolePG": { vi: "Hậu vệ dẫn bóng", en: "Point Guard" },
  "learn.roleCoach": { vi: "Huấn luyện viên", en: "Coach" },
  "learn.roleFan": { vi: "Phụ huynh / Fan mới", en: "Parent / New Fan" },
  "learn.sitHalfCourt": { vi: "Nửa sân", en: "Half Court" },
  "learn.sitLateGame": { vi: "Cuối trận", en: "Late Game" },
  "learn.moreDrills": { vi: "Tập có mục đích", en: "Train with purpose" },
  "learn.moreWorkouts": { vi: "Checklist theo buổi", en: "Follow-along checklists" },
  "learn.morePaths": { vi: "Tiến bộ có cấu trúc", en: "Structured progression" },
  "learn.moreFilm": { vi: "Xem phân tích", en: "Watch breakdowns" },
  "learn.moreGlossary": { vi: "Thuật ngữ A–Z", en: "A–Z terminology" },

  /* Home */
  "home.hero.kicker": { vi: "Học. Tập. Hiểu trận đấu.", en: "Learn. Train. Understand the Game." },
  "home.hero.kicker2": { vi: "Trung tâm kiến thức bóng rổ hoàn chỉnh", en: "The Complete Basketball Knowledge Hub" },
  "home.hero.title1": { vi: "Chinh phục môn", en: "Master the Game of" },
  "home.hero.titleBasketball": { vi: "Bóng rổ", en: "Basketball" },
  "home.hero.title": { vi: "Trung tâm kiến thức bóng rổ hoàn chỉnh", en: "The Complete Basketball Knowledge Hub" },
  "home.hero.startLearning": { vi: "Bắt đầu học", en: "Start Learning" },
  "home.hero.exploreSkills": { vi: "Khám phá kỹ năng", en: "Explore Skills" },
  "home.stats.concepts": { vi: "khái niệm", en: "concepts" },
  "home.explore.eyebrow": { vi: "Trung tâm kiến thức", en: "Knowledge Hubs" },
  "home.explore.title": { vi: "Khám phá bóng rổ", en: "Explore Basketball" },
  "home.explore.desc": { vi: "Mười trung tâm. Một trận đấu. Chọn nơi bắt đầu — mọi con đường đều liên kết.", en: "Nine hubs. One game. Pick where to start — every path connects." },
  "home.explore.skills.t": { vi: "Kỹ năng", en: "Skills" },
  "home.explore.skills.d": { vi: "Dẫn bóng, ném rổ, dứt điểm, chuyền bóng và bộ chân.", en: "Ball handling, shooting, finishing, passing and footwork." },
  "home.explore.shooting.t": { vi: "Ném rổ", en: "Shooting" },
  "home.explore.shooting.d": { vi: "Kỹ thuật, bộ chân và mọi kiểu ném.", en: "Mechanics, footwork and every shot type." },
  "home.explore.iq.t": { vi: "IQ bóng rổ", en: "Basketball IQ" },
  "home.explore.iq.d": { vi: "Đọc tình huống, thời điểm, lợi thế và ra quyết định.", en: "Reads, timing, advantages and decision making." },
  "home.explore.tactics.t": { vi: "Chiến thuật", en: "Tactics" },
  "home.explore.tactics.d": { vi: "Pick & roll, các miếng đánh, tấn công và hệ thống phòng thủ.", en: "Pick & roll, actions, offense and defensive systems." },
  "home.explore.drills.t": { vi: "Bài tập", en: "Drills" },
  "home.explore.drills.d": { vi: "Thư viện bài tập có bộ lọc, kèm lưu ý huấn luyện.", en: "Filterable drill library with coaching points." },
  "home.explore.film.t": { vi: "Phòng phim", en: "Film Room" },
  "home.explore.film.d": { vi: "Video phân tích YouTube tuyển chọn, chỉ tải khi bạn bấm xem.", en: "Curated YouTube breakdowns, lazy-loaded." },
  "home.explore.defense.t": { vi: "Phòng thủ", en: "Defense" },
  "home.explore.defense.d": { vi: "Tư thế, hỗ trợ, chống pick and roll và phòng thủ zone.", en: "Stance, help, ball-screen coverages and zones." },
  "home.explore.offense.t": { vi: "Tấn công", en: "Offense" },
  "home.explore.offense.d": { vi: "Giãn đội hình, motion, 5-out và drive & kick.", en: "Spacing, motion, 5-out and drive & kick." },
  "home.explore.coaching.t": { vi: "Huấn luyện", en: "Coaching" },
  "home.explore.coaching.d": { vi: "Lập kế hoạch buổi tập, giảng dạy và văn hóa đội.", en: "Practice planning, teaching and team culture." },
  "home.quick.eyebrow": { vi: "Học trong 5 phút", en: "Learn in 5 Minutes" },
  "home.quick.title": { vi: "Học nhanh", en: "Quick Learn" },
  "home.quick.drop": { vi: "Phòng thủ drop coverage là gì?", en: "What is Drop Coverage?" },
  "home.quick.spain": { vi: "Spain pick & roll là gì?", en: "What is Spain Pick & Roll?" },
  "home.quick.ice": { vi: "Phòng thủ ICE là gì?", en: "What is ICE Defense?" },
  "home.quick.ghost": { vi: "Ghost screen là gì?", en: "What is a Ghost Screen?" },
  "home.quick.lowman": { vi: "Low man là gì?", en: "What is the Low Man?" },
  "home.popular.eyebrow": { vi: "Bắt đầu từ đây", en: "Start here" },
  "home.popular.title": { vi: "Khái niệm nổi bật", en: "Popular Concepts" },
  "home.vision.eyebrow": { vi: "IQ bóng rổ", en: "Basketball IQ" },
  "home.vision.desc": { vi: "Bạn sẽ làm gì ở đây? Đọc tình huống, chọn đáp án, rồi xem cách đọc đúng.", en: "What should you do here? Read the situation, pick your answer, then reveal the read." },
  "home.paths.eyebrow": { vi: "Tiến bộ có cấu trúc", en: "Structured progress" },
  "home.drills.eyebrow": { vi: "Tập luyện", en: "Train" },
  "home.drills.desc": { vi: "Lọc theo kỹ năng, trình độ, số người, dụng cụ và thời gian.", en: "Filter by skill, level, players, equipment and duration." },
  "home.film.eyebrow": { vi: "Xem & học", en: "Watch & learn" },
  "home.film.desc": { vi: "Video phân tích công khai được tuyển chọn — không lưu trữ tại đây, chỉ tải khi bạn bấm xem.", en: "Curated public breakdowns — nothing hosted here, everything lazy-loaded." },
  "home.coach.eyebrow": { vi: "Dành cho HLV", en: "For coaches" },
  "home.coach.title": { vi: "Góc HLV", en: "Coaches Corner" },
  "home.coach.desc": { vi: "Lập kế hoạch buổi tập, giảng dạy, phân tích video và văn hóa đội.", en: "Practice planning, teaching, film study and culture." },
  "home.latest.eyebrow": { vi: "Kiến thức mới", en: "Fresh knowledge" },
  "home.latest.title": { vi: "Kiến thức mới nhất", en: "Latest Knowledge" },
  "home.workoutsCta.title": { vi: "Sẵn sàng tập luyện? Hãy theo một giáo án có checklist.", en: "Ready to train? Follow a workout checklist." },
  "home.workoutsCta.desc": { vi: "{n} giáo án có cấu trúc kèm checklist — từ dẫn bóng 10 phút đến routine ngày thi đấu.", en: "{n} structured workouts with checklists — from 10-minute ball handling to game-day routines." },
  "home.workoutsCta.button": { vi: "Xem giáo án", en: "Browse Workouts" },
  "home.hero.subtitle": {
    vi: "250 bài học chuyên sâu, 60 bài tập, 14 giáo án, 10 lộ trình học — từ căn bản đến chiến thuật nâng cao, sắp xếp theo trình tự để bạn học dần lên.",
    en: "200 in-depth lessons, 40 drills, 14 workouts, 10 learning paths — from fundamentals to advanced tactics, all structured for progressive learning.",
  },
  "home.hero.searchCta": { vi: "Bắt đầu tìm kiếm", en: "Start searching" },
  "home.hero.browseCta": { vi: "Khám phá các trung tâm", en: "Browse the hubs" },
  "home.stats.articles": { vi: "Bài viết", en: "Articles" },
  "home.stats.drills": { vi: "Bài tập", en: "Drills" },
  "home.stats.workouts": { vi: "Giáo án tập", en: "Workouts" },
  "home.stats.paths": { vi: "Lộ trình", en: "Paths" },
  "home.hubs.title": { vi: "Khám phá theo trung tâm", en: "Explore by hub" },
  "home.hubs.subtitle": { vi: "Kiến thức được tổ chức thành 10 trung tâm chuyên biệt", en: "Knowledge organized into 10 specialized hubs" },
  "home.paths.title": { vi: "Lộ trình học", en: "Learning paths" },
  "home.paths.subtitle": { vi: "Học theo trình tự, từ cơ bản đến nâng cao", en: "Learn in sequence, from basics to advanced" },
  "home.paths.viewAll": { vi: "Xem tất cả lộ trình", en: "View all paths" },
  "home.concept.title": { vi: "Khái niệm hôm nay", en: "Concept of the day" },
  "home.drills.title": { vi: "Bài tập nổi bật", en: "Featured drills" },
  "home.drills.viewAll": { vi: "Xem thư viện bài tập", en: "View drill library" },
  "home.film.title": { vi: "Phòng phim", en: "Film Room" },
  "home.film.subtitle": { vi: "Phân tích video từ các HLV hàng đầu", en: "Video breakdowns from top coaches" },
  "home.film.viewAll": { vi: "Vào phòng phim", en: "Enter Film Room" },
  "home.glossary.title": { vi: "Tra cứu thuật ngữ", en: "Look up a term" },
  "home.glossary.subtitle": { vi: "Từ điển bóng rổ A–Z", en: "Basketball dictionary A–Z" },
  "home.continue.title": { vi: "Tiếp tục học", en: "Continue learning" },
  "home.courtVision.title": { vi: "Tình huống sân đấu", en: "Court Vision" },
  "home.courtVision.subtitle": { vi: "Rèn luyện đọc trận đấu qua các tình huống thực tế", en: "Train your reads with real game scenarios" },

  /* Article */
  "article.whatIsIt": { vi: "Khái niệm", en: "What it is" },
  "article.whyItMatters": { vi: "Vì sao quan trọng", en: "Why it matters" },
  "article.howTo": { vi: "Cách thực hiện", en: "How to do it" },
  "article.coachingPoints": { vi: "Lưu ý huấn luyện", en: "Coaching points" },
  "article.commonMistakes": { vi: "Lỗi thường gặp", en: "Common mistakes" },
  "article.gameSituations": { vi: "Tình huống thi đấu", en: "Game situations" },
  "article.related": { vi: "Bài viết liên quan", en: "Related articles" },
  "article.relatedDrills": { vi: "Bài tập liên quan", en: "Related drills" },
  "article.minRead": { vi: "phút đọc", en: "min read" },
  "article.level.beginner": { vi: "Cơ bản", en: "Beginner" },
  "article.level.intermediate": { vi: "Trung cấp", en: "Intermediate" },
  "article.level.advanced": { vi: "Nâng cao", en: "Advanced" },
  "article.level.elite": { vi: "Chuyên sâu", en: "Elite" },
  "article.updated": { vi: "Cập nhật", en: "Updated" },
  "article.diagram": { vi: "Sơ đồ chiến thuật", en: "Tactical diagram" },
  "article.watchVideo": { vi: "Xem video", en: "Watch video" },
  "article.favorite.add": { vi: "Lưu vào yêu thích", en: "Add to favorites" },
  "article.favorite.remove": { vi: "Bỏ yêu thích", en: "Remove from favorites" },
  "article.ages": { vi: "Độ tuổi", en: "Ages" },
  "article.positions": { vi: "Vị trí", en: "Positions" },
  "article.positionsAll": { vi: "Mọi vị trí", en: "All positions" },
  "article.tags": { vi: "Thẻ", en: "Tags" },
  "article.continue": { vi: "Học tiếp", en: "Continue Learning" },
  "article.continueDesc": { vi: "Đừng dừng lại ở đây — tiếp tục đào sâu khái niệm này.", en: "No dead ends — keep building on this concept." },
  "article.references": { vi: "Tham khảo & học thêm", en: "References & Further Learning" },

  /* Hub */
  "hub.articles": { vi: "bài viết", en: "articles" },
  "hub.viewAll": { vi: "Xem tất cả", en: "View all" },
  "hub.backToHubs": { vi: "Tất cả trung tâm", en: "All hubs" },

  /* Drills */
  "drills.title": { vi: "Thư viện bài tập", en: "Drill Library" },
  "drills.subtitle": { vi: "60 bài tập có cấu trúc rõ ràng cho mọi kỹ năng", en: "18 structured drills for every skill" },
  "drills.filter.skill": { vi: "Kỹ năng", en: "Skill" },
  "drills.filter.level": { vi: "Trình độ", en: "Level" },
  "drills.filter.all": { vi: "Tất cả", en: "All" },
  "drills.goal": { vi: "Mục tiêu", en: "Goal" },
  "drills.setup": { vi: "Chuẩn bị", en: "Setup" },
  "drills.instructions": { vi: "Hướng dẫn", en: "Instructions" },
  "drills.coachingPoints": { vi: "Lưu ý huấn luyện", en: "Coaching points" },
  "drills.commonMistakes": { vi: "Lỗi thường gặp", en: "Common mistakes" },
  "drills.progression": { vi: "Nâng độ khó", en: "Make it harder" },
  "drills.regression": { vi: "Giảm độ khó", en: "Make it easier" },
  "drills.gameApplication": { vi: "Ứng dụng thi đấu", en: "Game application" },
  "drills.players": { vi: "Số người", en: "Players" },
  "drills.equipment": { vi: "Dụng cụ", en: "Equipment" },
  "drills.duration": { vi: "Thời gian", en: "Duration" },
  "drills.minutes": { vi: "phút", en: "min" },
  "drills.intensity": { vi: "Cường độ", en: "Intensity" },
  "drills.intensity.low": { vi: "Nhẹ", en: "Low" },
  "drills.intensity.medium": { vi: "Vừa", en: "Medium" },
  "drills.intensity.high": { vi: "Cao", en: "High" },
  "drills.related": { vi: "Bài tập liên quan", en: "Related Drills" },
  "drills.backToLibrary": { vi: "Về thư viện bài tập", en: "Back to Drill Library" },
  "drills.eyebrow": { vi: "Tập luyện", en: "Train" },
  "drills.searchPlaceholder": { vi: "Tìm bài tập…", en: "Search drills…" },
  "drills.anyDuration": { vi: "Mọi thời lượng", en: "Any" },
  "drills.countLabel": { vi: "bài tập", en: "drills" },
  "drills.noMatch": { vi: "Không có bài tập nào khớp bộ lọc. Hãy nới rộng lựa chọn.", en: "No drills match these filters. Try widening your selection." },

  /* Workouts */
  "workouts.title": { vi: "Giáo án tập luyện", en: "Workouts" },
  "workouts.subtitle": { vi: "Các buổi tập hoàn chỉnh, sẵn sàng ra sân", en: "Complete ready-to-run training sessions" },
  "workouts.items": { vi: "Nội dung buổi tập", en: "Workout items" },
  "workouts.tips": { vi: "Mẹo tập luyện", en: "Training tips" },
  "workouts.markDone": { vi: "Đánh dấu hoàn thành", en: "Mark done" },
  "workouts.completed": { vi: "Đã hoàn thành", en: "Completed" },
  "workouts.progress": { vi: "Tiến độ", en: "Progress" },
  "workouts.reset": { vi: "Làm lại", en: "Reset" },
  "workouts.focus": { vi: "Trọng tâm", en: "Focus" },
  "workouts.pageTitle": { vi: "Giáo án bóng rổ", en: "Basketball Workouts" },
  "workouts.pageDesc": { vi: "Giáo án theo buổi kèm checklist tương tác. Tiến độ lưu trên thiết bị của bạn — không cần tài khoản.", en: "Follow-along workouts with interactive checklists. Your progress saves on this device — no account needed." },
  "workouts.completeTitle": { vi: "Hoàn thành buổi tập! 🏀", en: "Workout complete. 🏀" },
  "workouts.completeDesc": { vi: "Đều đặn quan trọng hơn tập nặng. Hẹn gặp lại ngày mai.", en: "Consistency beats intensity. Come back tomorrow." },
  "workouts.backTo": { vi: "Về trang giáo án", en: "Back to Workouts" },

  /* Paths */
  "paths.title": { vi: "Lộ trình học", en: "Learning Paths" },
  "paths.subtitle": { vi: "Học theo từng bước, từ cơ bản đến thành thạo", en: "Step-by-step from basics to mastery" },
  "paths.steps": { vi: "bước", en: "steps" },
  "paths.start": { vi: "Bắt đầu", en: "Start" },
  "paths.continue": { vi: "Tiếp tục", en: "Continue" },
  "paths.step": { vi: "Bước", en: "Step" },
  "paths.articlesInStep": { vi: "bài viết trong bước này", en: "articles in this step" },
  "paths.audience": { vi: "Dành cho", en: "For" },
  "paths.yourProgress": { vi: "Tiến độ của bạn", en: "Your progress" },
  "paths.markComplete": { vi: "Đánh dấu đã học", en: "Mark as learned" },
  "paths.completeTitle": { vi: "Hoàn thành lộ trình — đã chinh phục {t}! 🏆", en: "Path complete — {t} mastered. 🏆" },
  "paths.completeDesc": { vi: "Chọn lộ trình tiếp theo và tiếp tục vươn lên.", en: "Pick your next path and keep climbing." },
  "paths.browsePaths": { vi: "Xem các lộ trình", en: "Browse Learning Paths" },
  "paths.backTo": { vi: "Về trang lộ trình", en: "Back to Learning Paths" },
  "paths.pageDesc": { vi: "Điểm khác biệt với thư viện: lộ trình dẫn dắt từ cấp độ 1 đến thành thạo. Đánh dấu từng khái niệm khi học — tiến độ lưu trên thiết bị của bạn.", en: "What makes this hub different from a library: guided progressions from level 1 to mastery. Check off concepts as you learn them — progress saves on your device." },

  /* Glossary */
  "glossary.title": { vi: "Từ điển bóng rổ A–Z", en: "Basketball Dictionary A–Z" },
  "glossary.subtitle": { vi: "Tra cứu mọi thuật ngữ bóng rổ", en: "Look up every basketball term" },
  "glossary.searchPlaceholder": { vi: "Tìm thuật ngữ…", en: "Search terms…" },
  "glossary.related": { vi: "Xem thêm", en: "See also" },
  "glossary.terms": { vi: "thuật ngữ", en: "terms" },
  "glossary.noMatch": { vi: "Không có thuật ngữ nào khớp. Thử tìm kiếm khác.", en: "No terms match. Try another search." },
  "glossary.filterLetter": { vi: "Lọc theo chữ cái", en: "Filter by letter" },

  /* Film Room */
  "film.title": { vi: "Phòng phim", en: "Film Room" },
  "film.subtitle": { vi: "Phân tích video: đọc trận đấu như một HLV", en: "Video breakdowns: read the game like a coach" },
  "film.watch": { vi: "Xem phân tích", en: "Watch breakdown" },
  "film.source": { vi: "Nguồn", en: "Source" },
  "film.level": { vi: "Trình độ", en: "Level" },
  "film.clickToLoad": { vi: "Nhấn để tải video", en: "Click to load video" },
  "film.pageDesc": { vi: "Video phân tích tuyển chọn từ các HLV và chuyên gia uy tín. Nhấn vào thumbnail để tải video — không tự phát, không lưu trữ tại đây.", en: "Hand-picked public breakdowns from respected coaches and analysts. Click any thumbnail to load the video — nothing autoplays, nothing is hosted here." },
  "notFound.title": { vi: "Ra ngoài biên.", en: "Out of bounds." },
  "notFound.desc": { vi: "Trang này không tồn tại — nhưng có hàng trăm khái niệm bóng rổ đang chờ bạn.", en: "This page doesn't exist — but there are hundreds of basketball concepts that do." },
  "film.disclaimer": { vi: "Video được nhúng từ các nguồn YouTube công khai và chỉ tải khi bạn nhấn phát. DND Basketball không lưu trữ video — tên kênh tác giả được ghi rõ trên mỗi video.", en: "Videos are embedded from public YouTube sources and load only when you press play. DND Basketball does not host any video — creators are credited by channel name above each breakdown." },

  /* Court Vision */
  "courtVision.question": { vi: "Bạn sẽ làm gì trong tình huống này?", en: "What would you do here?" },
  "courtVision.check": { vi: "Kiểm tra đáp án", en: "Check answer" },
  "courtVision.correct": { vi: "Chính xác!", en: "Correct!" },
  "courtVision.incorrect": { vi: "Chưa đúng. Xem giải thích:", en: "Not quite. Explanation:" },
  "courtVision.explanation": { vi: "Giải thích", en: "Explanation" },
  "courtVision.relatedArticle": { vi: "Học sâu hơn", en: "Learn more" },
  "courtVision.next": { vi: "Tình huống tiếp theo", en: "Next scenario" },

  /* Library */
  "library.title": { vi: "Thư viện của bạn", en: "Your Library" },
  "library.subtitle": { vi: "Mục yêu thích và lịch sử xem — lưu trên thiết bị này", en: "Favorites and history — saved on this device" },
  "library.favorites": { vi: "Yêu thích", en: "Favorites" },
  "library.recent": { vi: "Đã xem gần đây", en: "Recently viewed" },
  "library.empty.favorites": { vi: "Chưa có mục yêu thích. Nhấn biểu tượng tim trên bất kỳ bài viết nào để lưu lại.", en: "No favorites yet. Tap the heart icon on any article to save it here." },
  "library.empty.recent": { vi: "Chưa có lịch sử xem.", en: "No viewing history yet." },
  "library.clear": { vi: "Xóa lịch sử", en: "Clear history" },
  "library.save": { vi: "Lưu", en: "Save" },
  "library.saved": { vi: "Đã lưu", en: "Saved" },

  /* Footer */
  "footer.tagline": { vi: "Học. Tập. Hiểu trận đấu.", en: "Learn. Train. Understand the Game." },
  "footer.learn": { vi: "Học", en: "Learn" },
  "footer.coaching": { vi: "Huấn luyện", en: "Coaching" },
  "footer.resources": { vi: "Tài nguyên", en: "Resources" },
  "footer.about": { vi: "DND Basketball là trung tâm kiến thức bóng rổ: kỹ năng, chiến thuật, bài tập và IQ bóng rổ cho mọi trình độ.", en: "DND Basketball is a basketball knowledge hub: skills, tactics, drills and basketball IQ for every level." },
  "footer.train": { vi: "Tập luyện", en: "Train" },
  "footer.diagrams": { vi: "Mọi sơ đồ và hình minh họa đều là bản gốc, vẽ để phục vụ học tập.", en: "All diagrams and illustrations are original, drawn for learning." },
  "footer.rights": { vi: "Đã đăng ký bản quyền.", en: "All rights reserved." },

  /* Mobile nav */
  "mobile.home": { vi: "Trang chủ", en: "Home" },
  "mobile.search": { vi: "Tìm kiếm", en: "Search" },
  "mobile.learn": { vi: "Học", en: "Learn" },
  "mobile.drills": { vi: "Bài tập", en: "Drills" },
  "mobile.saved": { vi: "Đã lưu", en: "Saved" },
  "mobile.library": { vi: "Thư viện", en: "Library" },

  /* Theme / language */
  "theme.toggle": { vi: "Chế độ tối", en: "Dark mode" },
  "theme.light": { vi: "Chuyển sang chế độ sáng", en: "Switch to light mode" },
  "theme.dark": { vi: "Chuyển sang chế độ tối", en: "Switch to dark mode" },
  "lang.label": { vi: "Ngôn ngữ", en: "Language" },
  "lang.vietnamese": { vi: "Tiếng Việt", en: "Vietnamese" },
  "lang.english": { vi: "Tiếng Anh", en: "English" },

  /* Phase 2 — Player Performance */
  "nav.performance": { vi: "Thể lực", en: "Performance" },
  "nav.athletic": { vi: "Thể lực", en: "Athletic" },
  "nav.recovery": { vi: "Phục hồi", en: "Recovery" },
  "nav.nutrition": { vi: "Dinh dưỡng", en: "Nutrition" },
  "nav.hydration": { vi: "Bù nước", en: "Hydration" },
  "nav.injuryPrevention": { vi: "Phòng chấn thương", en: "Injury Prevention" },
  "nav.sub.strength": { vi: "Sức mạnh", en: "Strength" },
  "nav.sub.power": { vi: "Bùng nổ", en: "Power" },
  "nav.sub.speed": { vi: "Tốc độ", en: "Speed" },
  "nav.sub.deceleration": { vi: "Giảm tốc & tiếp đất", en: "Deceleration" },
  "nav.sub.verticalJump": { vi: "Bật cao", en: "Vertical Jump" },
  "nav.sub.programs": { vi: "Giáo án tập", en: "Programs" },
  "nav.sub.postPractice": { vi: "Sau buổi tập", en: "Post-Practice" },
  "nav.sub.postGame": { vi: "Sau trận đấu", en: "Post-Game" },
  "nav.sub.tournament": { vi: "Giải đấu", en: "Tournaments" },
  "nav.sub.methods": { vi: "Phương pháp", en: "Methods" },
  "nav.sub.myths": { vi: "Đúng hay sai?", en: "Myth or Fact?" },
  "nav.sub.preTraining": { vi: "Trước buổi tập", en: "Pre-Training" },
  "nav.sub.postTraining": { vi: "Sau buổi tập", en: "Post-Training" },
  "nav.sub.gameDay": { vi: "Ngày thi đấu", en: "Game Day" },
  "nav.sub.vnMeals": { vi: "Món Việt", en: "Vietnamese Meals" },
  "nav.sub.foodLibrary": { vi: "Thư viện thực phẩm", en: "Food Library" },
  "nav.sub.supplements": { vi: "Supplements", en: "Supplements" },
  "nav.sub.basics": { vi: "Nền tảng", en: "Basics" },
  "nav.sub.practice": { vi: "Trong buổi tập", en: "During Practice" },
  "nav.sub.hotWeather": { vi: "Trời nóng", en: "Hot Weather" },
  "nav.sub.electrolytes": { vi: "Điện giải", en: "Electrolytes" },
  "nav.sub.bodyMap": { vi: "Bản đồ cơ thể", en: "Body Map" },
  "nav.sub.warmUp": { vi: "Khởi động", en: "Warm-Up" },
  "nav.sub.landing": { vi: "Tiếp đất & giảm tốc", en: "Landing" },
  "nav.sub.ankle": { vi: "Cổ chân", en: "Ankle" },
  "nav.sub.knee": { vi: "Đầu gối", en: "Knee" },
  "nav.sub.trainingLoad": { vi: "Tải tập luyện", en: "Training Load" },
  "perf.landing.title": { vi: "Xây dựng vận động viên toàn diện", en: "Build the Complete Athlete" },
  "perf.landing.subtitle": { vi: "Tập nặng hơn. Hồi phục thông minh hơn. Nạp năng lượng tốt hơn. Bám trụ trên sân.", en: "Train harder. Recover smarter. Fuel better. Stay on the court." },
  "perf.explore": { vi: "Khám phá", en: "Explore" },
  "perf.guides": { vi: "bài hướng dẫn", en: "guides" },
  "perf.hub.athleticPerformance": { vi: "Thể lực bóng rổ", en: "Athletic Performance" },
  "perf.hub.recovery": { vi: "Hồi phục", en: "Recovery" },
  "perf.hub.nutrition": { vi: "Dinh dưỡng", en: "Nutrition" },
  "perf.hub.hydration": { vi: "Bù nước", en: "Hydration" },
  "perf.hub.injuryPrevention": { vi: "Phòng ngừa chấn thương", en: "Injury Prevention" },
  "perf.tagline.athleticPerformance": { vi: "Xây dựng thể chất chuyển hóa trực tiếp lên sân đấu.", en: "Build the physical qualities that translate to basketball." },
  "perf.tagline.recovery": { vi: "Hồi phục hôm nay để ngày mai thi đấu tốt hơn.", en: "Recover today so you can perform tomorrow." },
  "perf.tagline.nutrition": { vi: "Nạp năng lượng đúng cách. Hồi phục nhanh hơn. Thi đấu ổn định.", en: "Fuel training. Recover faster. Perform consistently." },
  "perf.tagline.hydration": { vi: "Đủ nước. Tỉnh táo. Bám trụ đến cuối trận.", en: "Stay hydrated. Stay sharp. Stay in the game." },
  "perf.tagline.injuryPrevention": { vi: "Di chuyển tốt hơn. Tăng sức chịu tải. Giảm nguy cơ chấn thương có thể phòng tránh.", en: "Move better. Build capacity. Reduce preventable injury risk." },

  /* Performance article sections */
  "perf.whatItDevelops": { vi: "Phát triển", en: "What It Develops" },
  "perf.whyBasketball": { vi: "Vì sao cầu thủ bóng rổ cần", en: "Why Basketball Players Need It" },
  "perf.howTo": { vi: "Cách thực hiện", en: "How To Perform" },
  "perf.setsReps": { vi: "Số hiệp & số lần", en: "Sets & Reps" },
  "perf.basketballTransfer": { vi: "Chuyển sang thi đấu", en: "Basketball Transfer" },
  "perf.progression": { vi: "Lộ trình nâng cao", en: "Progression" },
  "perf.relatedTopics": { vi: "Chủ đề liên quan", en: "Related Topics" },
  "perf.equipment": { vi: "Dụng cụ", en: "Equipment" },
  "perf.duration": { vi: "Thời lượng", en: "Duration" },
  "perf.trainingPhase": { vi: "Giai đoạn tập", en: "Training Phase" },

  /* Goal selector */
  "perf.goalSelector.title": { vi: "Bạn muốn cải thiện điều gì?", en: "What Do You Want to Improve?" },
  "perf.goal.jumpHigher": { vi: "Nhảy cao hơn", en: "Jump Higher" },
  "perf.goal.getFaster": { vi: "Nhanh hơn", en: "Get Faster" },
  "perf.goal.getStronger": { vi: "Khỏe hơn", en: "Get Stronger" },
  "perf.goal.moveBetter": { vi: "Di chuyển tốt hơn", en: "Move Better" },
  "perf.goal.conditioning": { vi: "Thể lực bền hơn", en: "Improve Conditioning" },
  "perf.goal.explosive": { vi: "Bùng nổ hơn", en: "Become More Explosive" },

  /* I Just Finished a Game */
  "perf.finishedGame.title": { vi: "Tôi vừa thi đấu xong", en: "I Just Finished a Game" },
  "perf.finishedGame.desc": { vi: "Mở ngay sau trận đấu — biết chính xác nên làm gì tiếp theo.", en: "Open right after the game — know exactly what to do next." },
  "perf.finishedGame.m1.title": { vi: "0–15 phút", en: "0–15 MIN" },
  "perf.finishedGame.m1.body": { vi: "Hạ nhiệt. Đi bộ thả lỏng. Hít thở sâu. Bắt đầu bù nước.", en: "Cooldown. Walk. Breathing. Begin hydration." },
  "perf.finishedGame.m2.title": { vi: "15–60 phút", en: "15–60 MIN" },
  "perf.finishedGame.m2.body": { vi: "Uống nước. Ăn nhẹ phục hồi. Thay đồ ướt.", en: "Fluids. Recovery food. Change wet clothing." },
  "perf.finishedGame.m3.title": { vi: "1–3 giờ", en: "1–3 HOURS" },
  "perf.finishedGame.m3.body": { vi: "Ăn bữa chính. Vận động giãn cơ nhẹ. Nghỉ ngơi.", en: "Complete meal. Light mobility. Rest." },
  "perf.finishedGame.m4.title": { vi: "Buổi tối", en: "EVENING" },
  "perf.finishedGame.m4.body": { vi: "Thư giãn. Tiếp tục bù nước. Chuẩn bị cho giấc ngủ.", en: "Relaxation. Hydration. Prepare for sleep." },
  "perf.finishedGame.m5.title": { vi: "Sáng hôm sau", en: "NEXT MORNING" },
  "perf.finishedGame.m5.body": { vi: "Đánh giá mức đau mỏi. Vận động nhẹ. Lên kế hoạch khối lượng tập.", en: "Assess soreness. Mobility. Light movement. Plan training load." },

  /* Recovery Check */
  "perf.recoveryCheck.title": { vi: "Kiểm tra hồi phục", en: "Recovery Check" },
  "perf.recoveryCheck.desc": { vi: "Trả lời nhanh 5 câu hỏi để biết hôm nay nên tập thế nào.", en: "Answer 5 quick questions to see how you should train today." },
  "perf.recoveryCheck.sleep": { vi: "Giấc ngủ đêm qua", en: "Sleep last night" },
  "perf.recoveryCheck.soreness": { vi: "Đau mỏi cơ", en: "Muscle soreness" },
  "perf.recoveryCheck.energy": { vi: "Năng lượng", en: "Energy" },
  "perf.recoveryCheck.stress": { vi: "Căng thẳng", en: "Stress" },
  "perf.recoveryCheck.load": { vi: "Khối lượng tập gần đây", en: "Training load" },
  "perf.recoveryCheck.good": { vi: "Tốt", en: "GOOD" },
  "perf.recoveryCheck.moderate": { vi: "Trung bình", en: "MODERATE" },
  "perf.recoveryCheck.low": { vi: "Thấp", en: "LOW" },
  "perf.recoveryCheck.recGood": { vi: "Sẵn sàng tập bình thường.", en: "Ready for normal training." },
  "perf.recoveryCheck.recModerate": { vi: "Tập nhẹ, ưu tiên hồi phục.", en: "Light recovery work, normal training is fine." },
  "perf.recoveryCheck.recLow": { vi: "Nên giảm khối lượng tập và nghỉ ngơi thêm.", en: "Consider reducing workload and resting more." },

  /* Hydration Check */
  "perf.hydrationCheck.title": { vi: "Tôi đã đủ nước chưa?", en: "Am I Hydrated?" },
  "perf.hydrationCheck.desc": { vi: "Tự kiểm tra nhanh dựa trên các dấu hiệu cơ bản.", en: "A quick self-check based on basic signals." },
  "perf.hydrationCheck.hydrated": { vi: "Có vẻ bạn đã đủ nước", en: "Likely Hydrated" },
  "perf.hydrationCheck.attention": { vi: "Cần chú ý hơn", en: "Pay Attention" },
  "perf.hydrationCheck.risk": { vi: "Có nguy cơ thiếu nước", en: "Possible Dehydration Risk" },
  "perf.hydrationCheck.disclaimer": { vi: "Chỉ là tự kiểm tra tham khảo, không phải đánh giá y tế.", en: "Educational self-check only, not a medical assessment." },

  /* Sweat Rate Estimator */
  "perf.sweatRate.title": { vi: "Ước tính lượng mồ hôi", en: "Sweat Rate Estimator" },
  "perf.sweatRate.weightBefore": { vi: "Cân nặng trước tập (kg)", en: "Body weight before training (kg)" },
  "perf.sweatRate.weightAfter": { vi: "Cân nặng sau tập (kg)", en: "Body weight after training (kg)" },
  "perf.sweatRate.fluid": { vi: "Nước đã uống trong buổi tập (lít)", en: "Fluid consumed during training (L)" },
  "perf.sweatRate.duration": { vi: "Thời gian tập (phút)", en: "Training duration (min)" },
  "perf.sweatRate.result": { vi: "Ước tính lượng mồ hôi mất đi", en: "Estimated sweat loss" },
  "perf.sweatRate.note": { vi: "Chỉ là con số ước tính để tham khảo.", en: "Estimate only, for educational reference." },

  /* Body Map */
  "perf.bodyMap.title": { vi: "Bạn muốn bảo vệ vị trí nào?", en: "Where do you want to protect?" },
  "perf.bodyMap.desc": { vi: "Chạm vào từng vị trí để xem cách giảm nguy cơ chấn thương.", en: "Tap each area to learn how to reduce injury risk." },
  "perf.bodyMap.foot": { vi: "Bàn chân", en: "Foot" },
  "perf.bodyMap.ankle": { vi: "Cổ chân", en: "Ankle" },
  "perf.bodyMap.achilles": { vi: "Gân Achilles", en: "Achilles" },
  "perf.bodyMap.calf": { vi: "Bắp chân", en: "Calf" },
  "perf.bodyMap.knee": { vi: "Đầu gối", en: "Knee" },
  "perf.bodyMap.hamstring": { vi: "Cơ đùi sau", en: "Hamstring" },
  "perf.bodyMap.groin": { vi: "Háng", en: "Groin" },
  "perf.bodyMap.hip": { vi: "Hông", en: "Hip" },
  "perf.bodyMap.lowerBack": { vi: "Thắt lưng", en: "Lower Back" },
  "perf.bodyMap.shoulder": { vi: "Vai", en: "Shoulder" },
  "perf.bodyMap.fingerWrist": { vi: "Ngón tay & cổ tay", en: "Finger & Wrist" },

  /* Medical disclaimer */
  "perf.medicalDisclaimer": {
    vi: "DND Basketball chỉ cung cấp kiến thức thể thao tổng quát, không chẩn đoán bệnh hay đưa ra phác đồ điều trị cá nhân. Nếu bạn bị đau, chấn thương, có bệnh lý hoặc triệu chứng đáng lo, hãy gặp chuyên gia y tế có chuyên môn.",
    en: "DND Basketball provides general sports education only. It does not provide medical diagnosis or individualized treatment. Players with pain, injury, medical conditions or concerning symptoms should consult a qualified healthcare professional.",
  },

  /* Cross-hub + homepage */
  "perf.continueDevelopment": { vi: "Tiếp tục phát triển", en: "Continue Your Development" },
  "perf.related.skill": { vi: "Kỹ năng liên quan", en: "Related Skill" },
  "perf.related.exercise": { vi: "Bài tập liên quan", en: "Related Exercise" },
  "perf.related.recovery": { vi: "Hướng dẫn hồi phục", en: "Related Recovery Guide" },
  "perf.related.nutrition": { vi: "Hướng dẫn dinh dưỡng", en: "Related Nutrition Guide" },
  "perf.related.injury": { vi: "Phòng ngừa chấn thương", en: "Related Injury Prevention Guide" },
  "perf.buildComplete": { vi: "Xây dựng cầu thủ toàn diện", en: "Build the Complete Player" },
  "perf.buildCompleteDesc": { vi: "Kỹ thuật và chiến thuật là chưa đủ — thể lực, hồi phục, dinh dưỡng và phòng ngừa chấn thương mới tạo nên cầu thủ hoàn chỉnh.", en: "Skills and tactics aren't enough — athleticism, recovery, nutrition and injury prevention complete the player." },
  "perf.explorePerformance": { vi: "Khám phá Performance →", en: "Explore Performance →" },
  "perf.todayTitle": { vi: "Phát triển hôm nay", en: "Today's Player Development" },
  "perf.tip.performance": { vi: "Mẹo thể lực", en: "Performance Tip" },
  "perf.tip.recovery": { vi: "Mẹo hồi phục", en: "Recovery Tip" },
  "perf.tip.nutrition": { vi: "Mẹo dinh dưỡng", en: "Nutrition Tip" },
  "perf.tip.hydration": { vi: "Mẹo bù nước", en: "Hydration Tip" },
  "perf.card.athletic.t": { vi: "Sức mạnh & tốc độ", en: "Strength & Athleticism" },
  "perf.card.recovery.t": { vi: "Hồi phục", en: "Recovery" },
  "perf.card.nutrition.t": { vi: "Dinh dưỡng", en: "Nutrition" },
  "perf.card.hydration.t": { vi: "Bù nước", en: "Hydration" },
  "perf.card.injury.t": { vi: "Giữ sức khỏe", en: "Stay Healthy" },

  /* Filters */
  "perf.filter.level": { vi: "Trình độ", en: "Level" },
  "perf.filter.position": { vi: "Vị trí", en: "Position" },
  "perf.filter.phase": { vi: "Giai đoạn tập", en: "Training Phase" },
  "perf.filter.goal": { vi: "Mục tiêu", en: "Goal" },
  "perf.level.beginner": { vi: "Cơ bản", en: "Beginner" },
  "perf.level.intermediate": { vi: "Trung cấp", en: "Intermediate" },
  "perf.level.advanced": { vi: "Nâng cao", en: "Advanced" },
  "perf.position.guard": { vi: "Hậu vệ", en: "Guard" },
  "perf.position.wing": { vi: "Cánh", en: "Wing" },
  "perf.position.big": { vi: "Big", en: "Big" },
  "perf.position.all": { vi: "Mọi vị trí", en: "All Players" },
  "perf.phase.offSeason": { vi: "Nghỉ mùa", en: "Off-Season" },
  "perf.phase.preSeason": { vi: "Tiền mùa", en: "Pre-Season" },
  "perf.phase.inSeason": { vi: "Trong mùa", en: "In-Season" },
  "perf.phase.gameDay": { vi: "Ngày thi đấu", en: "Game Day" },
  "perf.phase.recoveryDay": { vi: "Ngày hồi phục", en: "Recovery Day" },

  /* Common */
  "cards.learnConcept": { vi: "Học khái niệm", en: "Learn concept" },
  "cards.levels": { vi: "cấp độ", en: "levels" },
  "cards.concepts": { vi: "khái niệm", en: "concepts" },
  "cards.exercises": { vi: "bài tập · kèm checklist", en: "exercises · checklist included" },
  "common.back": { vi: "Quay lại", en: "Back" },  "common.close": { vi: "Đóng", en: "Close" },
  "common.all": { vi: "Tất cả", en: "All" },
  "common.loading": { vi: "Đang tải…", en: "Loading…" },
  "common.notFound": { vi: "Không tìm thấy trang", en: "Page not found" },
  "common.notFoundDesc": { vi: "Trang bạn tìm không tồn tại hoặc đã được di chuyển.", en: "The page you're looking for doesn't exist or was moved." },
  "common.goHome": { vi: "Về trang chủ", en: "Go home" },
  "common.learnMore": { vi: "Tìm hiểu thêm", en: "Learn more" },
  "common.minutes": { vi: "phút", en: "min" },
};

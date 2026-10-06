#!/usr/bin/env node
/** Builds public/search-index.json from content (bilingual: EN + VI). */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const CONTENT = process.env.DND_CONTENT ?? "/home/hatch/workspace/dnd-content";
const OUT = process.env.DND_PUBLIC ?? "/home/hatch/workspace/dnd-basketball/public";
const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const articleUrl = (a) => a.hub === "skills" ? `/skills/${a.subcategory}/${a.slug}` : `/${a.hub}/${a.slug}`;

const idx = [];
for (const f of readdirSync(join(CONTENT, "articles")).filter((f) => f.endsWith(".json"))) {
  const a = read(join(CONTENT, "articles", f));
  idx.push({ type: "article", id: a.slug, title: a.title, description: a.description, hub: a.hub,
    subcategory: a.subcategory, level: a.level, ages: a.ages, positions: a.positions,
    tags: a.tags, url: articleUrl(a),
    titleVi: a.vi?.title, descriptionVi: a.vi?.description, tagsVi: a.vi?.tags });
}
for (const f of readdirSync(join(CONTENT, "drills")).filter((f) => f.endsWith(".json"))) {
  const d = read(join(CONTENT, "drills", f));
  idx.push({ type: "drill", id: d.slug, title: d.title, description: d.description, hub: "drills",
    subcategory: d.skill, level: d.level, ages: d.ages, positions: d.positions,
    tags: [d.skill.toLowerCase(), "drill"], url: `/drills/${d.slug}`,
    titleVi: d.vi?.title, descriptionVi: d.vi?.description, tagsVi: ["bài tập", d.skill.toLowerCase()] });
}
for (const f of readdirSync(join(CONTENT, "workouts")).filter((f) => f.endsWith(".json"))) {
  const w = read(join(CONTENT, "workouts", f));
  idx.push({ type: "workout", id: w.slug, title: w.title, description: w.description, hub: "workouts",
    subcategory: "workouts", level: w.level, ages: [], positions: [],
    tags: [...w.focus.map((x) => x.toLowerCase()), "workout"], url: `/workouts/${w.slug}`,
    titleVi: w.vi?.title, descriptionVi: w.vi?.description,
    tagsVi: [...(w.vi?.focus ?? []).map((x) => x.toLowerCase()), "giáo án"] });
}
for (const f of readdirSync(join(CONTENT, "paths")).filter((f) => f.endsWith(".json"))) {
  const p = read(join(CONTENT, "paths", f));
  idx.push({ type: "path", id: p.slug, title: p.title, description: p.description, hub: "learning-paths",
    subcategory: "paths", level: p.level, ages: [], positions: [],
    tags: ["learning path", "development"], url: `/learning-paths/${p.slug}`,
    titleVi: p.vi?.title, descriptionVi: p.vi?.description, tagsVi: ["lộ trình học", "phát triển"] });
}
if (existsSync(join(CONTENT, "glossary.json"))) {
  for (const t of read(join(CONTENT, "glossary.json"))) {
    idx.push({ type: "glossary", id: t.slug, title: t.term, description: t.definition, hub: "glossary",
      subcategory: "glossary", level: "beginner", ages: [], positions: [],
      tags: ["term", "definition"], url: `/glossary#term-${t.slug}`,
      titleVi: t.term, descriptionVi: t.vi?.definition, tagsVi: ["thuật ngữ", "định nghĩa"] });
  }
}

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "search-index.json"), JSON.stringify(idx));
console.log(`search index: ${idx.length} entries -> ${OUT}/search-index.json`);

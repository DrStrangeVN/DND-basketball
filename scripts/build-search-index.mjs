#!/usr/bin/env node
/** Builds public/search-index.json from content (bilingual: EN + VI). */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const CONTENT = process.env.DND_CONTENT ?? "/home/hatch/workspace/dnd-content";
const OUT = process.env.DND_PUBLIC ?? "/home/hatch/workspace/dnd-basketball/public";
const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const articleUrl = (a) => a.hub === "skills" ? `/skills/${a.subcategory}/${a.slug}` : `/${a.hub}/${a.slug}`;
// Keep the index small enough to upload (MCP CLI arg limit): truncate long descriptions.
const snip = (s, n = 120) => (s && s.length > n ? s.slice(0, n).trimEnd() + "…" : s ?? "");

const idx = [];
for (const f of readdirSync(join(CONTENT, "articles")).filter((f) => f.endsWith(".json"))) {
  const a = read(join(CONTENT, "articles", f));
  idx.push({ type: "article", id: a.slug, title: a.title, description: snip(a.description), hub: a.hub,
    subcategory: a.subcategory, level: a.level, ages: a.ages, positions: a.positions,
    tags: a.tags, url: articleUrl(a),
    titleVi: a.vi?.title, descriptionVi: snip(a.vi?.description), tagsVi: a.vi?.tags });
}
for (const f of readdirSync(join(CONTENT, "drills")).filter((f) => f.endsWith(".json"))) {
  const d = read(join(CONTENT, "drills", f));
  idx.push({ type: "drill", id: d.slug, title: d.title, description: snip(d.description), hub: "drills",
    subcategory: d.skill, level: d.level, ages: d.ages, positions: d.positions,
    tags: [d.skill.toLowerCase(), "drill"], url: `/drills/${d.slug}`,
    titleVi: d.vi?.title, descriptionVi: snip(d.vi?.description), tagsVi: ["bài tập", d.skill.toLowerCase()] });
}
for (const f of readdirSync(join(CONTENT, "workouts")).filter((f) => f.endsWith(".json"))) {
  const w = read(join(CONTENT, "workouts", f));
  idx.push({ type: "workout", id: w.slug, title: w.title, description: snip(w.description), hub: "workouts",
    subcategory: "workouts", level: w.level, ages: [], positions: [],
    tags: [...w.focus.map((x) => x.toLowerCase()), "workout"], url: `/workouts/${w.slug}`,
    titleVi: w.vi?.title, descriptionVi: snip(w.vi?.description),
    tagsVi: [...(w.vi?.focus ?? []).map((x) => x.toLowerCase()), "giáo án"] });
}
for (const f of readdirSync(join(CONTENT, "paths")).filter((f) => f.endsWith(".json"))) {
  const p = read(join(CONTENT, "paths", f));
  idx.push({ type: "path", id: p.slug, title: p.title, description: snip(p.description), hub: "learning-paths",
    subcategory: "paths", level: p.level, ages: [], positions: [],
    tags: ["learning path", "development"], url: `/learning-paths/${p.slug}`,
    titleVi: p.vi?.title, descriptionVi: snip(p.vi?.description), tagsVi: ["lộ trình học", "phát triển"] });
}
if (existsSync(join(CONTENT, "glossary.json"))) {
  for (const t of read(join(CONTENT, "glossary.json"))) {
    idx.push({ type: "glossary", id: t.slug, title: t.term, description: snip(t.definition), hub: "glossary",
      subcategory: "glossary", level: "beginner", ages: [], positions: [],
      tags: ["term", "definition"], url: `/glossary#term-${t.slug}`,
      titleVi: t.term, descriptionVi: snip(t.vi?.definition), tagsVi: ["thuật ngữ", "định nghĩa"] });
  }
}
if (existsSync(join(CONTENT, "performance"))) {
  const performanceUrl = (p) => `/performance/${p.hub}/${p.slug}`;
  for (const f of readdirSync(join(CONTENT, "performance")).filter((f) => f.endsWith(".json"))) {
    const p = read(join(CONTENT, "performance", f));
    idx.push({ type: "performance", id: p.slug, title: p.title, description: snip(p.description), hub: p.hub,
      subcategory: p.category, level: p.level, ages: [], positions: p.positions,
      tags: [...(p.tags ?? []), ...(p.goal ?? [])], url: performanceUrl(p),
      titleVi: p.vi?.title, descriptionVi: snip(p.vi?.description), tagsVi: p.vi?.tags });
  }
}

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "search-index.json"), JSON.stringify(idx));
console.log(`search index: ${idx.length} entries -> ${OUT}/search-index.json`);

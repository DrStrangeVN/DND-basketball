#!/usr/bin/env node
/** Validates ~/workspace/dnd-content JSON files. Exit non-zero on failure. */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const CONTENT = process.env.DND_CONTENT ?? "/home/hatch/workspace/dnd-content";
const errors = [];
const err = (m) => errors.push(m);
const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const list = (dir) => existsSync(join(CONTENT, dir)) ? readdirSync(join(CONTENT, dir)).filter((f) => f.endsWith(".json")) : [];

const ARTICLE_REQ = ["id","slug","title","description","hub","subcategory","level","ages","positions","tags","readTime","whatIsIt","whyItMatters","howTo","coachingPoints","commonMistakes","gameSituations","related","dateUpdated"];
const HUBS = ["fundamentals","skills","defense","offense","pick-and-roll","tactics","transition","basketball-iq","positions","coaching"];
const LEVELS = ["beginner","intermediate","advanced","elite"];

const articles = list("articles").map((f) => ({ file: f, data: read(join(CONTENT, "articles", f)) }));
const articleSlugs = new Set();
for (const { file, data: a } of articles) {
  for (const k of ARTICLE_REQ) if (!(k in a)) err(`${file}: missing field "${k}"`);
  if (a.id !== a.slug) err(`${file}: id !== slug`);
  if (!/^[a-z0-9-]+$/.test(a.slug)) err(`${file}: bad slug "${a.slug}"`);
  if (file !== `${a.slug}.json`) err(`${file}: filename must equal <slug>.json`);
  if (!HUBS.includes(a.hub)) err(`${file}: unknown hub "${a.hub}"`);
  if (!LEVELS.includes(a.level)) err(`${file}: unknown level "${a.level}"`);
  if (!Array.isArray(a.howTo) || a.howTo.length < 3) err(`${file}: howTo needs >=3 steps`);
  if (!Array.isArray(a.coachingPoints) || a.coachingPoints.length < 3) err(`${file}: coachingPoints needs >=3`);
  if (articleSlugs.has(a.slug)) err(`duplicate article slug: ${a.slug}`);
  articleSlugs.add(a.slug);
  if (a.diagram) {
    const d = a.diagram;
    const labels = new Set([...(d.offense ?? []).map((m) => m.label), ...(d.defense ?? []).map((m) => m.label), "rim"]);
    for (const m of [...(d.moves ?? []), ...(d.passes ?? [])]) {
      if (!labels.has(m.from) || !labels.has(m.to)) err(`${file}: diagram references unknown marker ${m.from}->${m.to}`);
    }
    for (const mk of [...(d.offense ?? []), ...(d.defense ?? [])]) {
      if (mk.x < 0 || mk.x > 100 || mk.y < 0 || mk.y > 94) err(`${file}: diagram marker ${mk.label} out of bounds`);
    }
  }
}
for (const { file, data: a } of articles) {
  for (const r of a.related ?? []) if (!articleSlugs.has(r)) err(`${file}: related slug "${r}" does not exist`);
}

const drills = list("drills").map((f) => ({ file: f, data: read(join(CONTENT, "drills", f)) }));
const drillSlugs = new Set();
const DRILL_REQ = ["id","slug","title","description","skill","level","ages","positions","players","equipment","durationMin","intensity","goal","setup","instructions","coachingPoints","commonMistakes","progression","regression","gameApplication","related","dateUpdated"];
for (const { file, data: d } of drills) {
  for (const k of DRILL_REQ) if (!(k in d)) err(`drills/${file}: missing "${k}"`);
  if (d.id !== d.slug || file !== `${d.slug}.json`) err(`drills/${file}: id/slug/filename mismatch`);
  if (drillSlugs.has(d.slug)) err(`duplicate drill slug: ${d.slug}`);
  drillSlugs.add(d.slug);
  if (!LEVELS.includes(d.level)) err(`drills/${file}: bad level`);
}
for (const { file, data: d } of drills) for (const r of d.related ?? []) if (!drillSlugs.has(r)) err(`drills/${file}: related "${r}" missing`);

const workouts = list("workouts").map((f) => read(join(CONTENT, "workouts", f)));
const workoutSlugs = new Set();
for (const w of workouts) {
  for (const k of ["id","slug","title","description","level","durationMin","focus","equipment","items","tips"]) if (!(k in w)) err(`workouts/${w.slug}: missing "${k}"`);
  if (workoutSlugs.has(w.slug)) err(`duplicate workout slug: ${w.slug}`);
  workoutSlugs.add(w.slug);
  if (!Array.isArray(w.items) || w.items.length < 4) err(`workouts/${w.slug}: needs >=4 items`);
}

const paths = list("paths").map((f) => ({ file: f, data: read(join(CONTENT, "paths", f)) }));
for (const { file, data: p } of paths) {
  for (const k of ["id","slug","title","description","level","steps"]) if (!(k in p)) err(`paths/${file}: missing "${k}"`);
  if (!Array.isArray(p.steps) || p.steps.length < 3) err(`paths/${file}: needs >=3 steps`);
  p.steps.forEach((s, i) => {
    if (!s.title || !Array.isArray(s.articles) || s.articles.length === 0) err(`paths/${file}: step ${i} bad`);
    for (const a of s.articles ?? []) if (!articleSlugs.has(a)) err(`paths/${file}: step ${i} article "${a}" missing`);
  });
}

if (existsSync(join(CONTENT, "glossary.json"))) {
  const terms = read(join(CONTENT, "glossary.json"));
  const seen = new Set(terms.map((t) => t.slug));
  for (const t of terms) {
    for (const k of ["term","slug","definition","related"]) if (!(k in t)) err(`glossary: term missing "${k}"`);
    for (const r of t.related ?? []) if (!articleSlugs.has(r) && !seen.has(r)) err(`glossary/${t.slug}: related "${r}" missing`);
  }
  if (seen.size !== terms.length) err(`glossary: duplicate slugs`);
  console.log(`glossary terms: ${terms.length}`);
}
if (existsSync(join(CONTENT, "court-vision.json"))) {
  const cvs = read(join(CONTENT, "court-vision.json"));
  for (const c of cvs) {
    if (!articleSlugs.has(c.relatedArticle)) err(`court-vision/${c.id}: relatedArticle "${c.relatedArticle}" missing`);
    if (c.correctIndex < 0 || c.correctIndex > 2) err(`court-vision/${c.id}: bad correctIndex`);
  }
  console.log(`court vision cards: ${cvs.length}`);
}
if (existsSync(join(CONTENT, "film.json"))) {
  const films = read(join(CONTENT, "film.json"));
  for (const f of films) if (!/^[\w-]{11}$/.test(f.youtubeId)) err(`film/${f.id}: bad youtubeId`);
  console.log(`film videos: ${films.length}`);
}

console.log(`articles: ${articles.length}, drills: ${drills.length}, workouts: ${workouts.length}, paths: ${paths.length}`);
if (errors.length) { console.error(`\n${errors.length} ERRORS:`); errors.forEach((e) => console.error(" - " + e)); process.exit(1); }
console.log("CONTENT OK");

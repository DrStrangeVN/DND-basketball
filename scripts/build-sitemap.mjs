#!/usr/bin/env node
/** Builds public/sitemap.xml + public/robots.txt from content. */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const BASE = "https://dndbasketball.vercel.app";
const CONTENT = process.env.DND_CONTENT ?? "/home/hatch/workspace/dnd-content";
const OUT = process.env.DND_PUBLIC ?? "/home/hatch/workspace/dnd-basketball/public";
const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const ls = (d) => readdirSync(join(CONTENT, d)).filter((f) => f.endsWith(".json"));

const urls = new Set([
  "/", "/learn", "/search", "/library", "/glossary", "/film-room",
  "/skills", "/defense", "/offense", "/pick-and-roll", "/tactics", "/transition",
  "/basketball-iq", "/positions", "/coaching", "/fundamentals",
  "/drills", "/workouts", "/learning-paths",
]);

for (const f of ls("articles")) {
  const a = read(join(CONTENT, "articles", f));
  urls.add(a.hub === "skills" ? `/skills/${a.subcategory}/${a.slug}` : `/${a.hub}/${a.slug}`);
}
// hub group pages for skills
for (const f of ls("articles")) {
  const a = read(join(CONTENT, "articles", f));
  if (a.hub === "skills") urls.add(`/skills/${a.subcategory}`);
}
for (const f of ls("drills")) urls.add(`/drills/${read(join(CONTENT, "drills", f)).slug}`);
for (const f of ls("workouts")) urls.add(`/workouts/${read(join(CONTENT, "workouts", f)).slug}`);
for (const f of ls("paths")) urls.add(`/learning-paths/${read(join(CONTENT, "paths", f)).slug}`);

const today = new Date().toISOString().slice(0, 10);
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  [...urls].sort().map((u) =>
    `  <url><loc>${BASE}${u}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${u === "/" ? "1.0" : u.split("/").length <= 2 ? "0.8" : "0.6"}</priority></url>`
  ).join("\n") + `\n</urlset>\n`;

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "sitemap.xml"), xml);
writeFileSync(join(OUT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${BASE}/sitemap.xml\n`);
console.log(`sitemap: ${urls.size} urls`);

#!/usr/bin/env node
/**
 * Convert an Owner Learn CMS snapshot JSON (from GET /api/admin/learn/snapshot)
 * into an idempotent SQLite/D1 restore script (records + versions + audit).
 * Usage: node scripts/restore-learn-snapshot.mjs snapshot.json [out.sql]
 */
import { readFileSync, writeFileSync } from "node:fs";

const inPath = process.argv[2];
if (!inPath) {
  console.error("Usage: node scripts/restore-learn-snapshot.mjs <snapshot.json> [out.sql]");
  process.exit(1);
}
const outPath = process.argv[3] || "/tmp/dnd-learn-restore.sql";
const raw = JSON.parse(readFileSync(inPath, "utf8"));
const snap = raw.snapshot || raw;
const rows = Array.isArray(snap.rows) ? snap.rows : [];
const versions = Array.isArray(snap.versions) ? snap.versions : [];
const audit = Array.isArray(snap.audit) ? snap.audit : [];

const q = (v) => (v == null ? "NULL" : "'" + String(v).replaceAll("'", "''") + "'");
const lines = [
  "-- Danang Dragons Learn snapshot restore generated " + new Date().toISOString(),
  readFileSync(new URL("../worker/migrations/0001_content.sql", import.meta.url), "utf8"),
];

for (const r of rows) {
  lines.push(
    "INSERT INTO learn_records(kind,id,route,draft_json,published_json,revision,published_revision,is_baseline,archived,updated_at,updated_by) VALUES(" +
      [
        q(r.kind),
        q(r.id),
        q(r.route),
        q(r.draft_json),
        q(r.published_json),
        Number(r.revision || 1),
        Number(r.published_revision || 0),
        r.is_baseline ? 1 : 0,
        r.archived ? 1 : 0,
        q(r.updated_at || new Date().toISOString()),
        q(r.updated_by || "restore"),
      ].join(",") +
      ") ON CONFLICT(kind,id) DO UPDATE SET route=excluded.route,draft_json=excluded.draft_json,published_json=excluded.published_json,revision=excluded.revision,published_revision=excluded.published_revision,is_baseline=excluded.is_baseline,archived=excluded.archived,updated_at=excluded.updated_at,updated_by=excluded.updated_by;"
  );
}

for (const v of versions) {
  lines.push(
    "INSERT OR IGNORE INTO learn_versions(kind,id,revision,payload,action,actor,created_at) VALUES(" +
      [q(v.kind), q(v.id), Number(v.revision), q(v.payload), q(v.action), q(v.actor), q(v.created_at)].join(",") +
      ");"
  );
}

for (const a of audit) {
  lines.push(
    "INSERT OR IGNORE INTO learn_audit(id,actor,action,target,created_at) VALUES(" +
      [q(a.id), q(a.actor), q(a.action), q(a.target), q(a.created_at)].join(",") +
      ");"
  );
}

writeFileSync(outPath, lines.join("\n") + "\n");
console.log({ outPath, rows: rows.length, versions: versions.length, audit: audit.length });

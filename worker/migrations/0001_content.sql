CREATE TABLE IF NOT EXISTS learn_records(kind TEXT NOT NULL,id TEXT NOT NULL,route TEXT,draft_json TEXT NOT NULL,published_json TEXT,revision INTEGER NOT NULL DEFAULT 1,published_revision INTEGER NOT NULL DEFAULT 1,is_baseline INTEGER NOT NULL DEFAULT 0,archived INTEGER NOT NULL DEFAULT 0,updated_at TEXT NOT NULL,updated_by TEXT NOT NULL,PRIMARY KEY(kind,id));
CREATE INDEX IF NOT EXISTS learn_route ON learn_records(route);
CREATE TABLE IF NOT EXISTS learn_versions(kind TEXT NOT NULL,id TEXT NOT NULL,revision INTEGER NOT NULL,payload TEXT NOT NULL,action TEXT NOT NULL,actor TEXT NOT NULL,created_at TEXT NOT NULL,PRIMARY KEY(kind,id,revision));
CREATE TABLE IF NOT EXISTS learn_audit(id TEXT PRIMARY KEY,actor TEXT NOT NULL,action TEXT NOT NULL,target TEXT NOT NULL,created_at TEXT NOT NULL);

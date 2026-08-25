CREATE TABLE IF NOT EXISTS sync_profiles (
  code_hash TEXT PRIMARY KEY,
  payload TEXT NOT NULL,
  revision INTEGER NOT NULL DEFAULT 1,
  updated_at INTEGER NOT NULL
);

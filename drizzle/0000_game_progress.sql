CREATE TABLE IF NOT EXISTS game_progress (
  user_id TEXT PRIMARY KEY NOT NULL,
  user_email TEXT,
  progress_json TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

PRAGMA optimize;

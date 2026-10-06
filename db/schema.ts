export const leaderboardSchema = {
  table: 'leaderboard',
  columns: {
    id: 'INTEGER PRIMARY KEY AUTOINCREMENT', game: 'TEXT NOT NULL', player_id: 'TEXT NOT NULL',
    nickname: 'TEXT NOT NULL', score: 'INTEGER NOT NULL DEFAULT 0', updated_at: 'TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP'
  }, unique: ['game', 'player_id']
} as const;

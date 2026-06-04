-- Migration 001: Initial schema for Marshad Predict
-- Cloudflare D1 (SQLite)

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  display_name TEXT,
  department TEXT,
  is_admin INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS matches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  match_number INTEGER UNIQUE NOT NULL,
  stage TEXT NOT NULL,
  group_name TEXT,
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  match_datetime TEXT NOT NULL,
  stadium TEXT,
  city TEXT,
  actual_home_score INTEGER,
  actual_away_score INTEGER,
  is_finished INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS predictions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users(id),
  match_id INTEGER REFERENCES matches(id),
  predicted_home_score INTEGER NOT NULL,
  predicted_away_score INTEGER NOT NULL,
  points_awarded INTEGER,
  submitted_at TEXT DEFAULT (datetime('now')),
  UNIQUE (user_id, match_id)
);

CREATE INDEX IF NOT EXISTS idx_predictions_user_id ON predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_match_id ON predictions(match_id);
CREATE INDEX IF NOT EXISTS idx_matches_match_datetime ON matches(match_datetime);
CREATE INDEX IF NOT EXISTS idx_matches_stage ON matches(stage);

CREATE TABLE IF NOT EXISTS leaderboard_cache (
  user_id INTEGER PRIMARY KEY REFERENCES users(id),
  total_points INTEGER DEFAULT 0,
  exact_predictions INTEGER DEFAULT 0,
  correct_outcomes INTEGER DEFAULT 0,
  wrong_predictions INTEGER DEFAULT 0,
  last_updated TEXT DEFAULT (datetime('now'))
);

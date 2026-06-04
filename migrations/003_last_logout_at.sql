-- Migration 003: Add last_logout_at for server-side session invalidation
ALTER TABLE users ADD COLUMN last_logout_at TEXT;

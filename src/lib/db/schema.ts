import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').unique().notNull(),
  password_hash: text('password_hash').notNull(),
  password_salt: text('password_salt').notNull(),
  display_name: text('display_name'),
  department: text('department'),
  is_admin: integer('is_admin').default(0),
  created_at: text('created_at').default("''"),
  last_logout_at: text('last_logout_at'),
});

export const matches = sqliteTable('matches', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  match_number: integer('match_number').unique().notNull(),
  stage: text('stage').notNull(),
  group_name: text('group_name'),
  home_team: text('home_team').notNull(),
  away_team: text('away_team').notNull(),
  match_datetime: text('match_datetime').notNull(),
  stadium: text('stadium'),
  city: text('city'),
  actual_home_score: integer('actual_home_score'),
  actual_away_score: integer('actual_away_score'),
  is_finished: integer('is_finished').default(0),
});

export const predictions = sqliteTable('predictions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  user_id: integer('user_id').references(() => users.id),
  match_id: integer('match_id').references(() => matches.id),
  predicted_home_score: integer('predicted_home_score').notNull(),
  predicted_away_score: integer('predicted_away_score').notNull(),
  points_awarded: integer('points_awarded'),
  submitted_at: text('submitted_at'),
}, (table) => ({
  userMatchUnique: uniqueIndex('user_match_unique').on(table.user_id, table.match_id),
}));

export const leaderboard_cache = sqliteTable('leaderboard_cache', {
  user_id: integer('user_id').primaryKey().references(() => users.id),
  total_points: integer('total_points').default(0),
  exact_predictions: integer('exact_predictions').default(0),
  correct_outcomes: integer('correct_outcomes').default(0),
  wrong_predictions: integer('wrong_predictions').default(0),
  last_updated: text('last_updated'),
});

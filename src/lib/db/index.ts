/*
 * MANDATORY WORKFLOW A — PHASE 1: DISCOVERY REPORT
 * ─────────────────────────────────────────────────
 * ORM/Client:      Drizzle ORM with drizzle-orm/d1 adapter (zero TCP, no Node.js built-ins,
 *                  ~40KB bundle impact — edge-compatible from the start).
 * Target database: Cloudflare D1 (SQLite over HTTP).
 * DB instantiation: NEVER at module level — always per-request via getDB(env).
 * DB binding:      Passed through Hono context c.env.DB (NOT a global import).
 * wrangler.toml:   binding = "DB" with type d1_database.
 * Deployment:      Cloudflare Workers (ES Modules format) via wrangler deploy.
 * Migrations:      wrangler d1 migrations apply marshad-predict-db --local / --remote.
 *
 * PHASE 2 COMPATIBILITY ASSESSMENT:
 * ✓ No TCP connections  — Drizzle D1 adapter uses Workers HTTP fetch runtime
 * ✓ No Node.js built-ins — No fs, net, tls, dns, pg, mysql2, mongoose
 * ✓ Bundle size         — Drizzle ORM ~40KB; total Worker bundle << 1MB
 * ✓ Per-request init    — getDB(env) called inside each request handler
 * ✓ Env binding         — DB received from Hono c.env, never imported
 * ✓ No persistent conns — D1 is HTTP-based; no connection pooling needed
 */

import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export type Env = {
  DB: D1Database;
  SESSION_SECRET: string;
};

export function getDB(env: Env) {
  return drizzle(env.DB, { schema });
}

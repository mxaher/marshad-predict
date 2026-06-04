# Marshad Predict | مرشد بريدكت

FIFA World Cup 2026™ Match Prediction App — Internal competition for Almarshad Holding Group employees.

Predict match scores, earn points, and climb the leaderboard throughout the tournament (104 matches, June 11 – July 19, 2026).

## Tech Stack

| Component         | Technology                                      |
|-------------------|------------------------------------------------|
| Runtime           | Cloudflare Workers (ES Modules)                |
| Database          | Cloudflare D1 (SQLite over HTTP)               |
| ORM               | Drizzle ORM (`drizzle-orm/d1`)                 |
| Router            | Hono.js                                        |
| Frontend          | Server-Side Rendered JSX (Hono JSX)            |
| Styling           | Tailwind CSS via CDN (logical properties only) |
| Auth              | HttpOnly signed cookies (HMAC-SHA256)          |
| Password hashing  | Web Crypto API (SHA-256 + 16-byte salt)        |
| Language          | Arabic (default, RTL) / English (LTR)          |

## Prerequisites

- Node.js 18+ or Bun
- Cloudflare account with D1 enabled
- Wrangler CLI (`npm install -g wrangler`)

## Project Structure

```
marshad-predict/
├── src/
│   ├── index.ts              # Hono app entry + routes
│   ├── lib/
│   │   ├── db/
│   │   │   ├── index.ts      # getDB(env) — per-request only
│   │   │   └── schema.ts     # Drizzle ORM schema
│   │   ├── auth.ts           # Session + password utilities
│   │   └── scoring.ts        # calculatePoints()
│   ├── routes/
│   │   ├── auth.ts           # /login, /register, /logout, /lang
│   │   ├── fixtures.ts       # /fixtures
│   │   ├── predictions.ts    # POST /predictions, /my-predictions
│   │   ├── leaderboard.ts    # /leaderboard
│   │   ├── dashboard.ts      # /dashboard
│   │   └── admin.ts          # /admin/*
│   └── templates/
│       ├── layout.tsx        # HTML shell (dir, lang)
│       ├── components/
│       │   ├── MatchCard.tsx
│       │   ├── Leaderboard.tsx
│       │   ├── Countdown.tsx
│       │   └── PointsBadge.tsx
│       └── pages/
│           ├── Dashboard.tsx
│           ├── Fixtures.tsx
│           ├── MyPredictions.tsx
│           ├── Login.tsx
│           └── Admin.tsx
├── migrations/
│   ├── 001_init.sql          # Schema DDL
│   └── 002_seed_matches.sql  # 104 WC2026 fixtures
├── wrangler.toml
├── package.json
├── tsconfig.json
├── eslint.config.js
├── .dev.vars.example
├── .gitignore
└── README.md
```

## Setup

### 1. Install dependencies

```bash
cd marshad-predict
npm install
```

### 2. Configure secrets

Copy the example env file (never commit secrets):

```bash
cp .dev.vars.example .dev.vars
```

Edit `.dev.vars` and set a strong random secret:

```
SESSION_SECRET=<random-64-char-hex-string>
```

In production, set the secret via Wrangler:

```bash
npx wrangler secret put SESSION_SECRET
```

### 3. Create D1 Database

```bash
npx wrangler d1 create marshad-predict-db
```

Copy the returned `database_id` into `wrangler.toml`.

### 4. Run Migrations

**Local (development):**
```bash
npx wrangler d1 migrations apply marshad-predict-db --local
```

**Remote (production):**
```bash
npx wrangler d1 migrations apply marshad-predict-db --remote
```

### 5. Local Development

```bash
npm run dev
```

This starts the Wrangler dev server at `http://localhost:8787`.

### 6. Deploy

```bash
npm run deploy
```

### 7. Create Admin User

After first deployment, register a user, then promote to admin by running:

```bash
npx wrangler d1 execute marshad-predict-db --remote --command="UPDATE users SET is_admin = 1 WHERE username = 'your-username'"
```

Or locally:
```bash
npx wrangler d1 execute marshad-predict-db --local --command="UPDATE users SET is_admin = 1 WHERE username = 'your-username'"
```

## Scripts

| Command                   | Description                          |
|---------------------------|--------------------------------------|
| `npm run dev`             | Start local dev server               |
| `npm run deploy`          | Deploy to Cloudflare Workers         |
| `npm run typecheck`       | TypeScript type checking             |
| `npm run lint`            | ESLint (RTL-aware rules)             |
| `npm run lint:fix`        | Auto-fix ESLint violations           |
| `npm run db:migrate:local`| Apply migrations to local D1         |
| `npm run db:migrate:prod` | Apply migrations to production D1    |

## Scoring Rules

| Condition                                      | Points |
|------------------------------------------------|--------|
| Exact score match (e.g., predicted 2-1, actual 2-1) | 3      |
| Correct outcome, wrong score (e.g., predicted 3-0, actual 2-1) | 2 |
| Wrong outcome (e.g., predicted home win, actual draw/away win) | 0 |

No partial points. No bonus for goal difference. Predictions lock at match kickoff.

## Security Notes

- `SESSION_SECRET` is a Cloudflare Worker Secret — never in `wrangler.toml` or `.dev.vars` committed
- `.dev.vars` is in `.gitignore` — never commit it
- Password hashes use SHA-256 + random 16-byte salt (Web Crypto API)
- Admin routes verify `is_admin === 1` on every request
- All DB queries use Drizzle parameterized queries (no SQL injection)
- Security headers set on all responses: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`

## RTL / Bilingual Support

- Arabic is the default language (RTL)
- Toggle via the AR/EN button in the header
- `dir="rtl"` / `dir="ltr"` set on `<html>` dynamically
- All Tailwind classes use CSS logical properties (`ms-*`, `me-*`, `text-start`, `text-end`)
- ESLint rule `tailwind-rtl/tailwind/no-physical-classes` enforces this
- Times displayed in Riyadh timezone (UTC+3) using `Intl.DateTimeFormat`

## Admin Guide

### Finalizing a Match

1. Navigate to **Admin → Matches**
2. Find the match (only past/live matches show the score input)
3. Enter home and away scores
4. Click **Finalize**
5. The system will:
   - Save the actual score
   - Evaluate all predictions for that match
   - Award points (3/2/0) per prediction
   - Recalculate the leaderboard for all affected users
6. A success message shows how many predictions were correct

### Managing Users

1. Navigate to **Admin → Users**
2. View all registered users, their departments, points, and prediction counts
3. **Reset Password**: Generates a temporary password (shown once)
4. **Toggle Admin**: Grant or remove admin privileges

## Bundle Size

Verify bundle stays under 1MB before deployment:

```bash
npx wrangler deploy --dry-run --outdir=dist
```

import { Hono } from 'hono';
import { getDB, Env } from '../lib/db';
import { users, matches, predictions, leaderboard_cache } from '../lib/db/schema';
import { eq, and, desc, asc, sql, gte } from 'drizzle-orm';
import { getLang, requireSession } from '../lib/auth';
import DashboardPage, { type DashboardPageProps } from '../templates/pages/Dashboard';

const dashboardRoutes = new Hono<{ Bindings: Env }>();

dashboardRoutes.get('/dashboard', async (c) => {
  const lang = getLang(c.req.header('Cookie') || null);
  const session = await requireSession(c.req.header('Cookie'), c.env.SESSION_SECRET, c.env);
  if (!session) return c.redirect('/login', 302);

  const db = getDB(c.env);

  const user = await db.select().from(users).where(eq(users.id, session.userId)).get();
  if (!user) return c.redirect('/login', 302);

  const lb = await db.select()
    .from(leaderboard_cache)
    .where(eq(leaderboard_cache.user_id, session.userId))
    .get();

  const totalPoints = lb?.total_points || 0;

  const higherRanked = await db.select({ count: sql<number>`count(*)` })
    .from(leaderboard_cache)
    .where(
      and(
        gte(leaderboard_cache.total_points, totalPoints),
        sql`${leaderboard_cache.user_id} != ${session.userId}`
      )
    )
    .get();
  const rank = (higherRanked?.count || 0) + 1;

  const now = new Date().toISOString();

  const nextMatch = await db.select()
    .from(matches)
    .where(and(
      gte(matches.match_datetime, now),
      eq(matches.is_finished, 0)
    ))
    .orderBy(asc(matches.match_datetime))
    .limit(1)
    .get();

  const lastResults = await db.select({
    match_number: matches.match_number,
    home_team: matches.home_team,
    away_team: matches.away_team,
    actual_home_score: matches.actual_home_score,
    actual_away_score: matches.actual_away_score,
    predicted_home_score: predictions.predicted_home_score,
    predicted_away_score: predictions.predicted_away_score,
    points_awarded: predictions.points_awarded,
    is_finished: matches.is_finished,
  })
    .from(predictions)
    .leftJoin(matches, eq(predictions.match_id, matches.id))
    .where(and(
      eq(predictions.user_id, session.userId),
      eq(matches.is_finished, 1)
    ))
    .orderBy(desc(matches.match_datetime))
    .limit(5)
    .all();

  return c.html(
    <DashboardPage
      lang={lang}
      session={session}
      user={{
        display_name: user.display_name,
        department: user.department,
        total_points: totalPoints,
        rank,
      }}
      nextMatch={nextMatch || null}
      lastResults={lastResults as DashboardPageProps['lastResults']}
    />
  );
});

export default dashboardRoutes;

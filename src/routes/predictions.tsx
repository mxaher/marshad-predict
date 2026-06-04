import { Hono } from 'hono';
import { getDB, Env } from '../lib/db';
import { matches, predictions } from '../lib/db/schema';
import { eq, and, desc, asc } from 'drizzle-orm';
import { getLang, requireSession } from '../lib/auth';
import MyPredictionsPage from '../templates/pages/MyPredictions';

const predRoutes = new Hono<{ Bindings: Env }>();

predRoutes.post('/predictions', async (c) => {
  const session = await requireSession(c.req.header('Cookie'), c.env.SESSION_SECRET, c.env);
  if (!session) return c.json({ error: 'Unauthorized' }, 401);

  const body = await c.req.parseBody();
  const matchId = parseInt(body.match_id as string);
  const homeScore = parseInt(body.home_score as string);
  const awayScore = parseInt(body.away_score as string);

  if (isNaN(matchId) || isNaN(homeScore) || isNaN(awayScore)) {
    return c.json({ error: 'Invalid input' }, 400);
  }

  if (homeScore < 0 || homeScore > 20 || awayScore < 0 || awayScore > 20) {
    return c.json({ error: 'Scores must be 0-20' }, 400);
  }

  const db = getDB(c.env);
  const match = await db.select().from(matches).where(eq(matches.id, matchId)).get();

  if (!match) return c.json({ error: 'Match not found' }, 404);
  if (match.is_finished === 1) return c.json({ error: 'Match already finished' }, 403);

  const now = new Date();
  const matchTime = new Date(match.match_datetime);
  if (now >= matchTime) {
    return c.json({ error: 'Prediction locked — match has started' }, 403);
  }

  const existing = await db.select()
    .from(predictions)
    .where(and(eq(predictions.user_id, session.userId), eq(predictions.match_id, matchId)))
    .get();

  if (existing) {
    await db.update(predictions)
      .set({
        predicted_home_score: homeScore,
        predicted_away_score: awayScore,
        submitted_at: new Date().toISOString(),
      })
      .where(eq(predictions.id, existing.id))
      .run();
  } else {
    await db.insert(predictions).values({
      user_id: session.userId,
      match_id: matchId,
      predicted_home_score: homeScore,
      predicted_away_score: awayScore,
      submitted_at: new Date().toISOString(),
    }).run();
  }

  return c.json({ success: true, matchId });
});

predRoutes.get('/my-predictions', async (c) => {
  const lang = getLang(c.req.header('Cookie') || null);
  const session = await requireSession(c.req.header('Cookie'), c.env.SESSION_SECRET, c.env);
  if (!session) return c.redirect('/login', 302);

  const db = getDB(c.env);

  const rawPreds = await db.select({
    id: predictions.id,
    match_id: predictions.match_id,
    predicted_home_score: predictions.predicted_home_score,
    predicted_away_score: predictions.predicted_away_score,
    points_awarded: predictions.points_awarded,
    match_number: matches.match_number,
    stage: matches.stage,
    home_team: matches.home_team,
    away_team: matches.away_team,
    match_datetime: matches.match_datetime,
    actual_home_score: matches.actual_home_score,
    actual_away_score: matches.actual_away_score,
    is_finished: matches.is_finished,
  })
    .from(predictions)
    .leftJoin(matches, eq(predictions.match_id, matches.id))
    .where(eq(predictions.user_id, session.userId))
    .orderBy(desc(matches.match_datetime))
    .all();

  const userPreds = rawPreds.map(p => ({
    ...p,
    id: p.id ?? 0,
    match_number: p.match_number ?? 0,
    stage: p.stage ?? '',
    home_team: p.home_team ?? '',
    away_team: p.away_team ?? '',
    match_datetime: p.match_datetime ?? '',
    is_finished: p.is_finished ?? 0,
  }));

  return c.html(
    <MyPredictionsPage lang={lang} session={session} predictions={userPreds} />
  );
});

export default predRoutes;

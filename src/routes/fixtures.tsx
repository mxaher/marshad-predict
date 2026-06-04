import { Hono } from 'hono';
import { getDB, Env } from '../lib/db';
import { matches, predictions } from '../lib/db/schema';
import { eq, asc } from 'drizzle-orm';
import { getLang, requireSession } from '../lib/auth';
import FixturesPage from '../templates/pages/Fixtures';

type PredictionMap = Record<number, {
  predicted_home_score: number;
  predicted_away_score: number;
  points_awarded: number | null;
}>;

const fixtures = new Hono<{ Bindings: Env }>();

fixtures.get('/fixtures', async (c) => {
  const lang = getLang(c.req.header('Cookie') || null);
  const session = await requireSession(c.req.header('Cookie'), c.env.SESSION_SECRET, c.env);
  if (!session) return c.redirect('/login', 302);

  const db = getDB(c.env);
  const allMatches = await db.select().from(matches).orderBy(asc(matches.match_number)).all();

  const userPredictions = await db.select()
    .from(predictions)
    .where(eq(predictions.user_id, session.userId))
    .all();

  const predMap: PredictionMap = {};
  for (const p of userPredictions) {
    if (p.match_id !== null) predMap[p.match_id] = p;
  }

  const matchesTyped = allMatches.map(m => ({ ...m, is_finished: m.is_finished ?? 0 }));

  return c.html(
    <FixturesPage lang={lang} session={session} matches={matchesTyped} predictions={predMap} />
  );
});

export default fixtures;

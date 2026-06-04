import { Hono, Context } from 'hono';
import { getDB, Env } from '../lib/db';
import { users, matches, predictions, leaderboard_cache } from '../lib/db/schema';
import { eq, and, asc, sql } from 'drizzle-orm';
import { getLang, requireSession, hashPassword, generateSalt, SessionPayload } from '../lib/auth';
import { calculatePoints } from '../lib/scoring';
import AdminPage from '../templates/pages/Admin';

type Bindings = { Bindings: Env };

const adminRoutes = new Hono<Bindings>();

async function requireAdmin(c: Context<Bindings>, lang: 'ar' | 'en'): Promise<SessionPayload | null> {
  const session = await requireSession(c.req.header('Cookie'), c.env.SESSION_SECRET, c.env);
  if (!session || session.isAdmin !== 1) return null;
  return session;
}

adminRoutes.get('/admin/matches', async (c) => {
  const lang = getLang(c.req.header('Cookie') || null);
  const session = await requireAdmin(c, lang);
  if (!session) return c.redirect('/login', 302);

  const db = getDB(c.env);
  const allMatches = (await db.select()
    .from(matches)
    .orderBy(asc(matches.match_number))
    .all()).map(m => ({ ...m, is_finished: m.is_finished ?? 0 }));

  return c.html(
    <AdminPage lang={lang} session={session} matches={allMatches} tab="matches" />
  );
});

adminRoutes.post('/admin/finalize', async (c) => {
  const lang = getLang(c.req.header('Cookie') || null);
  const session = await requireAdmin(c, lang);
  if (!session) return c.redirect('/login', 302);

  const body = await c.req.parseBody();
  const matchId = parseInt(body.match_id as string);
  const homeScore = parseInt(body.home_score as string);
  const awayScore = parseInt(body.away_score as string);

  if (isNaN(matchId) || isNaN(homeScore) || isNaN(awayScore)) {
    return c.redirect('/admin/matches', 302);
  }

  const db = getDB(c.env);
  const match = await db.select().from(matches).where(eq(matches.id, matchId)).get();
  if (!match) return c.redirect('/admin/matches', 302);

  const matchPreds = await db.select()
    .from(predictions)
    .where(eq(predictions.match_id, matchId))
    .all();

  let scored = 0;
  const affectedUsers = new Set<number>();

  const stmts: string[] = [];
  const paramsList: (string | number)[][] = [];

  function addStmt(sql: string, params: (string | number)[]) {
    stmts.push(sql);
    paramsList.push(params);
  }

  addStmt(
    `UPDATE matches SET actual_home_score = ?, actual_away_score = ?, is_finished = 1 WHERE id = ?`,
    [homeScore, awayScore, matchId]
  );

  for (const pred of matchPreds) {
    const pts = calculatePoints(
      pred.predicted_home_score, pred.predicted_away_score,
      homeScore, awayScore
    );
    if (pred.user_id !== null) affectedUsers.add(pred.user_id);
    if (pts > 0) scored++;

    addStmt(
      `UPDATE predictions SET points_awarded = ? WHERE id = ?`,
      [pts, pred.id]
    );
  }

  await c.env.DB.batch(stmts.map((s, i) => c.env.DB.prepare(s).bind(...paramsList[i])));

  for (const userId of affectedUsers) {
    const userPreds = await db.select()
      .from(predictions)
      .where(and(
        eq(predictions.user_id, userId),
        sql`${predictions.points_awarded} IS NOT NULL`
      ))
      .all();

    let totalPts = 0, exact = 0, correct = 0, wrong = 0;
    for (const p of userPreds) {
      if (p.points_awarded === 3) { totalPts += 3; exact++; }
      else if (p.points_awarded === 2) { totalPts += 2; correct++; }
      else if (p.points_awarded === 0) { wrong++; }
    }

    const existing = await db.select()
      .from(leaderboard_cache)
      .where(eq(leaderboard_cache.user_id, userId))
      .get();

    if (existing) {
      await db.update(leaderboard_cache)
        .set({
          total_points: totalPts,
          exact_predictions: exact,
          correct_outcomes: correct,
          wrong_predictions: wrong,
          last_updated: new Date().toISOString(),
        })
        .where(eq(leaderboard_cache.user_id, userId))
        .run();
    } else {
      await db.insert(leaderboard_cache)
        .values({
          user_id: userId,
          total_points: totalPts,
          exact_predictions: exact,
          correct_outcomes: correct,
          wrong_predictions: wrong,
          last_updated: new Date().toISOString(),
        })
        .run();
    }
  }

  const msg = lang === 'ar'
    ? `تم اعتماد المباراة. ${scored} توقع صحيح من أصل ${matchPreds.length}`
    : `Match finalized. ${scored} correct predictions out of ${matchPreds.length}`;

  const allMatches = (await db.select()
    .from(matches)
    .orderBy(asc(matches.match_number))
    .all()).map(m => ({ ...m, is_finished: m.is_finished ?? 0 }));

  return c.html(
    <AdminPage lang={lang} session={session} matches={allMatches} tab="matches" message={msg} />
  );
});

adminRoutes.get('/admin/users', async (c) => {
  const lang = getLang(c.req.header('Cookie') || null);
  const session = await requireAdmin(c, lang);
  if (!session) return c.redirect('/login', 302);

  const db = getDB(c.env);
  const allUsers = await db.select().from(users).orderBy(asc(users.id)).all();

  const userList: Array<{
    id: number; username: string; display_name: string | null;
    department: string | null; is_admin: number;
    prediction_count: number; total_points: number;
  }> = [];

  for (const u of allUsers) {
    const predCount = await db.select({ count: sql<number>`count(*)` })
      .from(predictions)
      .where(eq(predictions.user_id, u.id))
      .get();

    const lb = await db.select()
      .from(leaderboard_cache)
      .where(eq(leaderboard_cache.user_id, u.id))
      .get();

    userList.push({
      id: u.id,
      username: u.username,
      display_name: u.display_name,
      department: u.department,
      is_admin: u.is_admin ?? 0,
      prediction_count: predCount?.count ?? 0,
      total_points: lb?.total_points ?? 0,
    });
  }

  return c.html(
    <AdminPage lang={lang} session={session} matches={[]} tab="users" users={userList} />
  );
});

adminRoutes.post('/admin/reset-password', async (c) => {
  const lang = getLang(c.req.header('Cookie') || null);
  const session = await requireAdmin(c, lang);
  if (!session) return c.redirect('/login', 302);

  const body = await c.req.parseBody();
  const userId = parseInt(body.user_id as string);
  if (isNaN(userId)) return c.redirect('/admin/users', 302);

  const db = getDB(c.env);
  const tempPassword = Math.random().toString(36).slice(2, 10) + 'A1!';
  const salt = generateSalt();
  const pwHash = await hashPassword(tempPassword, salt);

  await db.update(users)
    .set({ password_hash: pwHash, password_salt: salt })
    .where(eq(users.id, userId))
    .run();

  const allUsers = await db.select().from(users).orderBy(asc(users.id)).all();
  const userList: Array<{
    id: number; username: string; display_name: string | null;
    department: string | null; is_admin: number;
    prediction_count: number; total_points: number;
  }> = [];

  for (const u of allUsers) {
    const predCount = await db.select({ count: sql<number>`count(*)` })
      .from(predictions)
      .where(eq(predictions.user_id, u.id))
      .get();
    const lb = await db.select()
      .from(leaderboard_cache)
      .where(eq(leaderboard_cache.user_id, u.id))
      .get();
    userList.push({
      id: u.id,
      username: u.username,
      display_name: u.display_name,
      department: u.department,
      is_admin: u.is_admin ?? 0,
      prediction_count: predCount?.count ?? 0,
      total_points: lb?.total_points ?? 0,
    });
  }

  const msg = lang === 'ar'
    ? `تم إعادة تعيين كلمة المرور للمستخدم #${userId}`
    : `Password reset for user #${userId}`;

  return c.html(
    <AdminPage lang={lang} session={session} matches={[]} tab="users" users={userList} message={msg} />
  );
});

adminRoutes.post('/admin/toggle-admin', async (c) => {
  const lang = getLang(c.req.header('Cookie') || null);
  const session = await requireAdmin(c, lang);
  if (!session) return c.redirect('/login', 302);

  const body = await c.req.parseBody();
  const userId = parseInt(body.user_id as string);
  if (isNaN(userId)) return c.redirect('/admin/users', 302);

  const db = getDB(c.env);
  const user = await db.select().from(users).where(eq(users.id, userId)).get();
  if (!user) return c.redirect('/admin/users', 302);

  const newAdmin = user.is_admin === 1 ? 0 : 1;
  await db.update(users)
    .set({ is_admin: newAdmin })
    .where(eq(users.id, userId))
    .run();

  return c.redirect('/admin/users', 302);
});

export default adminRoutes;

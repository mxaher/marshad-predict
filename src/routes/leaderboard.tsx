import { Hono } from 'hono';
import { getDB, Env } from '../lib/db';
import { leaderboard_cache, users } from '../lib/db/schema';
import { eq, desc, asc, sql } from 'drizzle-orm';
import { getLang, requireSession } from '../lib/auth';
import Layout from '../templates/layout';
import Leaderboard from '../templates/components/Leaderboard';

const leaderboardRoutes = new Hono<{ Bindings: Env }>();

leaderboardRoutes.get('/leaderboard', async (c) => {
  const lang = getLang(c.req.header('Cookie') || null);
  const session = await requireSession(c.req.header('Cookie'), c.env.SESSION_SECRET, c.env);
  if (!session) return c.redirect('/login', 302);

  const db = getDB(c.env);

  const entries = await db.select({
    user_id: leaderboard_cache.user_id,
    display_name: users.display_name,
    department: users.department,
    total_points: leaderboard_cache.total_points,
    exact_predictions: leaderboard_cache.exact_predictions,
    correct_outcomes: leaderboard_cache.correct_outcomes,
    wrong_predictions: leaderboard_cache.wrong_predictions,
  })
    .from(leaderboard_cache)
    .leftJoin(users, eq(leaderboard_cache.user_id, users.id))
    .orderBy(
      desc(leaderboard_cache.total_points),
      desc(leaderboard_cache.exact_predictions),
      desc(leaderboard_cache.correct_outcomes),
      asc(users.display_name)
    )
    .all();

  const ranked = entries.map((e, i) => ({
    ...e,
    rank: i + 1,
    total_points: e.total_points ?? 0,
    exact_predictions: e.exact_predictions ?? 0,
    correct_outcomes: e.correct_outcomes ?? 0,
    wrong_predictions: e.wrong_predictions ?? 0,
  }));

  return c.html(
    <Layout lang={lang} session={session} title={lang === 'ar' ? 'الترتيب' : 'Leaderboard'}>
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-white">
          {lang === 'ar' ? 'لوحة الترتيب' : 'Leaderboard'}
        </h2>
        <p class="text-gray-400 text-sm">
          {lang === 'ar' ? 'تصنيف المشاركين' : 'Player rankings'}
        </p>
      </div>
      <div class="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
        <div class="text-xs text-gray-500 mb-4">
          {lang === 'ar' ? 'آخر تحديث: ' : 'Last updated: '}
          {new Date().toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-SA', { timeZone: 'Asia/Riyadh' })}
        </div>
        <Leaderboard entries={ranked} currentUserId={session.userId} lang={lang} />
      </div>
      <div class="text-center mt-4">
        <button
          class="bg-gray-800 hover:bg-gray-700 text-gray-400 px-4 py-2 rounded-lg text-sm transition-colors"
          onclick="location.reload()"
        >
          {lang === 'ar' ? 'تحديث' : 'Refresh ↻'}
        </button>
      </div>
    </Layout>
  );
});

export default leaderboardRoutes;

import { FC } from 'hono/jsx';
import Layout from '../layout';
import PointsBadge from '../components/PointsBadge';
import { SessionPayload } from '../../lib/auth';

export interface DashboardPageProps {
  lang: 'ar' | 'en';
  session: SessionPayload;
  user: {
    display_name: string | null;
    department: string | null;
    total_points: number;
    rank: number;
  };
  nextMatch: {
    match_number: number;
    home_team: string;
    away_team: string;
    match_datetime: string;
  } | null;
  lastResults: Array<{
    match_number: number;
    home_team: string;
    away_team: string;
    actual_home_score: number | null;
    actual_away_score: number | null;
    predicted_home_score: number;
    predicted_away_score: number;
    points_awarded: number | null;
  }>;
}

const DashboardPage: FC<DashboardPageProps> = ({ lang, session, user, nextMatch, lastResults }) => {
  const now = new Date();

  return (
    <Layout lang={lang} session={session} title={lang === 'ar' ? 'الرئيسية' : 'Dashboard'}>
      <div class="grid gap-6 md:grid-cols-3 mb-8">
        {/* Points card */}
        <div class="bg-gradient-to-br from-primary/20 to-green-900/20 border border-primary/30 rounded-xl p-6">
          <p class="text-gray-400 text-sm">{lang === 'ar' ? 'نقاطي' : 'My Points'}</p>
          <p class="text-4xl font-bold text-accent mt-1">{user.total_points}</p>
          <p class="text-gray-500 text-xs mt-1">
            {lang === 'ar' ? 'المرتبة' : 'Rank'}: #{user.rank}
          </p>
        </div>

        {/* Next match card */}
        <div class="bg-card-bg border border-card-border rounded-xl p-6 shadow-lg">
          <p class="text-gray-400 text-sm mb-2">{lang === 'ar' ? 'المباراة القادمة' : 'Next Match'}</p>
          {nextMatch ? (
            <>
              <p class="font-semibold text-white">{nextMatch.home_team} vs {nextMatch.away_team}</p>
              <p class="text-xs text-accent mt-1">
                {(() => {
                  const mt = new Date(nextMatch.match_datetime);
                  const diff = mt.getTime() - now.getTime();
                  if (diff <= 0) return lang === 'ar' ? 'بدأت!' : 'Started!';
                  const d = Math.floor(diff / 86400000);
                  const h = Math.floor((diff % 86400000) / 3600000);
                  const m = Math.floor((diff % 3600000) / 60000);
                  return lang === 'ar' ? `${d}ي ${h}س ${m}د` : `${d}d ${h}h ${m}m`;
                })()}
              </p>
              <a href="/fixtures" class="text-xs text-primary hover:text-primary-light mt-2 inline-block">
                {lang === 'ar' ? 'اذهب إلى المباريات ←' : 'Go to Fixtures →'}
              </a>
            </>
          ) : (
            <p class="text-gray-500 text-sm">{lang === 'ar' ? 'لا توجد مباريات متبقية' : 'No remaining matches'}</p>
          )}
        </div>

        {/* Quick links */}
        <div class="bg-card-bg border border-card-border rounded-xl p-6 shadow-lg">
          <p class="text-gray-400 text-sm mb-3">{lang === 'ar' ? 'روابط سريعة' : 'Quick Links'}</p>
          <div class="flex flex-col gap-2">
            <a href="/fixtures" class="bg-darkbg hover:bg-card-bg text-white border border-card-border px-4 py-2 rounded-xl text-sm transition-all">
              ⚽ {lang === 'ar' ? 'جميع المباريات' : 'All Fixtures'}
            </a>
            <a href="/my-predictions" class="bg-darkbg hover:bg-card-bg text-white border border-card-border px-4 py-2 rounded-xl text-sm transition-all">
              📋 {lang === 'ar' ? 'توقعاتي' : 'My Predictions'}
            </a>
            <a href="/leaderboard" class="bg-darkbg hover:bg-card-bg text-white border border-card-border px-4 py-2 rounded-xl text-sm transition-all">
              🏆 {lang === 'ar' ? 'لوحة الترتيب' : 'Leaderboard'}
            </a>
          </div>
        </div>
      </div>

      {/* Recent results */}
      <div class="bg-card-bg border border-card-border rounded-xl p-6 shadow-lg">
        <h3 class="text-lg font-bold text-white mb-4">
          {lang === 'ar' ? 'آخر النتائج' : 'Recent Results'}
        </h3>
        {lastResults.length > 0 ? (
          <div class="space-y-2">
            {lastResults.map(r => (
              <div class="flex items-center justify-between bg-darkbg border border-card-border rounded-xl px-4 py-3">
                <div class="flex items-center gap-3 flex-1">
                  <span class="text-xs text-gray-500">#{r.match_number}</span>
                  <span class="text-sm text-gray-300">
                    {r.home_team} vs {r.away_team}
                  </span>
                </div>
                <div class="flex items-center gap-3">
                  <span class="text-sm font-mono text-gray-400">
                    {r.predicted_home_score}:{r.predicted_away_score}
                    <span class="text-gray-600 mx-1">→</span>
                    {r.actual_home_score !== null ? `${r.actual_home_score}:${r.actual_away_score}` : '?:?'}
                  </span>
                  <PointsBadge points={r.points_awarded ?? null} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p class="text-gray-500 text-center py-4">
            {lang === 'ar' ? 'لم تنته أي مباراة بعد' : 'No matches finished yet'}
          </p>
        )}
      </div>
    </Layout>
  );
};

export default DashboardPage;

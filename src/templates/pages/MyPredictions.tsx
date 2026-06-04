import { FC } from 'hono/jsx';
import Layout from '../layout';
import PointsBadge from '../components/PointsBadge';
import { SessionPayload } from '../../lib/auth';

interface MyPredictionsPageProps {
  lang: 'ar' | 'en';
  session: SessionPayload;
  predictions: Array<{
    id: number;
    match_number: number;
    stage: string;
    home_team: string;
    away_team: string;
    match_datetime: string;
    actual_home_score: number | null;
    actual_away_score: number | null;
    predicted_home_score: number;
    predicted_away_score: number;
    points_awarded: number | null;
    is_finished: number;
  }>;
}

const MyPredictionsPage: FC<MyPredictionsPageProps> = ({ lang, session, predictions }) => {
  const stageOrder = ['Group Stage', 'Round of 32', 'Round of 16', 'Quarter-Final', 'Semi-Final', 'Third Place', 'Final'];
  const grouped: Record<string, typeof predictions> = {};

  for (const p of predictions) {
    if (!grouped[p.stage]) grouped[p.stage] = [];
    grouped[p.stage].push(p);
  }

  return (
    <Layout lang={lang} session={session} title={lang === 'ar' ? 'توقعاتي' : 'My Predictions'}>
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-white">
          {lang === 'ar' ? 'توقعاتي' : 'My Predictions'}
        </h2>
        <p class="text-gray-400 text-sm">
          {lang === 'ar' ? 'سجل توقعاتك ومقارنتها بالنتائج الفعلية' : 'Your prediction history vs actual results'}
        </p>
      </div>

      {predictions.length === 0 ? (
        <div class="text-center py-12 bg-gray-900/60 border border-gray-800 rounded-xl">
          <span class="text-4xl">📋</span>
          <p class="text-gray-500 mt-4">
            {lang === 'ar' ? 'لم تقدم أي توقعات بعد' : "You haven't made any predictions yet"}
          </p>
          <a href="/fixtures" class="inline-block mt-4 bg-primary hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors">
            {lang === 'ar' ? 'اذهب إلى المباريات' : 'Go to Fixtures'}
          </a>
        </div>
      ) : (
        stageOrder.filter(s => grouped[s]).map(stage => (
          <div class="mb-6">
            <h3 class="text-md font-bold text-accent mb-2 border-b border-gray-800 pb-1">
              {stage}
            </h3>
            <div class="space-y-2">
              {grouped[stage]
                .sort((a, b) => new Date(a.match_datetime).getTime() - new Date(b.match_datetime).getTime())
                .map(p => {
                  const isFinished = p.is_finished === 1;
                  const now = new Date();
                  const matchTime = new Date(p.match_datetime);
                  const isLocked = now >= matchTime;

                  let bgClass = 'bg-gray-800/30 border-gray-800';
                  if (p.points_awarded === 3) bgClass = 'bg-green-900/20 border-green-800/50';
                  else if (p.points_awarded === 2) bgClass = 'bg-yellow-900/20 border-yellow-800/50';
                  else if (p.points_awarded === 0) bgClass = 'bg-red-900/20 border-red-800/50';
                  else if (isFinished && p.points_awarded === null) bgClass = 'bg-gray-800/30 border-gray-800';

                  return (
                    <div class={`rounded-lg border px-4 py-3 flex items-center justify-between flex-wrap gap-2 ${bgClass}`}>
                      <div class="flex items-center gap-3 flex-1 min-w-0">
                        <span class="text-xs text-gray-500">#{p.match_number}</span>
                        <span class="text-sm text-gray-300 truncate">
                          {p.home_team} vs {p.away_team}
                        </span>
                      </div>

                      <div class="flex items-center gap-3">
                        {isFinished ? (
                          <>
                            <span class="text-sm font-mono">
                              <span class="text-gray-400">{p.predicted_home_score}</span>
                              <span class="text-gray-600 mx-1">:</span>
                              <span class="text-gray-400">{p.predicted_away_score}</span>
                            </span>
                            <span class="text-gray-600">→</span>
                            <span class="text-sm font-mono font-bold text-white">
                              {p.actual_home_score}:{p.actual_away_score}
                            </span>
                            <PointsBadge points={p.points_awarded} />
                          </>
                        ) : isLocked ? (
                          <>
                            <span class="text-sm font-mono text-gray-400">
                              {p.predicted_home_score}:{p.predicted_away_score}
                            </span>
                            <span class="text-xs text-gray-500">🔒</span>
                            <PointsBadge points={null} />
                          </>
                        ) : (
                          <>
                            <span class="text-sm font-mono text-gray-400">
                              {p.predicted_home_score}:{p.predicted_away_score}
                            </span>
                            <span class="text-xs text-blue-400">{lang === 'ar' ? 'بانتظار الموعد' : 'Upcoming'}</span>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))
      )}
    </Layout>
  );
};

export default MyPredictionsPage;

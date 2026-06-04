import { FC } from 'hono/jsx';
import Layout from '../layout';
import Countdown from '../components/Countdown';
import MatchCard from '../components/MatchCard';
import { SessionPayload } from '../../lib/auth';

interface FixturesPageProps {
  lang: 'ar' | 'en';
  session: SessionPayload;
  matches: Array<{
    id: number;
    match_number: number;
    stage: string;
    group_name: string | null;
    home_team: string;
    away_team: string;
    match_datetime: string;
    stadium: string | null;
    city: string | null;
    actual_home_score: number | null;
    actual_away_score: number | null;
    is_finished: number;
  }>;
  predictions: Record<number, {
    predicted_home_score: number;
    predicted_away_score: number;
    points_awarded: number | null;
  }>;
}

const FixturesPage: FC<FixturesPageProps> = ({ lang, session, matches, predictions }) => {
  const stageOrder = ['Group Stage', 'Round of 32', 'Round of 16', 'Quarter-Final', 'Semi-Final', 'Third Place', 'Final'];
  const grouped: Record<string, typeof matches> = {};

  for (const match of matches) {
    if (!grouped[match.stage]) grouped[match.stage] = [];
    grouped[match.stage].push(match);
  }

  return (
    <Layout lang={lang} session={session} title={lang === 'ar' ? 'المباريات' : 'Fixtures'}>
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-white">
          {lang === 'ar' ? 'جميع المباريات' : 'All Fixtures'}
        </h2>
        <p class="text-gray-400 text-sm">
          {lang === 'ar' ? 'ضع توقعاتك قبل انطلاق المباراة' : 'Set your predictions before kickoff'}
        </p>
      </div>

      {stageOrder.filter(s => grouped[s]).map(stage => (
        <div class="mb-8">
          <h3 class="text-lg font-bold text-accent mb-3 border-b border-gray-800 pb-2">
            {stage === 'Group Stage' ? (lang === 'ar' ? 'دور المجموعات' : 'Group Stage') :
             stage === 'Round of 32' ? (lang === 'ar' ? 'دور الـ 32' : 'Round of 32') :
             stage === 'Round of 16' ? (lang === 'ar' ? 'دور الـ 16' : 'Round of 16') :
             stage === 'Quarter-Final' ? (lang === 'ar' ? 'ربع النهائي' : 'Quarter-Final') :
             stage === 'Semi-Final' ? (lang === 'ar' ? 'نصف النهائي' : 'Semi-Final') :
             stage === 'Third Place' ? (lang === 'ar' ? 'تحديد المركز الثالث' : 'Third Place') :
             stage === 'Final' ? (lang === 'ar' ? 'النهائي' : 'Final') :
             stage}
          </h3>
          <div class="space-y-3">
            {grouped[stage]
              .sort((a, b) => new Date(a.match_datetime).getTime() - new Date(b.match_datetime).getTime())
              .map(match => (
                <MatchCard
                  match={match}
                  prediction={predictions[match.id] || null}
                  lang={lang}
                />
              ))}
          </div>
        </div>
      ))}
    </Layout>
  );
};

export default FixturesPage;

import { FC } from 'hono/jsx';
import Countdown from './Countdown';
import PointsBadge from './PointsBadge';

interface MatchCardProps {
  match: {
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
  };
  prediction?: {
    predicted_home_score: number;
    predicted_away_score: number;
    points_awarded: number | null;
  } | null;
  lang: 'ar' | 'en';
}

const teamFlags: Record<string, string> = {
  'Mexico': '🇲🇽', 'South Korea': '🇰🇷', 'South Africa': '🇿🇦', 'Czechia': '🇨🇿',
  'Canada': '🇨🇦', 'Switzerland': '🇨🇭', 'Qatar': '🇶🇦', 'Bosnia and Herzegovina': '🇧🇦',
  'Brazil': '🇧🇷', 'Morocco': '🇲🇦', 'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'Haiti': '🇭🇹',
  'USA': '🇺🇸', 'Paraguay': '🇵🇾', 'Australia': '🇦🇺', 'Türkiye': '🇹🇷',
  'Germany': '🇩🇪', 'Ecuador': '🇪🇨', 'Ivory Coast': '🇨🇮', 'Curaçao': '🇨🇼',
  'Netherlands': '🇳🇱', 'Japan': '🇯🇵', 'Tunisia': '🇹🇳', 'Sweden': '🇸🇪',
  'Belgium': '🇧🇪', 'Iran': '🇮🇷', 'Egypt': '🇪🇬', 'New Zealand': '🇳🇿',
  'Spain': '🇪🇸', 'Uruguay': '🇺🇾', 'Saudi Arabia': '🇸🇦', 'Cape Verde': '🇨🇻',
  'France': '🇫🇷', 'Senegal': '🇸🇳', 'Norway': '🇳🇴', 'Iraq': '🇮🇶',
  'Argentina': '🇦🇷', 'Austria': '🇦🇹', 'Algeria': '🇩🇿', 'Jordan': '🇯🇴',
  'Portugal': '🇵🇹', 'Colombia': '🇨🇴', 'Uzbekistan': '🇺🇿', 'DR Congo': '🇨🇩',
  'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Croatia': '🇭🇷', 'Panama': '🇵🇦', 'Ghana': '🇬🇭',
};

function getFlag(team: string): string {
  if (team.startsWith('Winner') || team.startsWith('Runner-up') || team.startsWith('3rd') || team.startsWith('Loser')) return '🏆';
  return teamFlags[team] || '🏳️';
}

const stageLabels: Record<string, { ar: string; en: string }> = {
  'Group Stage': { ar: 'دور المجموعات', en: 'Group Stage' },
  'Round of 32': { ar: 'دور الـ 32', en: 'Round of 32' },
  'Round of 16': { ar: 'دور الـ 16', en: 'Round of 16' },
  'Quarter-Final': { ar: 'ربع النهائي', en: 'Quarter-Final' },
  'Semi-Final': { ar: 'نصف النهائي', en: 'Semi-Final' },
  'Third Place': { ar: 'تحديد المركز الثالث', en: 'Third Place' },
  'Final': { ar: 'النهائي', en: 'Final' },
};

const MatchCard: FC<MatchCardProps> = ({ match, prediction, lang }) => {
  const now = new Date();
  const matchTime = new Date(match.match_datetime);
  const isLocked = now >= matchTime;
  const riyadhTime = new Intl.DateTimeFormat(lang === 'ar' ? 'ar-SA' : 'en-SA', {
    timeZone: 'Asia/Riyadh',
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(matchTime);

  const homeFlag = getFlag(match.home_team);
  const awayFlag = getFlag(match.away_team);

  return (
    <div class="bg-card-bg border border-card-border rounded-xl p-4 hover:border-primary/40 transition-all shadow-lg">
      <div class="flex items-center justify-between mb-2 flex-wrap gap-1">
        <span class="text-xs text-gray-500 font-medium">
          #{match.match_number} {match.group_name ? `• ${match.group_name}` : ''} • {match.stage}
        </span>
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-400">{riyadhTime}</span>
          {match.stadium && <span class="text-xs text-gray-600 hidden sm:inline">{match.stadium}</span>}
        </div>
      </div>

      <div class="flex items-center justify-between gap-4">
        {/* Home team */}
        <div class="flex-1 text-end">
          <div class="flex items-center justify-end gap-2">
            <span class={`font-semibold text-sm ${lang === 'ar' ? '' : ''}`}>
              {match.home_team}
            </span>
            <span class="text-lg">{homeFlag}</span>
          </div>
        </div>

        {/* Score area */}
        <div class="flex items-center gap-2">
          {match.is_finished === 1 ? (
            <div class="flex items-center gap-2">
              <span class="text-2xl font-bold text-white">{match.actual_home_score}</span>
              <span class="text-gray-500">:</span>
              <span class="text-2xl font-bold text-white">{match.actual_away_score}</span>
              {prediction && (
                <div class="flex items-center gap-1 ms-2">
                  <PointsBadge points={prediction.points_awarded ?? null} />
                </div>
              )}
            </div>
          ) : isLocked ? (
            <div class="flex items-center gap-2">
              <span class="text-xl">🔒</span>
              <span class="text-xs text-gray-500">
                {lang === 'ar' ? 'مقفولة' : 'Locked'}
              </span>
              {prediction && (
                <div class="flex items-center gap-1 text-sm">
                  <span class="text-gray-400">{prediction.predicted_home_score}</span>
                  <span class="text-gray-600">:</span>
                  <span class="text-gray-400">{prediction.predicted_away_score}</span>
                  {prediction.points_awarded !== null && prediction.points_awarded !== undefined && (
                    <PointsBadge points={prediction.points_awarded} />
                  )}
                </div>
              )}
            </div>
          ) : (
            <div class="flex items-center gap-2" data-match-id={match.id}>
              <input
                type="number"
                min="0"
                max="20"
                value={prediction?.predicted_home_score ?? ''}
                placeholder="?"
                class="w-12 h-10 text-center bg-gray-800 border border-gray-700 rounded text-white text-lg font-bold"
                data-home={match.id}
              />
              <span class="text-gray-500 font-bold">:</span>
              <input
                type="number"
                min="0"
                max="20"
                value={prediction?.predicted_away_score ?? ''}
                placeholder="?"
                class="w-12 h-10 text-center bg-gray-800 border border-gray-700 rounded text-white text-lg font-bold"
                data-away={match.id}
              />
              <button
                class="bg-primary hover:bg-green-700 text-white px-3 py-1 text-sm rounded transition-colors"
                data-submit={match.id}
              >
                {lang === 'ar' ? 'حفظ' : 'Save'}
              </button>
            </div>
          )}
        </div>

        {/* Away team */}
        <div class="flex-1 text-start">
          <div class="flex items-center gap-2">
            <span class="text-lg">{awayFlag}</span>
            <span class={`font-semibold text-sm ${lang === 'ar' ? '' : ''}`}>
              {match.away_team}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;

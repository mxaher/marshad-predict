import { FC } from 'hono/jsx';

interface LeaderboardEntry {
  rank: number;
  user_id: number;
  display_name: string | null;
  department: string | null;
  total_points: number;
  exact_predictions: number;
  correct_outcomes: number;
  wrong_predictions: number;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: number;
  lang: 'ar' | 'en';
}

const Leaderboard: FC<LeaderboardProps> = ({ entries, currentUserId, lang }) => {
  return (
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-800 text-gray-400 uppercase text-xs">
            <th class="py-3 px-2 text-start">{lang === 'ar' ? '#' : '#'}</th>
            <th class="py-3 px-2 text-start">{lang === 'ar' ? 'اللاعب' : 'Player'}</th>
            <th class="py-3 px-2 text-start hidden md:table-cell">{lang === 'ar' ? 'القسم' : 'Dept'}</th>
            <th class="py-3 px-2 text-center">{lang === 'ar' ? 'النقاط' : 'Pts'}</th>
            <th class="py-3 px-2 text-center hidden sm:table-cell" title={lang === 'ar' ? 'توقعات دقيقة' : 'Exact'}>
              {lang === 'ar' ? 'دقيقة' : '3pts'}
            </th>
            <th class="py-3 px-2 text-center hidden sm:table-cell" title={lang === 'ar' ? 'نتائج صحيحة' : 'Correct'}>
              {lang === 'ar' ? 'صحيحة' : '2pts'}
            </th>
            <th class="py-3 px-2 text-center hidden sm:table-cell">{lang === 'ar' ? 'خاطئة' : 'Miss'}</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => {
            const isCurrentUser = entry.user_id === currentUserId;
            return (
              <tr
                class={`border-b border-gray-800/50 transition-colors ${
                  isCurrentUser ? 'bg-primary/20 border-primary/40' : 'hover:bg-gray-800/30'
                }`}
              >
                <td class="py-3 px-2">
                  <span class={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                    entry.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                    entry.rank === 2 ? 'bg-gray-400/20 text-gray-300' :
                    entry.rank === 3 ? 'bg-orange-500/20 text-orange-400' :
                    'text-gray-500'
                  }`}>
                    {entry.rank}
                  </span>
                </td>
                <td class="py-3 px-2">
                  <span class="font-semibold text-white">{entry.display_name || `User#${entry.user_id}`}</span>
                </td>
                <td class="py-3 px-2 text-gray-400 hidden md:table-cell">
                  {entry.department || '—'}
                </td>
                <td class="py-3 px-2 text-center">
                  <span class="text-lg font-bold text-accent">{entry.total_points}</span>
                </td>
                <td class="py-3 px-2 text-center text-green-400 hidden sm:table-cell">
                  {entry.exact_predictions}
                </td>
                <td class="py-3 px-2 text-center text-yellow-400 hidden sm:table-cell">
                  {entry.correct_outcomes}
                </td>
                <td class="py-3 px-2 text-center text-red-400 hidden sm:table-cell">
                  {entry.wrong_predictions}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {entries.length === 0 && (
        <p class="text-center text-gray-500 py-8">
          {lang === 'ar' ? 'لا يوجد مشاركون بعد' : 'No participants yet'}
        </p>
      )}
    </div>
  );
};

export default Leaderboard;

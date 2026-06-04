import { FC } from 'hono/jsx';
import Layout from '../layout';
import { SessionPayload } from '../../lib/auth';

interface AdminMatchesPageProps {
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
    actual_home_score: number | null;
    actual_away_score: number | null;
    is_finished: number;
  }>;
  tab?: 'matches' | 'users';
  users?: Array<{
    id: number;
    username: string;
    display_name: string | null;
    department: string | null;
    is_admin: number;
    prediction_count: number;
    total_points: number;
  }>;
  message?: string;
  error?: string;
}

const AdminPage: FC<AdminMatchesPageProps> = ({ lang, session, matches, tab, users, message, error }) => {
  const activeTab = tab || 'matches';

  return (
    <Layout lang={lang} session={session} title={lang === 'ar' ? 'لوحة الإدارة' : 'Admin Panel'}>
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-white">
          {lang === 'ar' ? 'لوحة الإدارة' : 'Admin Panel'}
        </h2>
        <p class="text-gray-400 text-sm">
          {lang === 'ar' ? 'إدارة المباريات والمستخدمين' : 'Manage matches and users'}
        </p>
      </div>

      <div class="flex gap-2 mb-6">
        <a
          href="/admin/matches"
          class={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === 'matches'
              ? 'bg-primary text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          ⚽ {lang === 'ar' ? 'المباريات' : 'Matches'}
        </a>
        <a
          href="/admin/users"
          class={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === 'users'
              ? 'bg-primary text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          👥 {lang === 'ar' ? 'المستخدمين' : 'Users'}
        </a>
      </div>

      {message && (
        <div class="bg-green-600/20 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg mb-4 text-sm">{message}</div>
      )}
      {error && (
        <div class="bg-red-600/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>
      )}

      {activeTab === 'matches' && (
        <div class="overflow-x-auto bg-gray-900/60 border border-gray-800 rounded-xl">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-800 text-gray-400 text-xs uppercase">
                <th class="py-3 px-3 text-start">#</th>
                <th class="py-3 px-3 text-start">{lang === 'ar' ? 'المباراة' : 'Match'}</th>
                <th class="py-3 px-3 text-start hidden md:table-cell">{lang === 'ar' ? 'المرحلة' : 'Stage'}</th>
                <th class="py-3 px-3 text-center">{lang === 'ar' ? 'النتيجة' : 'Score'}</th>
                <th class="py-3 px-3 text-center">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                <th class="py-3 px-3 text-center">{lang === 'ar' ? 'إجراء' : 'Action'}</th>
              </tr>
            </thead>
            <tbody>
              {matches.map(m => (
                <tr class="border-b border-gray-800/50 hover:bg-gray-800/30" key={m.id}>
                  <td class="py-3 px-3 text-gray-500">{m.match_number}</td>
                  <td class="py-3 px-3">
                    <span class="text-white">{m.home_team}</span>
                    <span class="text-gray-600 mx-1">vs</span>
                    <span class="text-white">{m.away_team}</span>
                  </td>
                  <td class="py-3 px-3 text-gray-400 hidden md:table-cell">{m.stage}</td>
                  <td class="py-3 px-3 text-center">
                    {m.is_finished === 1 ? (
                      <span class="font-bold text-accent">{m.actual_home_score} : {m.actual_away_score}</span>
                    ) : (
                      <span class="text-gray-600">{lang === 'ar' ? '—' : '—'}</span>
                    )}
                  </td>
                  <td class="py-3 px-3 text-center">
                    {m.is_finished === 1 ? (
                      <span class="text-green-400 text-xs">{lang === 'ar' ? 'مكتملة' : 'Done'}</span>
                    ) : new Date(m.match_datetime) <= new Date() ? (
                      <span class="text-yellow-400 text-xs">{lang === 'ar' ? 'مقفولة' : 'Live'}</span>
                    ) : (
                      <span class="text-blue-400 text-xs">{lang === 'ar' ? 'قادمة' : 'Upcoming'}</span>
                    )}
                  </td>
                  <td class="py-3 px-3 text-center">
                    {m.is_finished === 0 && new Date(m.match_datetime) <= new Date() && (
                      <form action="/admin/finalize" method="post" class="flex items-center gap-1 justify-center">
                        <input type="hidden" name="match_id" value={m.id} />
                        <input type="number" name="home_score" min="0" max="30" required
                          class="w-10 h-8 text-center bg-gray-800 border border-gray-700 rounded text-white text-xs" />
                        <span class="text-gray-600">:</span>
                        <input type="number" name="away_score" min="0" max="30" required
                          class="w-10 h-8 text-center bg-gray-800 border border-gray-700 rounded text-white text-xs" />
                        <button type="submit"
                          class="bg-primary hover:bg-green-700 text-white px-2 py-1 text-xs rounded transition-colors">
                          {lang === 'ar' ? 'اعتماد' : 'Finalize'}
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'users' && users && (
        <div class="overflow-x-auto bg-gray-900/60 border border-gray-800 rounded-xl">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-800 text-gray-400 text-xs uppercase">
                <th class="py-3 px-3 text-start">ID</th>
                <th class="py-3 px-3 text-start">{lang === 'ar' ? 'المستخدم' : 'User'}</th>
                <th class="py-3 px-3 text-start hidden md:table-cell">{lang === 'ar' ? 'القسم' : 'Dept'}</th>
                <th class="py-3 px-3 text-center">{lang === 'ar' ? 'النقاط' : 'Pts'}</th>
                <th class="py-3 px-3 text-center">{lang === 'ar' ? 'توقعات' : 'Preds'}</th>
                <th class="py-3 px-3 text-center">Admin</th>
                <th class="py-3 px-3 text-center">{lang === 'ar' ? 'إجراء' : 'Action'}</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr class="border-b border-gray-800/50 hover:bg-gray-800/30" key={u.id}>
                  <td class="py-3 px-3 text-gray-500">{u.id}</td>
                  <td class="py-3 px-3">
                    <span class="text-white">{u.display_name || u.username}</span>
                    <span class="text-gray-500 text-xs block">@{u.username}</span>
                  </td>
                  <td class="py-3 px-3 text-gray-400 hidden md:table-cell">{u.department || '—'}</td>
                  <td class="py-3 px-3 text-center text-accent font-bold">{u.total_points}</td>
                  <td class="py-3 px-3 text-center text-gray-400">{u.prediction_count}</td>
                  <td class="py-3 px-3 text-center">
                    {u.is_admin === 1 ? (
                      <span class="text-yellow-400 text-xs">✓</span>
                    ) : (
                      <span class="text-gray-600 text-xs">—</span>
                    )}
                  </td>
                  <td class="py-3 px-3 text-center">
                    <div class="flex items-center gap-1 justify-center">
                      <form action="/admin/reset-password" method="post" class="inline">
                        <input type="hidden" name="user_id" value={u.id} />
                        <button type="submit"
                          class="bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-400 px-2 py-1 text-xs rounded transition-colors"
                          onclick="return confirm('{lang === 'ar' ? 'إعادة تعيين كلمة المرور؟' : 'Reset password?'}')">
                          {lang === 'ar' ? 'إعادة كلمة المرور' : 'Reset Pwd'}
                        </button>
                      </form>
                      <form action="/admin/toggle-admin" method="post" class="inline">
                        <input type="hidden" name="user_id" value={u.id} />
                        <button type="submit"
                          class="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 px-2 py-1 text-xs rounded transition-colors">
                          {u.is_admin === 1
                            ? (lang === 'ar' ? 'إزالة المشرف' : 'Remove Admin')
                            : (lang === 'ar' ? 'تعيين مشرف' : 'Make Admin')}
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default AdminPage;

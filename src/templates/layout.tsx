import { FC, Child } from 'hono/jsx';
import { getLang, t, SessionPayload } from '../lib/auth';

interface LayoutProps {
  children: Child;
  lang?: 'ar' | 'en';
  session?: SessionPayload | null;
  title?: string;
}

const Layout: FC<LayoutProps> = ({ children, lang: langProp, session, title }) => {
  const lang = langProp || 'ar';
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={lang} dir={dir}>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title || 'Marshad Predict | مرشد بريدكت'} — FIFA World Cup 2026™</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script>{`
          tailwind.config = {
            darkMode: 'class',
            theme: {
              extend: {
                colors: {
                  primary: '#006847',
                  accent: '#C8A84B',
                  darkbg: '#0A1628',
                }
              }
            }
          }
        `}</script>
        <style>{`
          body { font-family: system-ui, -apple-system, sans-serif; }
          .lang-ar body, .lang-ar { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; }
          @media (prefers-color-scheme: dark) {
            .auto-dark { background-color: #0A1628; color: #e2e8f0; }
          }
        `}</style>
      </head>
      <body class="bg-darkbg text-gray-100 min-h-screen">
        <header class="bg-gradient-to-r from-primary to-green-800 shadow-lg">
          <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-2">
            <div class="flex items-center gap-3">
              <span class="text-2xl">⚽</span>
              <h1 class="text-lg md:text-xl font-bold text-white">
                {lang === 'ar' ? 'مرشد بريدكت' : 'Marshad Predict'}
                <span class="text-accent text-sm block md:inline md:text-lg md:me-2">
                  {lang === 'ar' ? '— توقعات كأس العالم 2026' : '— FIFA World Cup 2026™'}
                </span>
              </h1>
            </div>

            <nav class="flex items-center gap-2 flex-wrap">
              {session ? (
                <>
                  <a href="/dashboard" class="text-white hover:text-accent px-2 py-1 text-sm rounded transition-colors">
                    {lang === 'ar' ? 'الرئيسية' : 'Dashboard'}
                  </a>
                  <a href="/fixtures" class="text-white hover:text-accent px-2 py-1 text-sm rounded transition-colors">
                    {lang === 'ar' ? 'المباريات' : 'Fixtures'}
                  </a>
                  <a href="/my-predictions" class="text-white hover:text-accent px-2 py-1 text-sm rounded transition-colors">
                    {lang === 'ar' ? 'توقعاتي' : 'My Picks'}
                  </a>
                  <a href="/leaderboard" class="text-white hover:text-accent px-2 py-1 text-sm rounded transition-colors">
                    {lang === 'ar' ? 'الترتيب' : 'Leaderboard'}
                  </a>
                  {session.isAdmin === 1 && (
                    <a href="/admin/matches" class="text-accent hover:text-yellow-300 px-2 py-1 text-sm rounded border border-accent transition-colors">
                      {lang === 'ar' ? 'الإدارة' : 'Admin'}
                    </a>
                  )}
                  <a href="/logout" class="text-red-300 hover:text-red-100 px-2 py-1 text-sm rounded transition-colors">
                    {lang === 'ar' ? 'خروج' : 'Logout'}
                  </a>
                </>
              ) : (
                <>
                  <a href="/login" class="text-white hover:text-accent px-2 py-1 text-sm rounded transition-colors">
                    {lang === 'ar' ? 'دخول' : 'Login'}
                  </a>
                  <a href="/register" class="bg-accent text-darkbg hover:bg-yellow-400 px-3 py-1 text-sm rounded font-semibold transition-colors">
                    {lang === 'ar' ? 'تسجيل' : 'Register'}
                  </a>
                </>
              )}

              <form action="/lang" method="post" class="inline">
                <input type="hidden" name="lang" value={lang === 'ar' ? 'en' : 'ar'} />
                <button type="submit" class="ms-2 bg-white/10 hover:bg-white/20 text-white px-2 py-1 text-xs rounded transition-colors">
                  {lang === 'ar' ? 'EN' : 'AR'}
                </button>
              </form>
            </nav>
          </div>
        </header>

        <main class="max-w-7xl mx-auto px-4 py-6">
          {children}
        </main>

        <footer class="text-center text-gray-500 text-xs py-4 border-t border-gray-800">
          <p>{lang === 'ar' ? '© 2026 مجموعة المرشد القابضة — جميع الحقوق محفوظة' : '© 2026 Almarshad Holding Group — All Rights Reserved'}</p>
        </footer>
      </body>
    </html>
  );
};

export default Layout;

import { FC, Child } from 'hono/jsx';
import { SessionPayload } from '../lib/auth';

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
                  'primary-light': '#008a5e',
                  'primary-dark': '#004d34',
                  accent: '#D4A843',
                  'accent-light': '#e8c56a',
                  darkbg: '#0B1A2E',
                  'card-bg': '#112240',
                  'card-border': '#1d3557',
                }
              }
            }
          }
        `}</script>
        <style>{`
          body {
            font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
            background-color: #0B1A2E;
            color: #e2e8f0;
          }
          [dir="rtl"] body, [dir="rtl"] {
            font-family: 'Segoe UI', system-ui, -apple-system, Roboto, sans-serif;
          }
          input, select, button { font-family: inherit; }
        `}</style>
      </head>
      <body class="min-h-screen flex flex-col">
        <header class="bg-gradient-to-r from-primary via-primary to-primary-dark shadow-xl border-b border-primary/30">
          <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-2">
            <a href={session ? '/dashboard' : '/'} class="flex items-center gap-3 no-underline">
              <span class="text-3xl drop-shadow-lg">⚽</span>
              <div>
                <h1 class="text-lg md:text-xl font-bold text-white drop-shadow-sm">
                  {lang === 'ar' ? 'مرشد بريدكت' : 'Marshad Predict'}
                </h1>
                <span class="text-accent text-xs md:text-sm block -mt-1">
                  {lang === 'ar' ? 'توقعات كأس العالم 2026' : 'FIFA World Cup 2026™ Predictions'}
                </span>
              </div>
            </a>

            <nav class="flex items-center gap-1 md:gap-2 flex-wrap">
              {session ? (
                <>
                  <a href="/dashboard" class="text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 text-sm rounded-lg transition-all">
                    {lang === 'ar' ? 'الرئيسية' : 'Dashboard'}
                  </a>
                  <a href="/fixtures" class="text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 text-sm rounded-lg transition-all">
                    {lang === 'ar' ? 'المباريات' : 'Fixtures'}
                  </a>
                  <a href="/my-predictions" class="text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 text-sm rounded-lg transition-all">
                    {lang === 'ar' ? 'توقعاتي' : 'My Picks'}
                  </a>
                  <a href="/leaderboard" class="text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 text-sm rounded-lg transition-all">
                    {lang === 'ar' ? 'الترتيب' : 'Leaderboard'}
                  </a>
                  {session.isAdmin === 1 && (
                    <a href="/admin/matches" class="text-accent hover:text-accent-light hover:bg-accent/10 px-3 py-2 text-sm rounded-lg border border-accent/40 transition-all">
                      {lang === 'ar' ? 'الإدارة' : 'Admin'}
                    </a>
                  )}
                  <a href="/logout" class="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-2 text-sm rounded-lg transition-all">
                    {lang === 'ar' ? 'خروج' : 'Logout'}
                  </a>
                </>
              ) : (
                <>
                  <a href="/login" class="text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 text-sm rounded-lg transition-all">
                    {lang === 'ar' ? 'دخول' : 'Login'}
                  </a>
                  <a href="/register" class="bg-accent text-darkbg hover:bg-accent-light px-4 py-2 text-sm rounded-lg font-bold shadow-lg transition-all">
                    {lang === 'ar' ? 'تسجيل' : 'Register'}
                  </a>
                </>
              )}

              <form action="/lang" method="post" class="inline me-1">
                <input type="hidden" name="lang" value={lang === 'ar' ? 'en' : 'ar'} />
                <button type="submit" class="bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white px-2.5 py-1.5 text-xs rounded-lg border border-white/10 transition-all">
                  {lang === 'ar' ? 'EN' : 'AR'}
                </button>
              </form>
            </nav>
          </div>
        </header>

        <main class="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
          {children}
        </main>

        <footer class="text-center text-gray-500 text-xs py-4 border-t border-card-border mt-auto">
          <p>{lang === 'ar' ? '© 2026 مجموعة المرشد القابضة — جميع الحقوق محفوظة' : '© 2026 Almarshad Holding Group — All Rights Reserved'}</p>
        </footer>
      </body>
    </html>
  );
};

export default Layout;

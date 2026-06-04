import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Env } from './lib/db';
import authRoutes from './routes/auth';
import fixturesRoutes from './routes/fixtures';
import predRoutes from './routes/predictions';
import leaderboardRoutes from './routes/leaderboard';
import dashboardRoutes from './routes/dashboard';
import adminRoutes from './routes/admin';

const app = new Hono<{ Bindings: Env }>();

// Security headers middleware
app.use('*', async (c, next) => {
  await next();
  c.res.headers.set('X-Content-Type-Options', 'nosniff');
  c.res.headers.set('X-Frame-Options', 'DENY');
  c.res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
});

// CORS
app.use('*', cors({
  origin: '*',
  credentials: true,
}));

// Mount all route modules
app.route('/', authRoutes);
app.route('/', fixturesRoutes);
app.route('/', predRoutes);
app.route('/', leaderboardRoutes);
app.route('/', dashboardRoutes);
app.route('/', adminRoutes);

// Root redirect
app.get('/', (c) => c.redirect('/dashboard', 302));

// 404 catch-all
app.notFound((c) => {
  const lang = (c.req.header('Cookie') || '').includes('lang=en') ? 'en' : 'ar';
  return c.html(
    <html lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <head><meta charset="UTF-8" /><title>404 — {lang === 'ar' ? 'غير موجود' : 'Not Found'}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <script>{`tailwind.config={darkMode:'class',theme:{extend:{colors:{primary:'#006847',accent:'#D4A843',darkbg:'#0B1A2E',}}}}`}</script>
      <style>{`body{font-family:system-ui,-apple-system,sans-serif;background:#0B1A2E;color:#e2e8f0;}`}</style></head>
      <body class="min-h-screen flex items-center justify-center px-4">
        <div class="text-center">
          <span class="text-6xl mb-4 block">⚽</span>
          <div class="bg-[#112240] border border-[#1d3557] rounded-2xl p-8 max-w-md">
            <h1 class="text-5xl font-bold text-accent">404</h1>
            <p class="text-gray-400 mt-3 text-lg">
              {lang === 'ar' ? 'الصفحة غير موجودة' : 'Page not found'}
            </p>
            <a href="/dashboard" class="inline-block mt-6 bg-primary hover:bg-[#008a5e] text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg">
              {lang === 'ar' ? 'العودة للرئيسية' : 'Back to Dashboard'}
            </a>
          </div>
        </div>
      </body>
    </html>
  );
});

export default app;

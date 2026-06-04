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
      <script src="https://cdn.tailwindcss.com"></script></head>
      <body class="bg-darkbg text-white min-h-screen flex items-center justify-center">
        <div class="text-center">
          <span class="text-6xl">⚽</span>
          <h1 class="text-4xl font-bold mt-4">404</h1>
          <p class="text-gray-400 mt-2">
            {lang === 'ar' ? 'الصفحة غير موجودة' : 'Page not found'}
          </p>
          <a href="/dashboard" class="inline-block mt-6 bg-primary hover:bg-green-700 text-white px-6 py-2 rounded-lg">
            {lang === 'ar' ? 'العودة للرئيسية' : 'Back to Dashboard'}
          </a>
        </div>
      </body>
    </html>
  );
});

export default app;

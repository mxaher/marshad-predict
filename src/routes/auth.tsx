import { Hono } from 'hono';
import { getDB, Env } from '../lib/db';
import { users } from '../lib/db/schema';
import { eq } from 'drizzle-orm';
import {
  signSession,
  hashPassword,
  generateSalt,
  getLang,
  createSessionPayload,
  requireSession,
} from '../lib/auth';
import { checkRateLimit } from '../lib/rate-limit';
import LoginPage from '../templates/pages/Login';

const auth = new Hono<{ Bindings: Env }>();

auth.get('/login', async (c) => {
  const lang = getLang(c.req.header('Cookie') || null);
  return c.html(<LoginPage lang={lang} mode="login" />);
});

auth.post('/login', async (c) => {
  const lang = getLang(c.req.header('Cookie') || null);
  const ip = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown';
  if (!checkRateLimit(`login:${ip}`)) {
    return c.html(<LoginPage lang={lang} mode="login" error="Too many attempts. Please wait a minute." />);
  }

  const body = await c.req.parseBody();
  const username = (body.username as string || '').trim().toLowerCase();
  const password = body.password as string || '';

  if (!username || !password) {
    return c.html(<LoginPage lang={lang} mode="login" error="Username and password are required" />);
  }

  const db = getDB(c.env);
  const user = await db.select().from(users).where(eq(users.username, username)).get();

  if (!user) {
    return c.html(<LoginPage lang={lang} mode="login" error="Invalid username or password" />);
  }

  const pwHash = await hashPassword(password, user.password_salt);
  if (pwHash !== user.password_hash) {
    return c.html(<LoginPage lang={lang} mode="login" error="Invalid username or password" />);
  }

  const payload = createSessionPayload(user.id, user.is_admin ?? 0);
  const token = await signSession(payload, c.env.SESSION_SECRET);

  c.header('Set-Cookie', `session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${7 * 86400}`);
  return c.redirect('/dashboard', 302);
});

auth.get('/register', async (c) => {
  const lang = getLang(c.req.header('Cookie') || null);
  return c.html(<LoginPage lang={lang} mode="register" />);
});

auth.post('/register', async (c) => {
  const lang = getLang(c.req.header('Cookie') || null);
  const ip = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown';
  if (!checkRateLimit(`register:${ip}`)) {
    return c.html(<LoginPage lang={lang} mode="register" error="Too many attempts. Please wait a minute." />);
  }

  const body = await c.req.parseBody();
  const username = (body.username as string || '').trim().toLowerCase();
  const password = body.password as string || '';
  const displayName = (body.display_name as string || '').trim();
  const department = body.department as string || '';

  if (!username || !password || !displayName || !department) {
    return c.html(<LoginPage lang={lang} mode="register" error="All fields are required" />);
  }

  if (password.length < 6) {
    return c.html(<LoginPage lang={lang} mode="register" error="Password must be at least 6 characters" />);
  }

  const db = getDB(c.env);
  const existing = await db.select().from(users).where(eq(users.username, username)).get();
  if (existing) {
    return c.html(<LoginPage lang={lang} mode="register" error="Username already taken" />);
  }

  const salt = generateSalt();
  const pwHash = await hashPassword(password, salt);

  await db.insert(users).values({
    username,
    password_hash: pwHash,
    password_salt: salt,
    display_name: displayName,
    department,
    is_admin: 0,
    created_at: new Date().toISOString(),
  }).run();

  const created = await db.select().from(users).where(eq(users.username, username)).get();
  if (!created) {
    return c.html(<LoginPage lang={lang} mode="register" error="Registration failed" />);
  }

  const payload = createSessionPayload(created.id, 0);
  const token = await signSession(payload, c.env.SESSION_SECRET);

  c.header('Set-Cookie', `session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${7 * 86400}`);
  return c.redirect('/dashboard', 302);
});

auth.get('/logout', async (c) => {
  const db = getDB(c.env);
  const session = await requireSession(c.req.header('Cookie'), c.env.SESSION_SECRET, c.env);
  if (session) {
    await db.update(users)
      .set({ last_logout_at: new Date().toISOString() })
      .where(eq(users.id, session.userId))
      .run();
  }
  c.header('Set-Cookie', 'session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
  return c.redirect('/login', 302);
});

auth.post('/lang', async (c) => {
  const body = await c.req.parseBody();
  const lang = body.lang === 'en' ? 'en' : 'ar';
  const referer = c.req.header('Referer') || '/';
  c.header('Set-Cookie', `lang=${lang}; Path=/; Max-Age=${365 * 86400}`);
  return c.redirect(referer, 302);
});

export default auth;

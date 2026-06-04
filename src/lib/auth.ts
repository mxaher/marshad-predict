import { Env } from './db/index';
import { getDB } from './db/index';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';

export interface SessionPayload {
  userId: number;
  isAdmin: number;
  iat: number;
  exp: number;
}

export function createSessionPayload(userId: number, isAdmin: number): SessionPayload {
  return { userId, isAdmin, iat: Date.now(), exp: Date.now() + 7 * 86400000 };
}

function hexToUint8Array(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

function uint8ArrayToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function signSession(payload: SessionPayload, secret: string): Promise<string> {
  const data = JSON.stringify(payload);
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  const sigHex = uint8ArrayToHex(new Uint8Array(signature));
  const dataB64 = btoa(data);
  return `${dataB64}.${sigHex}`;
}

export async function verifySession(cookie: string | undefined, secret: string): Promise<SessionPayload | null> {
  if (!cookie) return null;
  const sess = cookie.startsWith('session=') ? cookie.slice(8) : cookie;
  const parts = sess.split('.');
  if (parts.length !== 2) return null;
  const [dataB64, sigHex] = parts;
  try {
    const data = atob(dataB64);
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      hexToUint8Array(sigHex),
      encoder.encode(data)
    );
    if (!valid) return null;
    const payload: SessionPayload = JSON.parse(data);
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function requireSession(cookie: string | undefined, secret: string, env: Env): Promise<SessionPayload | null> {
  const payload = await verifySession(cookie, secret);
  if (!payload) return null;

  const db = getDB(env);
  const user = await db.select({ last_logout_at: users.last_logout_at })
    .from(users)
    .where(eq(users.id, payload.userId))
    .get();
  if (!user) return null;
  if (user.last_logout_at && payload.iat < new Date(user.last_logout_at).getTime()) return null;

  return payload;
}

export async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const salted = encoder.encode(password + salt);
  const hash = await crypto.subtle.digest('SHA-256', salted);
  return uint8ArrayToHex(new Uint8Array(hash));
}

export function generateSalt(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return uint8ArrayToHex(bytes);
}

export function getLang(cookieHeader: string | null): 'ar' | 'en' {
  if (!cookieHeader) return 'ar';
  const match = cookieHeader.match(/lang=(\w+)/);
  if (match && (match[1] === 'en' || match[1] === 'ar')) return match[1] as 'ar' | 'en';
  return 'ar';
}

export function t(lang: 'ar' | 'en', ar: string, en: string): string {
  return lang === 'ar' ? ar : en;
}

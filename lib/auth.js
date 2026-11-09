import crypto from 'node:crypto';
import { cookies } from 'next/headers';

export const COOKIE = 'uj_admin';
const WEEK = 7 * 24 * 60 * 60 * 1000;

export function adminPassword() {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  return process.env.NODE_ENV !== 'production' ? 'admin123' : ''; // dev-only fallback
}
const secret = () => process.env.SESSION_SECRET || adminPassword() || 'dev-secret';
const sign = (p) => crypto.createHmac('sha256', secret()).update(p).digest('base64url');

export function makeToken() {
  const p = String(Date.now() + WEEK);
  return `${p}.${sign(p)}`;
}
export function verifyToken(t) {
  if (!t || !t.includes('.')) return false;
  const [p, sig] = t.split('.');
  const good = sign(p);
  if (sig.length !== good.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(good))) return false;
  return Number(p) > Date.now();
}
export function safeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}
export async function isAdmin() {
  const c = (await cookies()).get(COOKIE);
  return verifyToken(c?.value);
}
export const cookieOpts = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.COOKIE_SECURE ? process.env.COOKIE_SECURE === 'true' : process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: WEEK / 1000,
};

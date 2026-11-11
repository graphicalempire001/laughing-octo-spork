import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { getSetting } from '@/lib/settings';

export const COOKIE = 'uj_admin';
const WEEK = 7 * 24 * 60 * 60 * 1000;

// The first password comes from the ADMIN_PASSWORD env var. Once it is changed from the dashboard,
// a salted scrypt hash is stored (admin_settings) and takes over; the env value is then ignored.
export function adminPassword() {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  return process.env.NODE_ENV !== 'production' ? 'admin123' : ''; // dev-only fallback
}
const secret = () => process.env.SESSION_SECRET || adminPassword() || 'dev-secret';
const sign = (p) => crypto.createHmac('sha256', secret()).update(p).digest('base64url');

export function hashPassword(pw) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(String(pw), salt, 32, { N: 16384, r: 8, p: 1 });
  return `scrypt$${salt.toString('base64')}$${hash.toString('base64')}`;
}
function verifyHash(pw, stored) {
  const [alg, s, h] = String(stored).split('$');
  if (alg !== 'scrypt' || !s || !h) return false;
  const want = Buffer.from(h, 'base64');
  const got = crypto.scryptSync(String(pw), Buffer.from(s, 'base64'), want.length, { N: 16384, r: 8, p: 1 });
  return crypto.timingSafeEqual(got, want);
}
export function safeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

/** True if `pw` is the current staff password (stored hash first, env var until one has been saved). */
export async function checkPassword(pw) {
  if (!pw) return false;
  const stored = await getSetting('password_hash');
  if (stored) return verifyHash(pw, stored);
  const env = adminPassword();
  return Boolean(env) && safeEqual(pw, env);
}

// Token = expiry.epoch.signature. Changing the password bumps the epoch, which signs out every other device.
export const currentEpoch = async () => (await getSetting('session_epoch')) || '0';
export function makeToken(epoch = '0') {
  const p = `${Date.now() + WEEK}.${epoch}`;
  return `${p}.${sign(p)}`;
}
function parseToken(t) {
  const parts = String(t || '').split('.');
  if (parts.length !== 3) return null;
  const [exp, epoch, sig] = parts;
  const good = sign(`${exp}.${epoch}`);
  if (sig.length !== good.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(good))) return null;
  return Number(exp) > Date.now() ? { epoch } : null;
}
export async function isAdmin() {
  const c = (await cookies()).get(COOKIE);
  if (!c) return false; // public visitors never cost a settings lookup
  const t = parseToken(c.value);
  return Boolean(t) && t.epoch === (await currentEpoch());
}
export const cookieOpts = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.COOKIE_SECURE ? process.env.COOKIE_SECURE === 'true' : process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: WEEK / 1000,
};

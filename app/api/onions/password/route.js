import { NextResponse } from 'next/server';
import { checkPassword, cookieOpts, COOKIE, hashPassword, isAdmin, makeToken } from '@/lib/auth';
import { setSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

const fails = new Map();
const blocked = (ip) => {
  const now = Date.now();
  const l = (fails.get(ip) || []).filter((t) => now - t < 15 * 60 * 1000);
  fails.set(ip, l);
  return l.length >= 5;
};

const COMMON = ['password', '1234567890', 'qwertyuiop', 'ubuntujollof', 'ubuntu&jollof', 'jollofrice', 'admin12345'];
function weak(pw) {
  if (pw.length < 10) return 'New password must be at least 10 characters.';
  if (pw.length > 128) return 'New password is too long (max 128 characters).';
  if (new Set(pw).size < 5) return 'Please use a less repetitive password.';
  if (COMMON.some((c) => pw.toLowerCase().includes(c))) return 'That password is too easy to guess. Try a few random words.';
  if (pw.length < 14 && !(/[a-z]/i.test(pw) && /\d/.test(pw))) return 'Use letters and numbers, or make it 14+ characters long.';
  return '';
}

export async function POST(req) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 });
  const ip = (req.headers.get('x-forwarded-for') || 'local').split(',')[0].trim();
  if (blocked(ip)) return NextResponse.json({ error: 'Too many attempts. Try again in 15 minutes.' }, { status: 429 });
  const { current, next } = await req.json().catch(() => ({}));
  if (!(await checkPassword(current))) {
    fails.get(ip).push(Date.now());
    return NextResponse.json({ error: 'Your current password is wrong.' }, { status: 403 });
  }
  const pwNew = String(next ?? '');
  const why = weak(pwNew);
  if (why) return NextResponse.json({ error: why }, { status: 400 });
  if (pwNew === current) return NextResponse.json({ error: 'The new password must be different from the current one.' }, { status: 400 });
  const epoch = String(Date.now()); // new epoch = every other signed-in device is logged out
  try {
    await setSettings({ password_hash: hashPassword(pwNew), session_epoch: epoch });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, makeToken(epoch), cookieOpts); // keep THIS device signed in
  return res;
}

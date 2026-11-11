import { NextResponse } from 'next/server';
import { adminPassword, cookieOpts, COOKIE, makeToken, safeEqual } from '@/lib/auth';

const tries = new Map(); // ip -> [timestamps]; light brute-force guard
function limited(ip) {
  const now = Date.now();
  const list = (tries.get(ip) || []).filter((t) => now - t < 15 * 60 * 1000);
  tries.set(ip, list);
  return list.length >= 6;
}

export async function POST(req) {
  const ip = (req.headers.get('x-forwarded-for') || 'local').split(',')[0].trim();
  if (limited(ip)) return NextResponse.json({ error: 'Too many attempts. Try again in 15 minutes.' }, { status: 429 });
  const real = adminPassword();
  if (!real) return NextResponse.json({ error: 'ADMIN_PASSWORD is not set on the server.' }, { status: 500 });
  const { password } = await req.json().catch(() => ({}));
  if (!password || !safeEqual(password, real)) {
    tries.get(ip).push(Date.now());
    return NextResponse.json({ error: 'Wrong password.' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, makeToken(), cookieOpts);
  return res;
}

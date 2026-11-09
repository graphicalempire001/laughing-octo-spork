import { NextResponse } from 'next/server';
import { sb, usingSupabase } from '@/lib/store';

export const dynamic = 'force-dynamic';

// Best-effort order log: the customer's order always goes to WhatsApp; this just saves a copy in Supabase.
const hits = new Map();
const limited = (ip) => {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  arr.push(now); hits.set(ip, arr);
  if (hits.size > 500) hits.clear();
  return arr.length > 8;
};
const clean = (v, n) => String(v ?? '').trim().slice(0, n);

export async function POST(req) {
  if (!usingSupabase) return NextResponse.json({ ok: true, stored: false });
  const ip = (req.headers.get('x-forwarded-for') || 'x').split(',')[0].trim();
  if (limited(ip)) return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
  let b;
  try { b = await req.json(); } catch { return NextResponse.json({ error: 'Bad request.' }, { status: 400 }); }
  const items = Array.isArray(b.items) ? b.items.slice(0, 60).map((i) => ({ id: clean(i.id, 60), name: clean(i.name, 80), price: Math.max(0, Number(i.price) || 0), qty: Math.min(99, Math.max(1, Math.round(Number(i.qty) || 1))) })) : [];
  const name = clean(b.name, 80);
  if (!name || !items.length) return NextResponse.json({ error: 'Incomplete order.' }, { status: 400 });
  const total = Math.round(items.reduce((t, i) => t + i.price * i.qty, 0) * 100) / 100;
  const { error } = await sb().from('orders').insert({
    customer_name: name, mode: b.mode === 'Delivery' ? 'Delivery' : 'Pickup',
    address: clean(b.address, 300), notes: clean(b.notes, 400), items, total,
  });
  if (error) return NextResponse.json({ error: 'Could not save.' }, { status: 500 });
  return NextResponse.json({ ok: true, stored: true });
}

import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';

// Set DATA_DIR to a persistent volume in production (e.g. /data on Railway/Render).
export const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'storage');
export const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');
const MENU_FILE = path.join(DATA_DIR, 'menu.json');

// ---------- Supabase (production) ----------
// Set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY and the menu lives in the `menu_items` table and
// images in the public `menu-images` Storage bucket (see supabase/schema.sql). Without them the site
// falls back to local files (handy for development).
const SB_URL = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const BUCKET = process.env.SUPABASE_BUCKET || 'menu-images';
export const usingSupabase = Boolean(SB_URL && SB_KEY);
let _sb;
export const sb = () => (_sb ||= createClient(SB_URL, SB_KEY, { auth: { persistSession: false, autoRefreshToken: false } }));
const PUBLIC_PREFIX = `${SB_URL}/storage/v1/object/public/${BUCKET}/`;

const fromRow = (r) => ({ id: r.id, name: r.name, description: r.description || '', price: Number(r.price), category: r.category, tag: r.tag || '', available: r.available !== false, img: r.img || '' });
const COLS = ['name', 'description', 'price', 'category', 'tag', 'available', 'img'];
const toRow = (o) => Object.fromEntries(Object.entries(o).filter(([k, v]) => COLS.includes(k) && v !== undefined));
const fail = (e) => { if (e) throw new Error(e.message || 'Database error'); };

const seed = [
  { id: 'seed-yam-egg', name: 'Fried Yam & Egg Sauce', description: 'Golden fried yam with spicy egg sauce, peppers and crispy fried fish.', price: 79, category: 'Breakfast', tag: 'Local favourite', available: true, img: '/menu/yam-egg.webp' },
  { id: 'seed-native-soup', name: 'Native Soup with Eba', description: 'Rich native soup with greens, assorted meat and ponmo, served with a soft ball of eba.', price: 109, category: 'African', tag: 'Chef’s Pick', available: true, img: '/menu/native-soup.webp' },
  { id: 'seed-noodles-fish', name: 'Noodles & Sauced Fish', description: 'Spicy stir-fried noodles with peppers, topped with golden fish in onion and tomato sauce.', price: 99, category: 'Chinese', tag: '', available: true, img: '/menu/noodles-fish.webp' },
  { id: 'seed-rice-chicken', name: 'Yellow Rice & Chicken', description: 'Fragrant yellow rice with tender chicken, potato and sweet peppers in a light broth.', price: 95, category: 'African', tag: 'Budget friendly', available: true, img: '/menu/rice-chicken.webp' },
  { id: 'seed-burger', name: 'Cheese Chicken Burger & Wings', description: 'Grilled chicken burger with cheese and fresh salad, plus crispy fried chicken on the side.', price: 109, category: 'Fast Food', tag: 'Popular', available: true, img: '/hero/fast-food.webp' },
  { id: 'seed-pizza', name: 'Chicken Fajita Pizza', description: 'Flame-baked pizza with spiced chicken, peppers, sweetcorn and onions under golden mozzarella.', price: 129, category: 'Pizzeria', tag: 'Bestseller', available: true, img: '/hero/pizza.webp' },
  { id: 'seed-breakfast', name: 'Full Breakfast Plate', description: 'Grilled sausages, crispy bacon, scrambled eggs, baked beans, tomato and toasted bread.', price: 89, category: 'Breakfast', tag: '', available: true, img: '/hero/breakfast.webp' },
  { id: 'seed-chinese', name: 'Chicken Noodle Stir-fry', description: 'Wok-fired noodles with chicken, egg, peppers and spring onion.', price: 99, category: 'Chinese', tag: '', available: true, img: '/hero/chinese.webp' },
  { id: 'seed-african', name: 'African Greens & Fried Chicken', description: 'Rich sautéed greens with golden fried chicken and fish, served with a soft swallow.', price: 119, category: 'African', tag: '', available: true, img: '/hero/african.webp' },
  { id: 'seed-bakery', name: 'Raisin Loaf', description: 'Fresh-baked raisin loaf, soft inside with a golden crust. Sliced and warm.', price: 45, category: 'Bakery', tag: '', available: true, img: '/hero/bakery.webp' },
];

let lock = Promise.resolve();
const withLock = (fn) => {
  const next = lock.then(fn);
  lock = next.catch(() => {});
  return next;
};

async function ensure() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  try { await fs.access(MENU_FILE); }
  catch { await fs.writeFile(MENU_FILE, JSON.stringify(seed, null, 2)); }
}
async function read() {
  await ensure();
  return JSON.parse(await fs.readFile(MENU_FILE, 'utf8'));
}
async function write(list) {
  const tmp = MENU_FILE + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(list, null, 2));
  await fs.rename(tmp, MENU_FILE);
}

export async function getMenu() {
  if (!usingSupabase) return read();
  const { data, error } = await sb().from('menu_items').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: true });
  fail(error);
  return data.map(fromRow);
}

/** Any upload becomes a compact WebP (max 1100px, quality 74). */
export async function saveImage(buffer) {
  const out = await sharp(buffer, { failOn: 'none' })
    .rotate()
    .resize({ width: 1100, height: 1100, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 74, effort: 5 })
    .toBuffer();
  const name = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}.webp`;
  if (usingSupabase) {
    const { error } = await sb().storage.from(BUCKET).upload(name, out, { contentType: 'image/webp', cacheControl: '31536000', upsert: false });
    fail(error);
    return { src: sb().storage.from(BUCKET).getPublicUrl(name).data.publicUrl, bytes: out.length };
  }
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, name), out);
  return { src: `/api/img/${name}`, bytes: out.length };
}
async function removeImage(src) {
  if (usingSupabase) {
    if (src && src.startsWith(PUBLIC_PREFIX)) await sb().storage.from(BUCKET).remove([decodeURIComponent(src.slice(PUBLIC_PREFIX.length))]);
    return;
  }
  if (!src || !src.startsWith('/api/img/')) return; // never delete the bundled hero images
  const name = path.basename(src);
  if (!/^[a-z0-9-]+\.webp$/i.test(name)) return;
  await fs.rm(path.join(UPLOAD_DIR, name), { force: true });
}
export const readUpload = (name) => fs.readFile(path.join(UPLOAD_DIR, name));

export function createItem(data) {
  if (usingSupabase) return createSb(data);
  return withLock(async () => {
    const list = await read();
    const item = { id: crypto.randomUUID(), ...data };
    list.push(item);
    await write(list);
    return item;
  });
}
export function updateItem(id, patch) {
  if (usingSupabase) return updateSb(id, patch);
  return withLock(async () => {
    const list = await read();
    const i = list.findIndex((x) => x.id === id);
    if (i < 0) return null;
    const old = list[i];
    list[i] = { ...old, ...patch };
    await write(list);
    if (patch.img && patch.img !== old.img) await removeImage(old.img);
    return list[i];
  });
}
export function deleteItem(id) {
  if (usingSupabase) return deleteSb(id);
  return withLock(async () => {
    const list = await read();
    const item = list.find((x) => x.id === id);
    if (!item) return false;
    await write(list.filter((x) => x.id !== id));
    await removeImage(item.img);
    return true;
  });
}

// ---- Supabase versions of create / update / delete ----
async function createSb(data) {
  const { data: last } = await sb().from('menu_items').select('sort_order').order('sort_order', { ascending: false }).limit(1);
  const sort_order = (last?.[0]?.sort_order || 0) + 1;
  const { data: row, error } = await sb().from('menu_items').insert({ ...toRow(data), sort_order }).select().single();
  fail(error);
  return fromRow(row);
}
async function updateSb(id, patch) {
  const { data: old } = await sb().from('menu_items').select('img').eq('id', id).maybeSingle();
  if (!old) return null;
  const { data: row, error } = await sb().from('menu_items').update(toRow(patch)).eq('id', id).select().maybeSingle();
  fail(error);
  if (!row) return null;
  if (patch.img && patch.img !== old.img) await removeImage(old.img);
  return fromRow(row);
}
async function deleteSb(id) {
  const { data: old } = await sb().from('menu_items').select('img').eq('id', id).maybeSingle();
  if (!old) return false;
  const { error } = await sb().from('menu_items').delete().eq('id', id);
  fail(error);
  await removeImage(old.img);
  return true;
}

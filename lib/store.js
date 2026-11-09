import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

// Set DATA_DIR to a persistent volume in production (e.g. /data on Railway/Render).
export const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'storage');
export const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');
const MENU_FILE = path.join(DATA_DIR, 'menu.json');

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

export const getMenu = () => read();

/** Any upload becomes a compact WebP (max 1100px, quality 74). */
export async function saveImage(buffer) {
  const out = await sharp(buffer, { failOn: 'none' })
    .rotate()
    .resize({ width: 1100, height: 1100, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 74, effort: 5 })
    .toBuffer();
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const name = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}.webp`;
  await fs.writeFile(path.join(UPLOAD_DIR, name), out);
  return { src: `/api/img/${name}`, bytes: out.length };
}
async function removeImage(src) {
  if (!src || !src.startsWith('/api/img/')) return; // never delete the bundled hero images
  const name = path.basename(src);
  if (!/^[a-z0-9-]+\.webp$/i.test(name)) return;
  await fs.rm(path.join(UPLOAD_DIR, name), { force: true });
}
export const readUpload = (name) => fs.readFile(path.join(UPLOAD_DIR, name));

export function createItem(data) {
  return withLock(async () => {
    const list = await read();
    const item = { id: crypto.randomUUID(), ...data };
    list.push(item);
    await write(list);
    return item;
  });
}
export function updateItem(id, patch) {
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
  return withLock(async () => {
    const list = await read();
    const item = list.find((x) => x.id === id);
    if (!item) return false;
    await write(list.filter((x) => x.id !== id));
    await removeImage(item.img);
    return true;
  });
}

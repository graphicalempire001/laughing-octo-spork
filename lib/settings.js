import fs from 'node:fs/promises';
import path from 'node:path';
import { DATA_DIR, sb, usingSupabase } from '@/lib/store';

// Tiny key/value store for staff settings (hashed password, session epoch).
// Supabase: table `admin_settings` (see supabase/schema.sql). Local fallback: DATA_DIR/settings.json.
const FILE = path.join(DATA_DIR, 'settings.json');

export async function getSetting(key) {
  try {
    if (usingSupabase) {
      const { data, error } = await sb().from('admin_settings').select('value').eq('key', key).maybeSingle();
      if (error) return null; // table not created yet: behave as "no stored value"
      return data?.value ?? null;
    }
    return JSON.parse(await fs.readFile(FILE, 'utf8'))[key] ?? null;
  } catch {
    return null;
  }
}

export async function setSettings(obj) {
  if (usingSupabase) {
    const rows = Object.entries(obj).map(([key, value]) => ({ key, value: String(value), updated_at: new Date().toISOString() }));
    const { error } = await sb().from('admin_settings').upsert(rows, { onConflict: 'key' });
    if (error) throw new Error('Could not save. Run the latest supabase/schema.sql in the Supabase SQL Editor (it adds the admin_settings table).');
    return;
  }
  let cur = {};
  try { cur = JSON.parse(await fs.readFile(FILE, 'utf8')); } catch {}
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = FILE + '.tmp';
  await fs.writeFile(tmp, JSON.stringify({ ...cur, ...obj }, null, 2));
  await fs.rename(tmp, FILE);
}

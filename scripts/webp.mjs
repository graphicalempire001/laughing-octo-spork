// Converts every .jpg/.jpeg/.png in public/assets and public/hero to a compact .webp
// next to the original (skips files that already have an up-to-date .webp).
// Runs automatically before `npm run dev` and `npm run build`.
import fs from 'node:fs';
import path from 'node:path';

const dirs = ['public/assets', 'public/hero'];
const MAX_WIDTH = 1440;
const QUALITY = 50;

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.log('[webp] sharp not installed, skipping image conversion.');
  process.exit(0);
}

let converted = 0;
for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir)) {
    if (!/\.(jpe?g|png)$/i.test(file)) continue;
    const src = path.join(dir, file);
    const out = path.join(dir, file.replace(/\.(jpe?g|png)$/i, '.webp'));
    if (fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(src).mtimeMs) continue;
    await sharp(src)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 6 })
      .toFile(out);
    const kb = Math.round(fs.statSync(out).size / 1024);
    console.log(`[webp] ${src} -> ${out} (${kb} KB)`);
    converted++;
  }
}
if (!converted) console.log('[webp] nothing to convert.');

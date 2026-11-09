# Ubuntu & Jollof — Taste of Togetherness
4 Paris Avenue, Bordeaux, Randburg · +27 71 064 0654 · prices in Rands

Next.js 15 (app router). Pages: / (home), /menu, /order, /about, /kids, /contact, /admin.

## Run
    npm install
    cp .env.example .env.local   # set ADMIN_PASSWORD (and SESSION_SECRET)
    npm run build && npm start   # or npm run dev

## Features
- Hero slides (6 WebP images, soft zoom); the chef card climbs over the static hero on scroll.
- Promo flyers are tiny videos (public/promo/*.webm, ~285-430KB each, MP4 fallback, WebP poster). They download only when near the screen, play and loop while in view, pausing when scrolled away. Data-saver / reduced-motion visitors get a still image. Placement: chef (after hero), delivery (order), budget (menu), kids (kids section). Edges feather into the page.
- Tap a dish -> order list with red number badge (header, floating pill, drawer). Checkout sends the order to WhatsApp.
- Branded logo loader with adaptive aromatic steam (thickens as the page really loads, fewer wisps on weak phones), card sliders, 3D yellow buttons with press/pop, steam puff and "shhh" sound (toggle bottom-left).
- Admin at /admin: add, edit, hide, delete dishes; images auto-converted to WebP; Rand prices.

## Env vars
ADMIN_PASSWORD, SESSION_SECRET (optional), DATA_DIR (default ./storage), COOKIE_SECURE (set false only for plain-http testing).

## Hosting
Menu data and uploads are stored on disk (DATA_DIR). Use a host with a persistent volume (Railway, Render, VPS) and point DATA_DIR at it.
Vercel's filesystem is read-only: swap lib/store.js for Supabase/Firebase there.
Existing deployments keep their old menu.json; new seed dishes only appear on a fresh storage folder.

## Replacing a flyer video
Encode to ~840-960px wide, no audio: `ffmpeg -i in.mp4 -an -vf fps=20,scale=960:-2 -c:v libvpx-vp9 -crf 47 -b:v 0 name.webm` (+ an H.264 `name.mp4` and `name-poster.webp` / `name-end.webp`), and drop them in public/promo.

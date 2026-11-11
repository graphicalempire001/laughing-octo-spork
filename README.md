# Ubuntu & Jollof — Taste of Togetherness
4 Paris Avenue, Bordeaux, Randburg · +27 71 064 0654 · prices in Rands

Next.js 15 (app router). Pages: / (home), /menu, /order, /about, /kids, /contact, /onions.

## Run
    npm install
    cp .env.example .env.local   # set ADMIN_PASSWORD (and SESSION_SECRET)
    npm run build && npm start   # or npm run dev

## Features
- Hero slides (6 WebP images, soft zoom); the chef card climbs over the static hero on scroll.
- Promo flyers are tiny videos (public/promo/*.webm, ~285-430KB each, MP4 fallback, WebP poster). They download only when near the screen, play and loop while in view, pausing when scrolled away. Data-saver / reduced-motion visitors get a still image. Placement: chef (after hero), delivery (order), budget (menu), kids (kids section). Edges feather into the page.
- Tap a dish -> order list with red number badge (header, floating pill, drawer). Checkout sends the order to WhatsApp.
- Branded logo loader with adaptive aromatic steam (thickens as the page really loads, fewer wisps on weak phones), card sliders, 3D yellow buttons with press/pop, steam puff and "shhh" sound (toggle bottom-left).
- Admin at /onions: add, edit, hide, delete dishes; images auto-converted to WebP; Rand prices.

## Supabase setup (database + image storage)
1. Create a project at supabase.com.
2. Dashboard > SQL Editor > New query > paste all of `supabase/schema.sql` > Run. (Safe to re-run.) This creates:
   - `menu_items` (menu, prices in Rands) with Row Level Security: the public can only read available dishes.
   - `orders` (copy of every WhatsApp order; locked down, server-only).
   - the public Storage bucket `menu-images` (WebP only, 5 MB max) and 10 starter dishes.
3. Dashboard > Project Settings > API: copy the Project URL and the `service_role` key.
4. On your host set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`, `SESSION_SECRET`, `SITE_URL_OVERRIDE`.
   The service-role key is server-only. Never put it in client code or commit it.
5. Open /onions, sign in, and edit the starter dishes (names, prices, photos). Uploaded images are converted to WebP and stored in Supabase Storage.
Orders appear in Table Editor > `orders` (status: new / confirmed / done / cancelled).

Without the Supabase variables the site falls back to local files (`DATA_DIR`, default ./storage) so you can develop offline.

## Staff password
- First sign-in uses `ADMIN_PASSWORD` from your host settings.
- In /onions press **🔑 Password** to change it (current password + new one twice). The new password is stored as a salted scrypt hash in Supabase (`admin_settings`), the env value is then ignored, and every other signed-in device is logged out.
- If you ran the schema before this feature, run the latest `supabase/schema.sql` again (it adds the `admin_settings` table; safe to re-run).
- **Forgot it?** In Supabase SQL Editor run: `delete from public.admin_settings where key in ('password_hash','session_epoch');` then sign in with `ADMIN_PASSWORD` and set a new one.

## Env vars
SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_BUCKET (optional), ADMIN_PASSWORD, SESSION_SECRET (optional), SITE_URL_OVERRIDE (optional, only if you change domain), COOKIE_SECURE (set false only for plain-http testing), DATA_DIR (file fallback only).

## Hosting
With Supabase the app is stateless, so it runs on Vercel, Railway or Render. Build `npm run build`, start `npm start`.

## SEO & indexing
- The site address `https://ubuntujollof.online` is built in. Delete any old `SITE_URL_OVERRIDE` variable on your host (it is ignored now). Only set `SITE_URL_OVERRIDE` if you move domains.
- Auto-generated: `/sitemap.xml` (pages + image index + video index; new dishes from /onions appear in it), `/robots.txt` (blocks /api and /order; the staff page /onions is noindex and not listed anywhere), `/manifest.webmanifest`.
- Every page has its own title, description, canonical, Open Graph and Twitter tags; social share image is `public/ubuntu-jollof-logo.jpg`.
- Restaurant, Website and Menu structured data (JSON-LD) are included. Opening hours are left out on purpose until confirmed; add them to `app/layout.js` (`openingHoursSpecification`) when sure.
- After deploying: add the domain in Google Search Console and submit `https://ubuntujollof.online/sitemap.xml`; claim the Google Business Profile for 4 Paris Avenue, Bordeaux, Randburg.

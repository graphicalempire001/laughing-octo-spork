-- =====================================================================
--  Ubuntu & Jollof  -  Supabase schema
--  Paste this whole file into: Supabase Dashboard > SQL Editor > New query > Run
--  Safe to run more than once.
-- =====================================================================

-- ---------- 1. Menu ----------
create table if not exists public.menu_items (
  id          text primary key default gen_random_uuid()::text,
  name        text        not null check (char_length(name) between 1 and 80),
  description text        not null default '' check (char_length(description) <= 220),
  price       numeric(10,2) not null check (price >= 0 and price <= 100000),   -- Rands (ZAR)
  category    text        not null default 'African',
  tag         text        not null default '',                                  -- e.g. "Chef's Pick"
  available   boolean     not null default true,
  img         text        not null default '',                                  -- public image URL (WebP)
  sort_order  integer     not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists menu_items_list_idx on public.menu_items (available, sort_order, created_at);

-- keep updated_at fresh
create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists menu_items_updated_at on public.menu_items;
create trigger menu_items_updated_at before update on public.menu_items
for each row execute function public.set_updated_at();

-- Row Level Security: the public can only READ dishes that are available.
-- All writes go through the website's /onions API using the service-role key (which bypasses RLS).
alter table public.menu_items enable row level security;

drop policy if exists "Public can read available dishes" on public.menu_items;
create policy "Public can read available dishes"
  on public.menu_items for select
  to anon, authenticated
  using (available = true);

-- ---------- 2. Orders log (optional but handy: every WhatsApp order is also saved) ----------
create table if not exists public.orders (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  customer_name text        not null check (char_length(customer_name) between 1 and 80),
  mode          text        not null check (mode in ('Pickup', 'Delivery')),
  address       text        not null default '',
  notes         text        not null default '',
  items         jsonb       not null,                  -- [{id, name, price, qty}]
  total         numeric(10,2) not null check (total >= 0),
  status        text        not null default 'new' check (status in ('new', 'confirmed', 'done', 'cancelled'))
);

create index if not exists orders_created_idx on public.orders (created_at desc);

-- Locked down completely: only the server (service role) can insert or read orders.
alter table public.orders enable row level security;

-- ---------- 2b. Staff settings (hashed password + session epoch, written by the dashboard's "Change password") ----------
create table if not exists public.admin_settings (
  key        text primary key,
  value      text not null,
  updated_at timestamptz not null default now()
);
alter table public.admin_settings enable row level security;   -- no policies: only the server (service role) can touch it
-- FORGOT YOUR PASSWORD?  Run this one line, then sign in with the ADMIN_PASSWORD set on your host:
--   delete from public.admin_settings where key in ('password_hash', 'session_epoch');

-- ---------- 3. Image storage (public bucket, WebP only) ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('menu-images', 'menu-images', true, 5242880, array['image/webp'])
on conflict (id) do update
  set public = true, file_size_limit = 5242880, allowed_mime_types = array['image/webp'];

drop policy if exists "Public can view menu images" on storage.objects;
create policy "Public can view menu images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'menu-images');
-- (no insert/update/delete policies: uploads happen server-side with the service-role key)

-- ---------- 4. Starter dishes (placeholders - rename/re-price them in /onions) ----------
insert into public.menu_items (id, name, description, price, category, tag, available, img, sort_order) values
  ('seed-yam-egg',      'Fried Yam & Egg Sauce',          'Golden fried yam with spicy egg sauce, peppers and crispy fried fish.',                      79, 'Breakfast', 'Local favourite', true, '/menu/yam-egg.webp',      1),
  ('seed-native-soup',  'Native Soup with Eba',           'Rich native soup with greens, assorted meat and ponmo, served with a soft ball of eba.',    109, 'African',    'Chef''s Pick',    true, '/menu/native-soup.webp',  2),
  ('seed-noodles-fish', 'Noodles & Sauced Fish',          'Spicy stir-fried noodles with peppers, topped with golden fish in onion and tomato sauce.',  99, 'Chinese',   '',                true, '/menu/noodles-fish.webp', 3),
  ('seed-rice-chicken', 'Yellow Rice & Chicken',          'Fragrant yellow rice with tender chicken, potato and sweet peppers in a light broth.',       95, 'African',    'Budget friendly', true, '/menu/rice-chicken.webp', 4),
  ('seed-burger',       'Cheese Chicken Burger & Wings',  'Grilled chicken burger with cheese and fresh salad, plus crispy fried chicken on the side.', 109, 'Fast Food', 'Popular',         true, '/hero/fast-food.webp',    5),
  ('seed-pizza',        'Chicken Fajita Pizza',           'Flame-baked pizza with spiced chicken, peppers, sweetcorn and onions under golden mozzarella.',129, 'Pizzeria',  'Bestseller',      true, '/hero/pizza.webp',        6),
  ('seed-breakfast',    'Full Breakfast Plate',           'Grilled sausages, crispy bacon, scrambled eggs, baked beans, tomato and toasted bread.',     89, 'Breakfast', '',                true, '/hero/breakfast.webp',    7),
  ('seed-chinese',      'Chicken Noodle Stir-fry',        'Wok-fired noodles with chicken, egg, peppers and spring onion.',                             99, 'Chinese',   '',                true, '/hero/chinese.webp',      8),
  ('seed-african',      'African Greens & Fried Chicken', 'Rich sautéed greens with golden fried chicken and fish, served with a soft swallow.',        119, 'African',    '',                true, '/hero/african.webp',      9),
  ('seed-bakery',       'Raisin Loaf',                    'Fresh-baked raisin loaf, soft inside with a golden crust. Sliced and warm.',                 45, 'Bakery',    '',                true, '/hero/bakery.webp',      10)
on conflict (id) do nothing;

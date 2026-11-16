-- =====================================================================
-- Core schema. Run once in: Supabase Dashboard -> SQL Editor.
-- Then run 002_blueprint.sql (categories + the household base list).
-- =====================================================================

-- ---------- categories ----------
create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  position    int  not null default 0,          -- display order
  created_at  timestamptz not null default now()
);

-- ---------- shopping_items: the ACTIVE list ----------
create table public.shopping_items (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  category_id uuid references public.categories(id) on delete set null,
  quantity    text not null default '1',        -- text so "2 kg" / "x3" work
  checked     boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index shopping_items_category_idx on public.shopping_items (category_id);

-- ---------- favorites: frequently bought items ----------
create table public.favorites (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  category_id uuid references public.categories(id) on delete set null,
  quantity    text not null default '1',
  created_at  timestamptz not null default now()
);
create unique index favorites_name_unique on public.favorites (lower(name));

-- ---------- shopping_history: one row per item per finished trip ----------
-- Rows from the same trip share a session_id.
-- category_name is a snapshot so history survives category deletion/rename.
create table public.shopping_history (
  id            uuid primary key default gen_random_uuid(),
  session_id    uuid not null,
  name          text not null,
  quantity      text not null default '1',
  category_id   uuid references public.categories(id) on delete set null,
  category_name text,
  purchased_at  timestamptz not null default now()
);
create index shopping_history_session_idx   on public.shopping_history (session_id);
create index shopping_history_purchased_idx on public.shopping_history (purchased_at desc);

-- ---------- keep updated_at fresh ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger shopping_items_set_updated_at
  before update on public.shopping_items
  for each row execute function public.set_updated_at();

-- ---------- Row Level Security ----------
-- There is no login in this version: anyone holding your project URL + anon
-- key can read/write. That is fine for a private family app, but do not share
-- the deployed URL publicly. See README "Locking it down" to add auth later.
do $$
declare t text;
begin
  foreach t in array array['categories','shopping_items','favorites','shopping_history'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format(
      'create policy "open access" on public.%I for all to anon, authenticated using (true) with check (true)', t);
  end loop;
end $$;

-- ---------- Realtime ----------
alter publication supabase_realtime add table
  public.categories, public.shopping_items, public.favorites, public.shopping_history;

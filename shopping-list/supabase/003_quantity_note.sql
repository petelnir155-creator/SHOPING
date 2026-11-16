-- =====================================================================
-- 003: quantity UNITS (יח׳ / ק״ג), item NOTES, and the category rename
--      "שתייה וסודסטרים" -> "שתייה וסודה סטרים".
-- Run after 001 and 002 (also on an existing database). Safe to re-run.
-- =====================================================================

-- unit: 'unit' (יח׳) or 'kg' (ק״ג). note: free text, e.g. "נשאר חצי בקבוק"
alter table public.shopping_items  add column if not exists unit text not null default 'unit';
alter table public.shopping_items  add column if not exists note text;
alter table public.favorites       add column if not exists unit text not null default 'unit';
alter table public.shopping_history add column if not exists unit text not null default 'unit';
alter table public.blueprint_items add column if not exists unit text not null default 'unit';

-- rename the category (only if the new name is not already taken)
update public.categories
set name = 'שתייה וסודה סטרים'
where name = 'שתייה וסודסטרים'
  and not exists (select 1 from public.categories where name = 'שתייה וסודה סטרים');

update public.shopping_history
set category_name = 'שתייה וסודה סטרים'
where category_name = 'שתייה וסודסטרים';

-- same spelling inside the base-list item names
update public.blueprint_items
set name = replace(name, 'סודסטרים', 'סודה סטרים')
where name like '%סודסטרים%';

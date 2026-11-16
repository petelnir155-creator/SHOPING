-- =====================================================================
-- Household Blueprint: the fixed base list of the home.
-- Run in Supabase SQL Editor AFTER 001_schema.sql (or on an existing DB).
-- Safe to re-run: nothing is duplicated.
-- To change the list later: Table Editor -> blueprint_items, or re-run with edits.
-- =====================================================================

create table if not exists public.blueprint_items (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  category_id uuid references public.categories(id) on delete set null,
  quantity    text not null default '1',
  position    int  not null default 0,          -- order inside its category
  created_at  timestamptz not null default now()
);
create unique index if not exists blueprint_items_name_unique on public.blueprint_items (lower(name));
create index if not exists blueprint_items_category_idx on public.blueprint_items (category_id);

alter table public.blueprint_items enable row level security;
drop policy if exists "open access" on public.blueprint_items;
create policy "open access" on public.blueprint_items
  for all to anon, authenticated using (true) with check (true);

do $$ begin
  alter publication supabase_realtime add table public.blueprint_items;
exception when duplicate_object then null;
end $$;

-- ---------- categories (created if missing, ordered as below) ----------
insert into public.categories (name, position)
select v.name, v.pos
from (values
  ('מקרר ומוצרי בסיס', 1),
  ('ירקות ופירות', 2),
  ('בישול ואפייה', 3),
  ('קצב, דגים ובישול ביתי', 4),
  ('מזווה ויבש', 5),
  ('שתייה וסודה סטרים', 6),
  ('תחזוקת הבית וניקיון', 7),
  ('פארם והיגיינה', 8),
  ('חיות מחמד', 9)
) as v(name, pos)
where not exists (select 1 from public.categories c where c.name = v.name);

update public.categories c set position = v.pos
from (values
  ('מקרר ומוצרי בסיס', 1),
  ('ירקות ופירות', 2),
  ('בישול ואפייה', 3),
  ('קצב, דגים ובישול ביתי', 4),
  ('מזווה ויבש', 5),
  ('שתייה וסודה סטרים', 6),
  ('תחזוקת הבית וניקיון', 7),
  ('פארם והיגיינה', 8),
  ('חיות מחמד', 9)
) as v(name, pos)
where c.name = v.name;

-- ---------- remove the unused starter categories from 001 (only if completely unused) ----------
delete from public.categories c
where c.name in ('סופר', 'קצב', 'מאפים', 'פארם', 'ניקיון ובית')
  and not exists (select 1 from public.shopping_items   i where i.category_id = c.id)
  and not exists (select 1 from public.favorites        f where f.category_id = c.id)
  and not exists (select 1 from public.shopping_history h where h.category_id = c.id);

-- ---------- the blueprint items ----------
insert into public.blueprint_items (name, category_id, position)
select v.name, c.id, v.pos
from (values
  ('מקרר ומוצרי בסיס', 'חלב (או תחליפים)', 1),
  ('מקרר ומוצרי בסיס', 'ביצים', 2),
  ('מקרר ומוצרי בסיס', 'גבינה צהובה', 3),
  ('מקרר ומוצרי בסיס', 'גבינה לבנה', 4),
  ('מקרר ומוצרי בסיס', 'קוטג''', 5),
  ('מקרר ומוצרי בסיס', 'יוגורטים', 6),
  ('מקרר ומוצרי בסיס', 'חמאה', 7),
  ('מקרר ומוצרי בסיס', 'ממרחים', 8),
  ('מקרר ומוצרי בסיס', 'קטשופ', 9),
  ('מקרר ומוצרי בסיס', 'טחינה', 10),
  ('מקרר ומוצרי בסיס', 'מלפפונים חמוצים', 11),
  ('מקרר ומוצרי בסיס', 'טופו', 12),
  ('ירקות ופירות', 'עגבניות', 1),
  ('ירקות ופירות', 'מלפפונים', 2),
  ('ירקות ופירות', 'בצל', 3),
  ('ירקות ופירות', 'שום', 4),
  ('ירקות ופירות', 'בצל ירוק', 5),
  ('ירקות ופירות', 'כוסברה', 6),
  ('ירקות ופירות', 'פטרוזיליה', 7),
  ('ירקות ופירות', 'תפוחי אדמה', 8),
  ('ירקות ופירות', 'בטטות', 9),
  ('ירקות ופירות', 'לימונים', 10),
  ('ירקות ופירות', 'פלפל אדום', 11),
  ('ירקות ופירות', 'פלפל חריף', 12),
  ('ירקות ופירות', 'גזר', 13),
  ('בישול ואפייה', 'נייר אפייה', 1),
  ('בישול ואפייה', 'נייר כסף', 2),
  ('בישול ואפייה', 'ניילון נצמד', 3),
  ('קצב, דגים ובישול ביתי', 'חזה עוף', 1),
  ('קצב, דגים ובישול ביתי', 'כנפיים', 2),
  ('קצב, דגים ובישול ביתי', 'דגים', 3),
  ('קצב, דגים ובישול ביתי', 'בשר', 4),
  ('מזווה ויבש', 'פסטה / אורז / קוסקוס', 1),
  ('מזווה ויבש', 'שימורים (טונה, עגבניות מרוסקות, תירס)', 2),
  ('מזווה ויבש', 'קפה (פולים / נמס) ותה', 3),
  ('מזווה ויבש', 'סוכר, מלח, קמח', 4),
  ('מזווה ויבש', 'רטבים בסיסיים (רוטב סויה, סילאן, שמן זית לבישול)', 5),
  ('מזווה ויבש', 'לחם / פיתות / לחמניות', 6),
  ('מזווה ויבש', 'טונה', 7),
  ('מזווה ויבש', 'דבש', 8),
  ('שתייה וסודה סטרים', 'בלוני גז לסודה סטרים (תמיד חשוב גיבוי!)', 1),
  ('שתייה וסודה סטרים', 'סירופים / טעמים לסודה סטרים', 2),
  ('שתייה וסודה סטרים', 'מים מינרליים / סודה בקבוקים (אם צריך)', 3),
  ('שתייה וסודה סטרים', 'בירות או יינות לסוף השבוע', 4),
  ('תחזוקת הבית וניקיון', 'נייר טואלט', 1),
  ('תחזוקת הבית וניקיון', 'נייר סופג', 2),
  ('תחזוקת הבית וניקיון', 'מגבונים לחים', 3),
  ('תחזוקת הבית וניקיון', 'נוזל כלים', 4),
  ('תחזוקת הבית וניקיון', 'סקוצ''ים', 5),
  ('תחזוקת הבית וניקיון', 'שקיות זבל (גדלים שונים)', 6),
  ('תחזוקת הבית וניקיון', 'אקונומיקה / חומרי ניקוי לשירותים ולרצפה', 7),
  ('פארם והיגיינה', 'משחת שיניים / מברשות', 1),
  ('פארם והיגיינה', 'שמפו, מרכך וסבון גוף', 2),
  ('פארם והיגיינה', 'דאודורנט', 3),
  ('פארם והיגיינה', 'טישו / צמר גפן', 4),
  ('חיות מחמד', 'אוכל לחתולים', 1),
  ('חיות מחמד', 'חול לחתולים', 2)
) as v(category, name, pos)
join public.categories c on c.name = v.category
on conflict do nothing;

# מה חסר בבית? – shared shopping list

React + Tailwind + Supabase Realtime. Hebrew / RTL, mobile-first, built for two phones.

## Setup (≈10 minutes)

1. **Create a Supabase project** at https://supabase.com (free tier is plenty).
2. **Create the tables:** Dashboard → *SQL Editor* → run these files, in order:
   - `supabase/001_schema.sql` – `categories`, `shopping_items`, `favorites`, `shopping_history`, realtime, RLS.
   - `supabase/002_blueprint.sql` – the **Household Blueprint**: the 9 home categories and 57 base items
     (`blueprint_items` table). Safe to re-run. *Already ran the old `schema.sql`? Run only `002_blueprint.sql`* –
     it also removes the unused starter categories.
   - `supabase/003_quantity_note.sql` – quantity units (יח׳ / ק״ג), item notes, and the category rename
     "שתייה וסודה סטרים". **Required for the current app version.**
3. **Environment variables:** copy `.env.example` to `.env.local` and fill in
   (Dashboard → *Project Settings → API*):
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...   # the "anon / public" key
   ```
4. **Run:**
   ```
   npm install
   npm run dev        # opens on your LAN so a phone can load it
   ```
5. **Use it on both phones:** deploy (e.g. Vercel / Netlify – set the same two env vars in their
   settings, build command `npm run build`, output `dist`), open the URL on both phones and
   "Add to Home Screen".

## How it works

| Screen | What it does |
| --- | --- |
| **רשימה** | Add bar (type + Enter, `חלב x2` sets quantity), quick-add chips from favorites/past purchases, items grouped by category. Tap the circle to check off (moves to "הושלמו"; tap again to undo). Tap the text to edit name / quantity / category / delete, or swipe a row right for quick Edit / Delete. Star = favorite. **סיום קנייה** saves checked items to history and clears them. |
| **קטגוריות** (the household base list) | Two looks, switch with the toggle: **icon tiles** (tap a tile to open its items) or a **list**. Icons come from the category name (`src/lib/categoryIcons.js`). |
| _(same tab, details)_ | The fixed household list by category. Tap a row → V (added to the list); tap the V again to remove it. "סמנו את כל הקטגוריה" adds a whole category. Star items here to make them favorites. |
| **מועדפים** | Your starred items by category. Tap a row to re-add it to the list. |
| **היסטוריה** | Past trips by date. Re-add a single item, or "הוספת הכל" for the whole trip. |
| ⚙︎ (header) | Add / rename / delete categories. Deleting a category moves its items to "אחר". |

Adding an item that is already on the list does nothing; if it is on the list but checked, it is un-checked.

## Project layout

```
supabase/001_schema.sql    tables, RLS, realtime
supabase/002_blueprint.sql categories + Household Blueprint seed data
supabase/003_quantity_note.sql units + notes columns, category rename
src/lib/                   supabase client, strings (all Hebrew copy), grouping + text helpers
src/hooks/
  useRealtimeTable.js      generic load + realtime-sync for ONE table
  useShoppingData.js       all tables + every action (optimistic updates)
src/components/            small reusable pieces (ItemRow, QuickRow, AddItemBar, ...)
src/views/                 one file per tab
src/ShoppingApp.jsx        shell: header, tabs, category manager
```

### Smart categories
While you type, `src/lib/categorize.js` picks the category: exact Blueprint match → keyword dictionary →
favorites/history. The selector under the input shows the choice ("אוטומטי · חיות מחמד"); choosing a
category by hand applies to the next item only. To teach it new words, add them to `RULES` in that file.

### Changing the base list
Edit rows in Supabase → *Table Editor → blueprint_items* (changes appear live in the app), or edit the
lists in `supabase/002_blueprint.sql` and re-run it (new names are added, existing ones untouched).

### Adding a feature
- **New table** (e.g. `stores`): add SQL + `alter publication ... add table`, call
  `useRealtimeTable('stores')` in `useShoppingData`, add its actions to the returned object.
- **New screen:** create `src/views/XView.jsx` (receives `data`), add one entry to `tabs` in `ShoppingApp.jsx`.
- **New text:** `src/lib/strings.js`.

## Locking it down
The schema uses open RLS policies (no login), so anyone with your site URL could edit the list.
Fine for a private family app – don't share the link. To lock it later: enable Supabase Auth
(email magic link for the two of you), then replace the `"open access"` policies with
`using (auth.role() = 'authenticated')`.

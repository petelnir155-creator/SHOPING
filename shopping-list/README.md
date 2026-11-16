# רשימת קניות – shared shopping list

React + Tailwind + Supabase Realtime. Hebrew / RTL, mobile-first, built for two phones.

## Setup (≈10 minutes)

1. **Create a Supabase project** at https://supabase.com (free tier is plenty).
2. **Create the tables:** Dashboard → *SQL Editor* → paste all of `supabase/schema.sql` → *Run*.
   This creates `categories`, `shopping_items`, `favorites`, `shopping_history`,
   turns on Realtime for all four, and seeds starter Hebrew categories.
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
| **רשימה** | Add bar (type + Enter, `חלב x2` sets quantity), quick-add chips from favorites/past purchases, items grouped by category. Tap the circle to check off (moves to "הושלמו"; tap again to undo). Tap the text to edit name / quantity / category / delete. Star = favorite. **סיום קנייה** saves checked items to history and clears them. |
| **מועדפים** | Your starred items by category. Tap a row to re-add it to the list. |
| **היסטוריה** | Past trips by date. Re-add a single item, or "הוספת הכל" for the whole trip. |
| ⚙︎ (header) | Add / rename / delete categories. Deleting a category moves its items to "אחר". |

Adding an item that is already on the list does nothing; if it is on the list but checked, it is un-checked.

## Project layout

```
supabase/schema.sql        all tables, RLS, realtime, seed data
src/lib/                   supabase client, strings (all Hebrew copy), grouping + text helpers
src/hooks/
  useRealtimeTable.js      generic load + realtime-sync for ONE table
  useShoppingData.js       all tables + every action (optimistic updates)
src/components/            small reusable pieces (ItemRow, QuickRow, AddItemBar, ...)
src/views/                 one file per tab
src/ShoppingApp.jsx        shell: header, tabs, category manager
```

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

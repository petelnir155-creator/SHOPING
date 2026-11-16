import { nameKey } from './text'

/**
 * Groups any rows that have a `category_id` by category, in category order.
 * Rows with no (or an unknown) category land in a trailing `category: null` group.
 * Empty groups are dropped.
 */
export function groupByCategory(categories, rows) {
  const known = new Set(categories.map((c) => c.id))
  const groups = categories.map((category) => ({
    category,
    rows: rows.filter((r) => r.category_id === category.id),
  }))
  const orphans = rows.filter((r) => !r.category_id || !known.has(r.category_id))
  if (orphans.length) groups.push({ category: null, rows: orphans })
  return groups.filter((g) => g.rows.length)
}

/** Groups history rows into trips (by session_id), newest trip first. */
export function groupBySession(history) {
  const map = new Map()
  for (const row of history) {
    if (!map.has(row.session_id)) {
      map.set(row.session_id, { id: row.session_id, purchased_at: row.purchased_at, rows: [] })
    }
    map.get(row.session_id).rows.push(row)
  }
  return [...map.values()].sort(
    (a, b) => new Date(b.purchased_at) - new Date(a.purchased_at),
  )
}

/**
 * Quick-add suggestions. With an empty query: favorites that are not already on the list.
 * While typing: favorites + past purchases whose name contains the query.
 */
export function buildSuggestions({ favorites, history, activeKeys, query, limit = 10 }) {
  const q = nameKey(query)
  const seen = new Set()
  const out = []
  const push = (src, isFavorite) => {
    const key = nameKey(src.name)
    if (!key || seen.has(key) || activeKeys.has(key)) return
    if (q && !key.includes(q)) return
    seen.add(key)
    out.push({
      name: src.name,
      quantity: src.quantity,
      category_id: src.category_id,
      isFavorite,
    })
  }
  favorites.forEach((f) => push(f, true))
  if (q) history.forEach((h) => push(h, false))
  return out.slice(0, limit)
}

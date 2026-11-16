import { useCallback, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { uuid } from '../lib/id'
import { nameKey } from '../lib/text'
import { t } from '../lib/strings'
import { useRealtimeTable } from './useRealtimeTable'

/**
 * The single source of truth for the app: live data from four tables plus every
 * action that changes it. Actions update the UI immediately (optimistic) and
 * roll back by re-fetching if Supabase rejects the change.
 *
 * To add a feature: add a table via useRealtimeTable, add an action below,
 * return both. UI components only ever talk to this hook.
 */
export function useShoppingData() {
  const categoriesT = useRealtimeTable('categories', { orderBy: 'position' })
  const itemsT = useRealtimeTable('shopping_items')
  const favoritesT = useRealtimeTable('favorites')
  const historyT = useRealtimeTable('shopping_history', {
    orderBy: 'purchased_at',
    ascending: false,
    limit: 500,
  })

  // The household base list (read-only in the UI; edit it in Supabase / 002_blueprint.sql)
  const blueprintT = useRealtimeTable('blueprint_items', { orderBy: 'position' })

  const tables = [categoriesT, itemsT, favoritesT, historyT, blueprintT]
  const categories = categoriesT.rows
  const items = itemsT.rows
  const favorites = favoritesT.rows
  const history = historyT.rows
  const blueprint = blueprintT.rows
  const { setRows: setBlueprint } = blueprintT
  const { setRows: setCategories } = categoriesT
  const { setRows: setItems } = itemsT
  const { setRows: setFavorites } = favoritesT
  const { setRows: setHistory } = historyT

  const [actionError, setActionError] = useState(null)

  // ---------- derived state ----------
  const loading = tables.some((t) => t.loading)
  const error = actionError ?? tables.find((t) => t.error)?.error ?? null
  const connection = tables.some((t) => t.status === 'offline')
    ? 'offline'
    : tables.every((t) => t.status === 'connected')
      ? 'connected'
      : 'connecting'

  /** Names currently waiting to be bought (unchecked). */
  const activeKeys = useMemo(
    () => new Set(items.filter((i) => !i.checked).map((i) => nameKey(i.name))),
    [items],
  )
  const favoriteKeys = useMemo(
    () => new Set(favorites.map((f) => nameKey(f.name))),
    [favorites],
  )

  // ---------- plumbing ----------
  const reloadAll = useCallback(
    () =>
      Promise.all([
        categoriesT.reload(),
        itemsT.reload(),
        favoritesT.reload(),
        historyT.reload(),
        blueprintT.reload(),
      ]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [categoriesT.reload, itemsT.reload, favoritesT.reload, historyT.reload, blueprintT.reload],
  )

  /** Awaits a Supabase request; on failure shows the error and re-syncs from the server. */
  const run = useCallback(
    async (request) => {
      const { error: err } = await request
      if (err) {
        setActionError(err.message)
        reloadAll()
      }
      return !err
    },
    [reloadAll],
  )

  const dismissError = useCallback(() => setActionError(null), [])

  // ---------- items ----------
  /**
   * Adds items to the active list. Names already on the list are skipped;
   * names that are on the list but checked off are un-checked instead.
   */
  const addItems = useCallback(
    (entries) => {
      const known = new Map(items.map((i) => [nameKey(i.name), i]))
      const toInsert = []
      const toUncheck = []
      for (const entry of entries) {
        const key = nameKey(entry.name)
        if (!key) continue
        const existing = known.get(key)
        if (existing) {
          if (existing.checked && !toUncheck.includes(existing.id)) toUncheck.push(existing.id)
          continue
        }
        const row = {
          id: uuid(),
          name: entry.name.trim(),
          quantity: entry.quantity || '1',
          unit: entry.unit || 'unit',
          note: entry.note || null,
          category_id: entry.category_id || null,
          checked: false,
        }
        toInsert.push(row)
        known.set(key, row)
      }
      if (!toInsert.length && !toUncheck.length) return

      const now = new Date().toISOString()
      setItems((list) => [
        ...list.map((i) => (toUncheck.includes(i.id) ? { ...i, checked: false } : i)),
        ...toInsert.map((r) => ({ ...r, created_at: now, updated_at: now })),
      ])
      if (toInsert.length) run(supabase.from('shopping_items').insert(toInsert))
      if (toUncheck.length) {
        run(supabase.from('shopping_items').update({ checked: false }).in('id', toUncheck))
      }
    },
    [items, run, setItems],
  )

  const addItem = useCallback((entry) => addItems([entry]), [addItems])

  const updateItem = useCallback(
    (id, patch) => {
      setItems((list) => list.map((i) => (i.id === id ? { ...i, ...patch } : i)))
      run(supabase.from('shopping_items').update(patch).eq('id', id))
    },
    [run, setItems],
  )

  const toggleItem = useCallback(
    (item) => updateItem(item.id, { checked: !item.checked }),
    [updateItem],
  )

  const deleteItem = useCallback(
    (id) => {
      setItems((list) => list.filter((i) => i.id !== id))
      run(supabase.from('shopping_items').delete().eq('id', id))
    },
    [run, setItems],
  )

  // ---------- finish shopping -> history ----------
  /** Moves every checked item into shopping_history (one trip = one session_id). */
  const finishShopping = useCallback(async () => {
    const done = items.filter((i) => i.checked)
    if (!done.length) return
    const sessionId = uuid()
    const purchasedAt = new Date().toISOString()
    const categoryName = (id) => categories.find((c) => c.id === id)?.name ?? null
    const rows = done.map((i) => ({
      id: uuid(),
      session_id: sessionId,
      name: i.name,
      quantity: i.quantity,
      unit: i.unit,
      category_id: i.category_id,
      category_name: categoryName(i.category_id),
      purchased_at: purchasedAt,
    }))

    setHistory((list) => [...rows, ...list])
    setItems((list) => list.filter((i) => !i.checked))

    const saved = await run(supabase.from('shopping_history').insert(rows))
    if (saved) {
      await run(supabase.from('shopping_items').delete().in('id', done.map((i) => i.id)))
    }
  }, [items, categories, run, setHistory, setItems])

  const deleteTrip = useCallback(
    (sessionId) => {
      setHistory((list) => list.filter((h) => h.session_id !== sessionId))
      run(supabase.from('shopping_history').delete().eq('session_id', sessionId))
    },
    [run, setHistory],
  )

  // ---------- favorites ----------
  /** Star / un-star anything that has a name (list item, history row...). */
  const toggleFavorite = useCallback(
    ({ name, category_id = null, quantity = '1', unit = 'unit' }) => {
      const existing = favorites.find((f) => nameKey(f.name) === nameKey(name))
      if (existing) {
        setFavorites((list) => list.filter((f) => f.id !== existing.id))
        run(supabase.from('favorites').delete().eq('id', existing.id))
      } else {
        const row = {
          id: uuid(),
          name: name.trim(),
          category_id,
          quantity: quantity || '1',
          unit: unit || 'unit',
        }
        setFavorites((list) => [...list, { ...row, created_at: new Date().toISOString() }])
        run(supabase.from('favorites').insert(row))
      }
    },
    [favorites, run, setFavorites],
  )

  // ---------- blueprint (the fixed base list per category) ----------
  const addBlueprintItem = useCallback(
    ({ name, category_id = null, quantity = '1' }) => {
      const clean = name.trim()
      if (!clean) return
      if (blueprint.some((b) => nameKey(b.name) === nameKey(clean))) {
        setActionError(t.blueprint.duplicate(clean))
        return
      }
      const position =
        blueprint
          .filter((b) => b.category_id === category_id)
          .reduce((max, b) => Math.max(max, b.position), 0) + 1
      const row = { id: uuid(), name: clean, category_id, quantity: quantity || '1', unit: 'unit', position }
      setBlueprint((list) => [...list, { ...row, created_at: new Date().toISOString() }])
      run(supabase.from('blueprint_items').insert(row))
    },
    [blueprint, run, setBlueprint],
  )

  const deleteBlueprintItem = useCallback(
    (id) => {
      setBlueprint((list) => list.filter((b) => b.id !== id))
      run(supabase.from('blueprint_items').delete().eq('id', id))
    },
    [run, setBlueprint],
  )

  // ---------- categories ----------
  const addCategory = useCallback(
    (name) => {
      const clean = name.trim()
      if (!clean) return
      const position = categories.reduce((max, c) => Math.max(max, c.position), 0) + 1
      const row = { id: uuid(), name: clean, position }
      setCategories((list) => [...list, { ...row, created_at: new Date().toISOString() }])
      run(supabase.from('categories').insert(row))
    },
    [categories, run, setCategories],
  )

  const renameCategory = useCallback(
    (id, name) => {
      const clean = name.trim()
      if (!clean) return
      setCategories((list) => list.map((c) => (c.id === id ? { ...c, name: clean } : c)))
      run(supabase.from('categories').update({ name: clean }).eq('id', id))
    },
    [run, setCategories],
  )

  /** Items/favorites in a deleted category fall back to "Other" (FK: on delete set null). */
  const deleteCategory = useCallback(
    (id) => {
      const detach = (list) => list.map((r) => (r.category_id === id ? { ...r, category_id: null } : r))
      setCategories((list) => list.filter((c) => c.id !== id))
      setItems(detach)
      setFavorites(detach)
      run(supabase.from('categories').delete().eq('id', id))
    },
    [run, setCategories, setItems, setFavorites],
  )

  return {
    // data
    categories,
    items,
    favorites,
    history,
    blueprint,
    // derived
    loading,
    error,
    connection,
    activeKeys,
    favoriteKeys,
    // actions
    dismissError,
    addItem,
    addItems,
    updateItem,
    toggleItem,
    deleteItem,
    finishShopping,
    deleteTrip,
    toggleFavorite,
    addCategory,
    renameCategory,
    deleteCategory,
    addBlueprintItem,
    deleteBlueprintItem,
  }
}

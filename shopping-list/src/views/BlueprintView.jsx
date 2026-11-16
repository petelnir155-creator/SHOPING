import { useMemo } from 'react'
import { Home, ListPlus } from 'lucide-react'
import CategoryGroup from '../components/CategoryGroup'
import QuickRow from '../components/QuickRow'
import { groupByCategory } from '../lib/grouping'
import { nameKey } from '../lib/text'
import { t } from '../lib/strings'

/**
 * The household base list. Tap a row = mark it (V) for this shopping trip, i.e. add it
 * to the active list. Tap the V again = take it off (only while it is still unchecked).
 */
export default function BlueprintView({ data }) {
  const { blueprint, categories, items, activeKeys, favoriteKeys } = data
  const groups = useMemo(() => groupByCategory(categories, blueprint), [categories, blueprint])
  const onListCount = blueprint.filter((b) => activeKeys.has(nameKey(b.name))).length

  const removeFromList = (b) => {
    const match = items.find((i) => !i.checked && nameKey(i.name) === nameKey(b.name))
    if (match) data.deleteItem(match.id)
  }

  if (!blueprint.length) {
    return (
      <div className="py-20 text-center text-stone-500">
        <Home className="mx-auto mb-3 text-stone-300" size={56} />
        <p className="text-lg font-semibold">{t.blueprint.empty}</p>
        <p className="text-sm">{t.blueprint.emptyHint}</p>
      </div>
    )
  }

  return (
    <div className="space-y-2 pt-2">
      <div className="px-1 text-sm text-stone-600">
        <p className="font-semibold">{t.blueprint.summary(onListCount, blueprint.length)}</p>
        <p>{t.blueprint.hint}</p>
      </div>

      {groups.map(({ category, rows }) => {
        const missing = rows.filter((b) => !activeKeys.has(nameKey(b.name)))
        return (
          <CategoryGroup
            key={category?.id ?? 'none'}
            title={category?.name ?? t.uncategorized}
            count={`${rows.length - missing.length}/${rows.length}`}
            defaultOpen={false}
          >
            {rows.map((b) => (
              <QuickRow
                key={b.id}
                name={b.name}
                quantity={b.quantity}
                added={activeKeys.has(nameKey(b.name))}
                isFavorite={favoriteKeys.has(nameKey(b.name))}
                onAdd={() => data.addItem(b)}
                onRemove={() => removeFromList(b)}
                onToggleFavorite={() => data.toggleFavorite(b)}
              />
            ))}
            {missing.length > 0 && (
              <div className="p-2">
                <button
                  type="button"
                  onClick={() => data.addItems(missing)}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 font-semibold text-emerald-700 active:bg-emerald-100"
                >
                  <ListPlus size={18} /> {t.blueprint.addMissing}
                </button>
              </div>
            )}
          </CategoryGroup>
        )
      })}
    </div>
  )
}

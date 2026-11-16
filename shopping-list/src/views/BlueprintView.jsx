import { useMemo } from 'react'
import { LayoutGrid, ListPlus } from 'lucide-react'
import AddBlueprintItem from '../components/AddBlueprintItem'
import CategoryGroup from '../components/CategoryGroup'
import QuickRow from '../components/QuickRow'
import SwipeRow from '../components/SwipeRow'
import { groupByCategory } from '../lib/grouping'
import { nameKey } from '../lib/text'
import { t } from '../lib/strings'

/**
 * Categories + the household base list.
 *  - tap a row            -> V: add it to the shopping list (tap the V again to remove it)
 *  - swipe a row right    -> delete it from the base list
 *  - input at the bottom  -> add a new item to that category's base list
 */
export default function BlueprintView({ data }) {
  const { blueprint, categories, items, activeKeys, favoriteKeys } = data
  const groups = useMemo(
    () => groupByCategory(categories, blueprint, { keepEmpty: true }),
    [categories, blueprint],
  )
  const onListCount = blueprint.filter((b) => activeKeys.has(nameKey(b.name))).length

  const removeFromList = (b) => {
    const match = items.find((i) => !i.checked && nameKey(i.name) === nameKey(b.name))
    if (match) data.deleteItem(match.id)
  }

  if (!groups.length) {
    return (
      <div className="py-20 text-center text-stone-500">
        <LayoutGrid className="mx-auto mb-3 text-stone-300" size={56} />
        <p className="text-lg font-semibold">{t.blueprint.empty}</p>
        <p className="text-sm">{t.blueprint.emptyHint}</p>
      </div>
    )
  }

  return (
    <div className="space-y-2 pt-2">
      <div className="px-1 text-sm text-stone-600">
        {blueprint.length > 0 && (
          <p className="font-semibold">{t.blueprint.summary(onListCount, blueprint.length)}</p>
        )}
        <p>{t.blueprint.hint}</p>
      </div>

      {groups.map(({ category, rows }) => {
        const missing = rows.filter((b) => !activeKeys.has(nameKey(b.name)))
        return (
          <CategoryGroup
            key={category?.id ?? 'none'}
            title={category?.name ?? t.uncategorized}
            count={`${rows.length - missing.length}/${rows.length}`}
            defaultOpen={rows.length === 0}
          >
            {rows.map((b) => (
              <SwipeRow key={b.id} onDelete={() => data.deleteBlueprintItem(b.id)}>
                <QuickRow
                  name={b.name}
                  quantity={b.quantity}
                  unit={b.unit}
                  added={activeKeys.has(nameKey(b.name))}
                  isFavorite={favoriteKeys.has(nameKey(b.name))}
                  onAdd={() => data.addItem(b)}
                  onRemove={() => removeFromList(b)}
                  onToggleFavorite={() => data.toggleFavorite(b)}
                />
              </SwipeRow>
            ))}
            {rows.length === 0 && (
              <p className="px-3 py-2 text-xs text-stone-400">{t.blueprint.emptyCategory}</p>
            )}
            {missing.length > 0 && (
              <div className="p-2">
                <button
                  type="button"
                  onClick={() => data.addItems(missing)}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-rose-50 font-semibold text-rose-700 active:bg-rose-100"
                >
                  <ListPlus size={18} /> {t.blueprint.addMissing}
                </button>
              </div>
            )}
            {category && (
              <AddBlueprintItem
                categoryName={category.name}
                onAdd={({ name, quantity }) =>
                  data.addBlueprintItem({ name, quantity, category_id: category.id })
                }
              />
            )}
          </CategoryGroup>
        )
      })}
    </div>
  )
}

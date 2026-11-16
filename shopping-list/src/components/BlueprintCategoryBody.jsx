import { ListPlus } from 'lucide-react'
import AddBlueprintItem from './AddBlueprintItem'
import QuickRow from './QuickRow'
import SwipeRow from './SwipeRow'
import { nameKey } from '../lib/text'
import { t } from '../lib/strings'

/**
 * Everything inside one category of the base list: its items (tap = V, swipe = delete),
 * "mark all", and the add-item input. Shared by the list view and the icon view's detail page.
 */
export default function BlueprintCategoryBody({ category, rows, data }) {
  const { items, activeKeys, favoriteKeys } = data
  const missing = rows.filter((b) => !activeKeys.has(nameKey(b.name)))

  const removeFromList = (b) => {
    const match = items.find((i) => !i.checked && nameKey(i.name) === nameKey(b.name))
    if (match) data.deleteItem(match.id)
  }

  return (
    <>
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
    </>
  )
}

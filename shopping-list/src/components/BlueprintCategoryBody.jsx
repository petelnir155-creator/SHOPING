import { useState } from 'react'
import { ListPlus } from 'lucide-react'
import AddBlueprintItem from './AddBlueprintItem'
import ItemEditForm from './ItemEditForm'
import QuickRow from './QuickRow'
import SwipeRow from './SwipeRow'
import { nameKey } from '../lib/text'
import { t } from '../lib/strings'

/** One base-list item: tap = V, pencil / swipe-right = edit, swipe-right = delete. */
function BlueprintRow({ b, data, onList }) {
  const [editing, setEditing] = useState(false)
  const { items, favoriteKeys, categories } = data

  const removeFromList = () => {
    const match = items.find((i) => !i.checked && nameKey(i.name) === nameKey(b.name))
    if (match) data.deleteItem(match.id)
  }

  if (editing) {
    return (
      <ItemEditForm
        initial={b}
        categories={categories}
        onSave={(patch) => {
          data.updateBlueprintItem(b.id, patch)
          setEditing(false)
        }}
        onCancel={() => setEditing(false)}
        onDelete={() => data.deleteBlueprintItem(b.id)}
      />
    )
  }

  return (
    <SwipeRow onEdit={() => setEditing(true)} onDelete={() => data.deleteBlueprintItem(b.id)}>
      <QuickRow
        name={b.name}
        quantity={b.quantity}
        unit={b.unit}
        note={b.note}
        added={onList}
        isFavorite={favoriteKeys.has(nameKey(b.name))}
        onAdd={() => data.addItem(b)}
        onRemove={removeFromList}
        onToggleFavorite={() => data.toggleFavorite(b)}
        onEdit={() => setEditing(true)}
      />
    </SwipeRow>
  )
}

/**
 * Everything inside one category of the base list: its items (tap = V, swipe = delete),
 * "mark all", and the add-item input. Shared by the list view and the icon view's detail page.
 */
export default function BlueprintCategoryBody({ category, rows, data }) {
  const { activeKeys } = data
  const missing = rows.filter((b) => !activeKeys.has(nameKey(b.name)))

  return (
    <>
      {rows.map((b) => (
        <BlueprintRow key={b.id} b={b} data={data} onList={activeKeys.has(nameKey(b.name))} />
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

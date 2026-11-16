import { useState } from 'react'
import { Check, Star } from 'lucide-react'
import ItemEditForm from './ItemEditForm'
import SwipeRow from './SwipeRow'
import { formatQuantity } from '../lib/text'
import { t } from '../lib/strings'

/**
 * One row on the active list.
 *  - tap the circle     -> check / uncheck
 *  - tap the text       -> inline edit (name, quantity, unit, note, category, delete)
 *  - swipe right        -> quick Edit / Delete buttons
 *  - tap the star       -> favorite / unfavorite
 */
export default function ItemRow({
  item,
  categories,
  categoryLabel,
  isFavorite,
  onToggle,
  onUpdate,
  onDelete,
  onToggleFavorite,
}) {
  const [editing, setEditing] = useState(false)
  const qty = formatQuantity(item.quantity, item.unit)

  if (editing) {
    return (
      <ItemEditForm
        initial={item}
        categories={categories}
        onSave={(patch) => {
          onUpdate(item.id, patch)
          setEditing(false)
        }}
        onCancel={() => setEditing(false)}
        onDelete={() => onDelete(item.id)}
      />
    )
  }

  return (
    <SwipeRow onEdit={() => setEditing(true)} onDelete={() => onDelete(item.id)}>
      <div className="flex min-h-11 items-center gap-2 px-3">
        <button
          type="button"
          onClick={() => onToggle(item)}
          aria-pressed={item.checked}
          aria-label={item.name}
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
            item.checked
              ? 'border-rose-600 bg-rose-600 text-white'
              : 'border-stone-300 bg-white active:bg-stone-100'
          }`}
        >
          {item.checked && <Check size={16} strokeWidth={3} />}
        </button>

        <button
          type="button"
          onClick={() => setEditing(true)}
          className="flex min-w-0 flex-1 flex-col items-start py-1 text-start"
        >
          <span className="flex max-w-full items-center gap-1.5">
            <span
              dir="auto"
              className={`truncate text-base leading-tight ${
                item.checked ? 'text-stone-400 line-through' : ''
              }`}
            >
              {item.name}
            </span>
            {qty && (
              <span className="shrink-0 rounded-full bg-stone-100 px-1.5 text-xs font-medium text-stone-600">
                {qty}
              </span>
            )}
          </span>
          {item.note && (
            <span dir="auto" className="max-w-full truncate text-xs leading-tight text-stone-500">
              {item.note}
            </span>
          )}
          {categoryLabel && (
            <span className="text-[11px] leading-tight text-stone-400">{categoryLabel}</span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onToggleFavorite(item)}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? t.item.unfavorite : t.item.favorite}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full active:bg-stone-100"
        >
          <Star
            size={18}
            className={isFavorite ? 'fill-rose-600 text-rose-600' : 'text-stone-300'}
          />
        </button>
      </div>
    </SwipeRow>
  )
}

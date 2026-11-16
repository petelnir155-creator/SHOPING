import { Check, Pencil, Plus, Star } from 'lucide-react'
import { t } from '../lib/strings'
import { formatQuantity } from '../lib/text'

/**
 * A "tap to add" row, used by the Categories, Favorites and History views.
 *  - `added`            this name is already on the active list (shows a V)
 *  - `onRemove`         optional: makes the V tappable to take it off the list again
 *  - `onToggleFavorite` optional: shows the star button
 *  - `onEdit`           optional: shows a pencil button
 *  - `note`             optional second line under the name
 */
export default function QuickRow({
  name,
  quantity,
  unit,
  note,
  added,
  isFavorite,
  onAdd,
  onRemove,
  onToggleFavorite,
  onEdit,
}) {
  const handle = added ? onRemove : onAdd
  const disabled = !handle
  const qty = formatQuantity(quantity, unit)

  return (
    <div className="flex min-h-11 items-center gap-1 px-3">
      <button
        type="button"
        onClick={handle}
        disabled={disabled}
        className="flex min-w-0 flex-1 flex-col items-start py-1 text-start disabled:text-stone-400"
      >
        <span className="flex max-w-full items-center gap-1.5">
          <span
            dir="auto"
            className={`line-clamp-2 text-base leading-tight ${added ? 'text-stone-500' : ''}`}
          >
            {name}
          </span>
          {qty && (
            <span className="shrink-0 rounded-full bg-stone-100 px-1.5 text-xs text-stone-600">
              {qty}
            </span>
          )}
        </span>
        {note && (
          <span dir="auto" className="max-w-full truncate text-xs leading-tight text-stone-500">
            {note}
          </span>
        )}
      </button>

      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          aria-label={t.item.edit}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-stone-400 active:bg-stone-100"
        >
          <Pencil size={16} />
        </button>
      )}

      {onToggleFavorite && (
        <button
          type="button"
          onClick={onToggleFavorite}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? t.item.unfavorite : t.item.favorite}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full active:bg-stone-100"
        >
          <Star
            size={18}
            className={isFavorite ? 'fill-rose-600 text-rose-600' : 'text-stone-300'}
          />
        </button>
      )}

      <button
        type="button"
        onClick={handle}
        disabled={disabled}
        aria-label={added ? (onRemove ? t.blueprint.remove : t.item.onList) : t.item.add}
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
          added ? 'bg-rose-600 text-white' : 'bg-stone-100 text-stone-500 active:bg-rose-100'
        }`}
      >
        {added ? <Check size={18} strokeWidth={3} /> : <Plus size={18} />}
      </button>
    </div>
  )
}

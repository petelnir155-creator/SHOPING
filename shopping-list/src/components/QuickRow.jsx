import { Check, Plus, Star } from 'lucide-react'
import { t } from '../lib/strings'
import { formatQuantity } from '../lib/text'

/**
 * A "tap to add" row, used by the Blueprint, Favorites and History views.
 *  - `added`          this name is already on the active list (shows a V)
 *  - `onRemove`       optional: makes the V tappable to take it off the list again
 *  - `onToggleFavorite` optional: shows the star button
 */
export default function QuickRow({
  name,
  quantity,
  unit,
  added,
  isFavorite,
  onAdd,
  onRemove,
  onToggleFavorite,
}) {
  const handle = added ? onRemove : onAdd
  const qty = formatQuantity(quantity, unit)
  const disabled = !handle

  return (
    <div className="flex min-h-11 items-center gap-2 px-3">
      <button
        type="button"
        onClick={handle}
        disabled={disabled}
        className="flex min-w-0 flex-1 items-center gap-2 py-1 text-start disabled:text-stone-400"
      >
        <span dir="auto" className={`truncate text-base ${added ? 'text-stone-500' : ''}`}>
          {name}
        </span>
        {qty && (
          <span className="shrink-0 rounded-full bg-stone-100 px-2 py-0.5 text-sm text-stone-600">
            {qty}
          </span>
        )}
      </button>

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

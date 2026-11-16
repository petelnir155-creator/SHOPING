import { Check, Plus, Star } from 'lucide-react'
import { t } from '../lib/strings'

/**
 * A "tap to add" row, used by the Blueprint, Favorites and History views.
 *  - `added`          this name is already on the active list (shows a V)
 *  - `onRemove`       optional: makes the V tappable to take it off the list again
 *  - `onToggleFavorite` optional: shows the star button
 */
export default function QuickRow({
  name,
  quantity,
  added,
  isFavorite,
  onAdd,
  onRemove,
  onToggleFavorite,
}) {
  const handle = added ? onRemove : onAdd
  const disabled = !handle

  return (
    <div className="flex min-h-14 items-center gap-2 px-3">
      <button
        type="button"
        onClick={handle}
        disabled={disabled}
        className="flex min-w-0 flex-1 items-center gap-2 py-2 text-start disabled:text-stone-400"
      >
        <span dir="auto" className={`truncate text-lg ${added ? 'text-stone-500' : ''}`}>
          {name}
        </span>
        {quantity !== '1' && (
          <span className="shrink-0 rounded-full bg-stone-100 px-2 py-0.5 text-sm text-stone-600">
            {quantity}
          </span>
        )}
      </button>

      {onToggleFavorite && (
        <button
          type="button"
          onClick={onToggleFavorite}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? t.item.unfavorite : t.item.favorite}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full active:bg-stone-100"
        >
          <Star
            size={22}
            className={isFavorite ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}
          />
        </button>
      )}

      <button
        type="button"
        onClick={handle}
        disabled={disabled}
        aria-label={added ? (onRemove ? t.blueprint.remove : t.item.onList) : t.item.add}
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
          added ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-500 active:bg-emerald-100'
        }`}
      >
        {added ? <Check size={22} strokeWidth={3} /> : <Plus size={22} />}
      </button>
    </div>
  )
}

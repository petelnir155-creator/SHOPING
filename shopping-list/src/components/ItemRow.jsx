import { useState } from 'react'
import { Check, Star, Trash2, X, Save } from 'lucide-react'
import SwipeRow from './SwipeRow'
import { UNITS, formatQuantity } from '../lib/text'
import { t } from '../lib/strings'

/**
 * One row on the active list.
 *  - tap the circle     -> check / uncheck
 *  - tap the text       -> inline edit (name, quantity, category, delete)
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
  const [draft, setDraft] = useState(null) // null = not editing
  const qty = formatQuantity(item.quantity, item.unit)
  const set = (field) => (e) => setDraft((d) => ({ ...d, [field]: e.target.value }))

  const startEdit = () =>
    setDraft({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit ?? 'unit',
      note: item.note ?? '',
      category_id: item.category_id ?? '',
    })

  const save = (e) => {
    e.preventDefault()
    const name = draft.name.trim()
    if (!name) return
    onUpdate(item.id, {
      name,
      quantity: draft.quantity.trim() || '1',
      unit: draft.unit,
      note: draft.note.trim() || null,
      category_id: draft.category_id || null,
    })
    setDraft(null)
  }

  if (draft) {
    return (
      <form
        onSubmit={save}
        onKeyDown={(e) => e.key === 'Escape' && setDraft(null)}
        className="space-y-2 bg-rose-50/60 p-2"
      >
        <input
          autoFocus
          dir="rtl"
          value={draft.name}
          onChange={set('name')}
          aria-label={t.item.name}
          className="h-10 w-full rounded-lg border border-stone-300 bg-white px-3 text-start"
        />
        <div className="flex gap-2">
          <input
            dir="rtl"
            inputMode="decimal"
            value={draft.quantity}
            onChange={set('quantity')}
            placeholder={t.item.quantityPlaceholder}
            aria-label={t.item.quantity}
            className="h-10 w-24 rounded-lg border border-stone-300 bg-white px-2 text-center"
          />
          <div
            role="group"
            aria-label={t.item.quantity}
            className="flex flex-1 overflow-hidden rounded-lg border border-stone-300 bg-white"
          >
            {UNITS.map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setDraft((d) => ({ ...d, unit: u }))}
                aria-pressed={draft.unit === u}
                className={`flex-1 text-sm font-medium ${
                  draft.unit === u ? 'bg-rose-600 text-white' : 'text-stone-600 active:bg-stone-100'
                }`}
              >
                {t.units[u]}
              </button>
            ))}
          </div>
        </div>
        <input
          dir="rtl"
          value={draft.note}
          onChange={set('note')}
          placeholder={t.item.notePlaceholder}
          aria-label={t.item.note}
          className="h-10 w-full rounded-lg border border-stone-300 bg-white px-3 text-start"
        />
        <select
          value={draft.category_id}
          onChange={set('category_id')}
          aria-label={t.item.category}
          className="h-10 w-full rounded-lg border border-stone-300 bg-white px-3"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
          <option value="">{t.uncategorized}</option>
        </select>
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-rose-600 font-semibold text-white active:bg-rose-700"
          >
            <Save size={16} /> {t.item.save}
          </button>
          <button
            type="button"
            onClick={() => setDraft(null)}
            aria-label={t.item.cancel}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-200 active:bg-stone-300"
          >
            <X size={18} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(item.id)}
            aria-label={t.item.delete}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 active:bg-red-200"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </form>
    )
  }

  return (
    <SwipeRow onEdit={startEdit} onDelete={() => onDelete(item.id)}>
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
          onClick={startEdit}
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

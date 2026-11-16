import { useState } from 'react'
import { Check, Star, Trash2, X, Save } from 'lucide-react'
import { t } from '../lib/strings'

/**
 * One row on the active list.
 *  - tap the circle  -> check / uncheck
 *  - tap the text    -> inline edit (name, quantity, category, delete)
 *  - tap the star    -> favorite / unfavorite
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
  const set = (field) => (e) => setDraft((d) => ({ ...d, [field]: e.target.value }))

  const startEdit = () =>
    setDraft({ name: item.name, quantity: item.quantity, category_id: item.category_id ?? '' })

  const save = (e) => {
    e.preventDefault()
    const name = draft.name.trim()
    if (!name) return
    onUpdate(item.id, {
      name,
      quantity: draft.quantity.trim() || '1',
      category_id: draft.category_id || null,
    })
    setDraft(null)
  }

  if (draft) {
    return (
      <form
        onSubmit={save}
        onKeyDown={(e) => e.key === 'Escape' && setDraft(null)}
        className="space-y-2 bg-emerald-50/60 p-3"
      >
        <div className="flex gap-2">
          <input
            autoFocus
            dir="auto"
            value={draft.name}
            onChange={set('name')}
            aria-label={t.item.name}
            className="h-12 min-w-0 flex-1 rounded-xl border border-stone-300 bg-white px-3"
          />
          <input
            dir="auto"
            value={draft.quantity}
            onChange={set('quantity')}
            aria-label={t.item.quantity}
            className="h-12 w-20 rounded-xl border border-stone-300 bg-white px-3 text-center"
          />
        </div>
        <select
          value={draft.category_id}
          onChange={set('category_id')}
          aria-label={t.item.category}
          className="h-12 w-full rounded-xl border border-stone-300 bg-white px-3"
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
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 font-semibold text-white active:bg-emerald-700"
          >
            <Save size={18} /> {t.item.save}
          </button>
          <button
            type="button"
            onClick={() => setDraft(null)}
            aria-label={t.item.cancel}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-200 active:bg-stone-300"
          >
            <X size={20} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(item.id)}
            aria-label={t.item.delete}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600 active:bg-red-200"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </form>
    )
  }

  return (
    <div className="flex min-h-14 items-center gap-3 px-3">
      <button
        type="button"
        onClick={() => onToggle(item)}
        aria-pressed={item.checked}
        aria-label={item.name}
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          item.checked
            ? 'border-emerald-600 bg-emerald-600 text-white'
            : 'border-stone-300 bg-white active:bg-stone-100'
        }`}
      >
        {item.checked && <Check size={20} strokeWidth={3} />}
      </button>

      <button
        type="button"
        onClick={startEdit}
        className="flex min-w-0 flex-1 flex-col items-start py-2 text-start"
      >
        <span className="flex max-w-full items-center gap-2">
          <span
            dir="auto"
            className={`truncate text-lg ${item.checked ? 'text-stone-400 line-through' : ''}`}
          >
            {item.name}
          </span>
          {item.quantity !== '1' && (
            <span className="shrink-0 rounded-full bg-stone-100 px-2 py-0.5 text-sm font-medium text-stone-600">
              {item.quantity}
            </span>
          )}
        </span>
        {categoryLabel && <span className="text-xs text-stone-400">{categoryLabel}</span>}
      </button>

      <button
        type="button"
        onClick={() => onToggleFavorite(item)}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? t.item.unfavorite : t.item.favorite}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full active:bg-stone-100"
      >
        <Star
          size={22}
          className={isFavorite ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}
        />
      </button>
    </div>
  )
}

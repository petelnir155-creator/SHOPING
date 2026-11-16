import { useState } from 'react'
import { Save, Trash2, X } from 'lucide-react'
import { UNITS } from '../lib/text'
import { t } from '../lib/strings'

/**
 * Edit form shared by the shopping list and the categories tab:
 * name, quantity + unit (יח׳ / ק״ג), note, category.
 * `onSave` receives { name, quantity, unit, note, category_id }.
 */
export default function ItemEditForm({ initial, categories, onSave, onCancel, onDelete }) {
  const [draft, setDraft] = useState({
    name: initial.name,
    quantity: initial.quantity ?? '1',
    unit: initial.unit ?? 'unit',
    note: initial.note ?? '',
    category_id: initial.category_id ?? '',
  })
  const set = (field) => (e) => setDraft((d) => ({ ...d, [field]: e.target.value }))

  const save = (e) => {
    e.preventDefault()
    const name = draft.name.trim()
    if (!name) return
    onSave({
      name,
      quantity: draft.quantity.trim() || '1',
      unit: draft.unit,
      note: draft.note.trim() || null,
      category_id: draft.category_id || null,
    })
  }

  return (
    <form
      onSubmit={save}
      onKeyDown={(e) => e.key === 'Escape' && onCancel()}
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
          onClick={onCancel}
          aria-label={t.item.cancel}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-200 active:bg-stone-300"
        >
          <X size={18} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label={t.item.delete}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 active:bg-red-200"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </form>
  )
}

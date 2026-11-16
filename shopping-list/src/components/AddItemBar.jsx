import { useMemo, useRef, useState } from 'react'
import { Plus, Star } from 'lucide-react'
import { detectCategory } from '../lib/categorize'
import { buildSuggestions } from '../lib/grouping'
import { parseQuickAdd } from '../lib/text'
import { t } from '../lib/strings'

/**
 * Fast-add bar: type + Enter, optionally "חלב x2".
 * The category is detected automatically from the name as you type (see lib/categorize.js).
 * The selector shows what was detected; picking a category by hand overrides it for the
 * NEXT item only, then it returns to automatic - it never gets "stuck" on the last category.
 */
export default function AddItemBar({
  categories,
  blueprint,
  favorites,
  history,
  activeKeys,
  onAdd,
}) {
  const [text, setText] = useState('')
  const [override, setOverride] = useState(null) // null = automatic
  const inputRef = useRef(null)

  const { name, quantity } = parseQuickAdd(text)

  const detectedId = useMemo(
    () => detectCategory({ text: name, categories, blueprint, favorites, history }),
    [name, categories, blueprint, favorites, history],
  )
  const categoryId = override ?? detectedId ?? '' // '' = "Other"
  const nameOf = (id) => categories.find((c) => c.id === id)?.name ?? t.uncategorized
  const autoLabel = name ? t.add.autoWithName(nameOf(detectedId)) : t.add.auto

  const suggestions = useMemo(
    () => buildSuggestions({ favorites, history, activeKeys, query: text }),
    [favorites, history, activeKeys, text],
  )

  const submit = (e) => {
    e.preventDefault()
    if (!name) return
    onAdd({ name, quantity, category_id: categoryId || null })
    setText('')
    setOverride(null)
    inputRef.current?.focus() // keep the keyboard up for rapid entry
  }

  const addSuggestion = (s) => {
    onAdd({ name: s.name, quantity: s.quantity, unit: s.unit, category_id: s.category_id })
    setText('')
    setOverride(null)
  }

  return (
    <div className="space-y-1.5 bg-stone-100 pb-1.5 pt-2">
      <form onSubmit={submit} className="flex gap-2">
        <input
          ref={inputRef}
          dir="rtl"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t.add.placeholder}
          enterKeyHint="done"
          autoComplete="off"
          className="h-11 min-w-0 flex-1 rounded-xl border border-stone-300 bg-white px-3 text-right shadow-sm"
        />
        <button
          type="submit"
          aria-label={t.add.submit}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white shadow-sm active:bg-rose-700"
        >
          <Plus size={24} />
        </button>
      </form>

      <select
        dir="rtl"
        value={override === null ? 'auto' : override}
        onChange={(e) => setOverride(e.target.value === 'auto' ? null : e.target.value)}
        aria-label={t.add.category}
        className="h-9 w-full rounded-lg border border-stone-300 bg-white px-2 text-sm text-stone-700"
      >
        <option value="auto">{autoLabel}</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
        <option value="">{t.uncategorized}</option>
      </select>

      {suggestions.length > 0 && (
        <div className="-mx-3 flex gap-2 overflow-x-auto px-3 pb-0.5">
          {suggestions.map((s) => (
            <button
              key={s.name}
              type="button"
              onClick={() => addSuggestion(s)}
              className="flex h-8 shrink-0 items-center gap-1 rounded-full bg-white px-3 text-sm shadow-sm ring-1 ring-stone-200 active:bg-rose-50"
            >
              {s.isFavorite && <Star size={12} className="fill-rose-600 text-rose-600" />}
              <span dir="auto">{s.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

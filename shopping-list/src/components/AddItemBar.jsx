import { useMemo, useRef, useState } from 'react'
import { Plus, Star } from 'lucide-react'
import { buildSuggestions } from '../lib/grouping'
import { parseQuickAdd } from '../lib/text'
import { t } from '../lib/strings'

const LAST_CATEGORY_KEY = 'shopping:lastCategory'

const readLastCategory = () => {
  try {
    return localStorage.getItem(LAST_CATEGORY_KEY)
  } catch {
    return null
  }
}

/**
 * Fast-add bar: type + Enter, optionally "חלב x2". The category selector
 * remembers the last choice. Under the input, quick-add chips show favorites
 * (and matching past purchases while typing) that can be added in one tap.
 */
export default function AddItemBar({ categories, favorites, history, activeKeys, onAdd }) {
  const [text, setText] = useState('')
  const [storedCategory, setStoredCategory] = useState(readLastCategory)
  const inputRef = useRef(null)

  // '' = "Other". Falls back to the first category until the user picks one.
  const categoryId =
    storedCategory === null
      ? (categories[0]?.id ?? '')
      : categories.some((c) => c.id === storedCategory)
        ? storedCategory
        : ''

  const pickCategory = (id) => {
    setStoredCategory(id)
    try {
      localStorage.setItem(LAST_CATEGORY_KEY, id)
    } catch {
      /* private mode: ignore */
    }
  }

  const suggestions = useMemo(
    () => buildSuggestions({ favorites, history, activeKeys, query: text }),
    [favorites, history, activeKeys, text],
  )

  const submit = (e) => {
    e.preventDefault()
    const { name, quantity } = parseQuickAdd(text)
    if (!name) return
    onAdd({ name, quantity, category_id: categoryId || null })
    setText('')
    inputRef.current?.focus() // keep the keyboard up for rapid entry
  }

  const addSuggestion = (s) => {
    onAdd({ name: s.name, quantity: s.quantity, category_id: s.category_id })
    setText('')
  }

  return (
    <div className="space-y-2 bg-stone-100 pb-2 pt-3">
      <form onSubmit={submit} className="flex gap-2">
        <input
          ref={inputRef}
          dir="auto"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t.add.placeholder}
          enterKeyHint="done"
          autoComplete="off"
          className="h-12 min-w-0 flex-1 rounded-xl border border-stone-300 bg-white px-3 shadow-sm"
        />
        <button
          type="submit"
          aria-label={t.add.submit}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm active:bg-emerald-700"
        >
          <Plus size={26} />
        </button>
      </form>

      <select
        value={categoryId}
        onChange={(e) => pickCategory(e.target.value)}
        aria-label={t.add.category}
        className="h-10 w-full rounded-xl border border-stone-300 bg-white px-3 text-stone-700"
      >
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
        <option value="">{t.uncategorized}</option>
      </select>

      {suggestions.length > 0 && (
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {suggestions.map((s) => (
            <button
              key={s.name}
              type="button"
              onClick={() => addSuggestion(s)}
              className="flex h-10 shrink-0 items-center gap-1 rounded-full bg-white px-4 text-sm shadow-sm ring-1 ring-stone-200 active:bg-emerald-50"
            >
              {s.isFavorite && <Star size={14} className="fill-amber-400 text-amber-400" />}
              <span dir="auto">{s.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { parseQuickAdd } from '../lib/text'
import { t } from '../lib/strings'

/** Inline "add an item to this category's base list" row. */
export default function AddBlueprintItem({ categoryName, onAdd }) {
  const [text, setText] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const { name, quantity } = parseQuickAdd(text)
    if (!name) return
    onAdd({ name, quantity })
    setText('')
  }

  return (
    <form onSubmit={submit} className="flex gap-2 bg-stone-50 p-2">
      <input
        dir="rtl"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t.blueprint.addPlaceholder(categoryName)}
        enterKeyHint="done"
        autoComplete="off"
        className="h-10 min-w-0 flex-1 rounded-lg border border-stone-300 bg-white px-3 text-right"
      />
      <button
        type="submit"
        aria-label={t.blueprint.addToCategory}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-600 text-white active:bg-rose-700"
      >
        <Plus size={20} />
      </button>
    </form>
  )
}

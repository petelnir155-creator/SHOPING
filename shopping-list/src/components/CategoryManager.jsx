import { useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { t } from '../lib/strings'

function CategoryRow({ category, onRename, onDelete }) {
  const [name, setName] = useState(category.name)

  const commit = () => {
    const clean = name.trim()
    if (clean && clean !== category.name) onRename(category.id, clean)
    else setName(category.name)
  }

  const remove = () => {
    if (window.confirm(t.categories.confirmDelete(category.name))) onDelete(category.id)
  }

  return (
    <div className="flex items-center gap-2">
      <input
        dir="rtl"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
        className="h-12 min-w-0 flex-1 rounded-xl border border-stone-300 bg-white px-3"
      />
      <button
        type="button"
        onClick={remove}
        aria-label={t.item.delete}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 active:bg-red-100"
      >
        <Trash2 size={20} />
      </button>
    </div>
  )
}

/** Bottom-sheet to add, rename and delete categories. */
export default function CategoryManager({ categories, onAdd, onRename, onDelete, onClose }) {
  const [newName, setNewName] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    onAdd(newName)
    setNewName('')
  }

  return (
    <div className="fixed inset-0 z-30 flex items-end bg-black/40" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] w-full overflow-y-auto rounded-t-3xl bg-stone-100 p-4 pb-8"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{t.categories.title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.categories.close}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-200 active:bg-stone-300"
          >
            <X size={22} />
          </button>
        </div>

        <div className="space-y-2">
          {categories.map((c) => (
            <CategoryRow key={c.id} category={c} onRename={onRename} onDelete={onDelete} />
          ))}
        </div>

        <form onSubmit={submit} className="mt-4 flex gap-2">
          <input
            dir="rtl"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={t.categories.newPlaceholder}
            className="h-12 min-w-0 flex-1 rounded-xl border border-stone-300 bg-white px-3"
          />
          <button
            type="submit"
            aria-label={t.categories.add}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white active:bg-emerald-700"
          >
            <Plus size={24} />
          </button>
        </form>
      </div>
    </div>
  )
}

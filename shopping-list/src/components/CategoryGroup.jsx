import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

/** Collapsible card with a category title. Shared by the list, favorites and history views. */
export default function CategoryGroup({ title, count, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex h-12 w-full items-center justify-between bg-stone-50 px-4"
      >
        <span className="font-semibold">{title}</span>
        <span className="flex items-center gap-2 text-sm text-stone-500">
          {count}
          <ChevronDown size={18} className={`transition-transform ${open ? '' : '-rotate-90'}`} />
        </span>
      </button>
      {open && <div className="divide-y divide-stone-100">{children}</div>}
    </section>
  )
}

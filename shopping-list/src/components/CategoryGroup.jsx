import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

/** Collapsible card with a category title. Shared by the list, blueprint, favorites and history views. */
export default function CategoryGroup({ title, count, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <section className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-stone-200">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex h-9 w-full items-center justify-between bg-stone-50 px-3"
      >
        <span className="text-sm font-semibold">{title}</span>
        <span className="flex items-center gap-1.5 text-xs text-stone-500">
          {count}
          <ChevronDown size={16} className={`transition-transform ${open ? '' : '-rotate-90'}`} />
        </span>
      </button>
      {open && <div className="divide-y divide-stone-100">{children}</div>}
    </section>
  )
}

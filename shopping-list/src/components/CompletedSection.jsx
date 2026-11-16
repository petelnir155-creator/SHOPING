import { useState } from 'react'
import { ChevronDown, PackageCheck } from 'lucide-react'
import { t } from '../lib/strings'

/** Collapsible "Completed" block at the bottom of the list, with the Finish Shopping button. */
export default function CompletedSection({ count, onFinish, children }) {
  const [open, setOpen] = useState(true)
  if (!count) return null

  return (
    <section className="overflow-hidden rounded-2xl bg-white/70 ring-1 ring-stone-200">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex h-12 w-full items-center justify-between px-4 text-stone-600"
      >
        <span className="font-semibold">
          {t.list.completed} ({count})
        </span>
        <ChevronDown size={18} className={`transition-transform ${open ? '' : '-rotate-90'}`} />
      </button>

      {open && <div className="divide-y divide-stone-100">{children}</div>}

      <div className="border-t border-stone-100 p-3">
        <button
          type="button"
          onClick={onFinish}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-stone-800 font-semibold text-white active:bg-stone-900"
        >
          <PackageCheck size={20} /> {t.list.finish}
        </button>
        <p className="mt-1 text-center text-xs text-stone-500">{t.list.finishHint}</p>
      </div>
    </section>
  )
}

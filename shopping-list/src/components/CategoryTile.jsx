import { t } from '../lib/strings'

/** Big tappable category card for the icon view. */
export default function CategoryTile({ icon, name, total, onList, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex h-32 flex-col items-center justify-center gap-1 rounded-2xl bg-white px-2 shadow-sm ring-1 ring-stone-200 transition-transform active:scale-95"
    >
      {onList > 0 && (
        <span className="absolute end-2 top-2 min-w-5 rounded-full bg-rose-600 px-1.5 text-center text-xs font-bold leading-5 text-white">
          {onList}
        </span>
      )}
      <span className="text-4xl leading-none">{icon}</span>
      <span dir="auto" className="line-clamp-2 text-center text-sm font-semibold leading-tight">
        {name}
      </span>
      <span className="text-xs text-stone-400">{t.blueprint.itemCount(total)}</span>
    </button>
  )
}

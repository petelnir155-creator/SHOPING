import { useMemo } from 'react'
import { History, ListPlus, Trash2 } from 'lucide-react'
import QuickRow from '../components/QuickRow'
import { groupBySession } from '../lib/grouping'
import { formatDate, nameKey } from '../lib/text'
import { t } from '../lib/strings'

export default function HistoryView({ data }) {
  const { history, categories, activeKeys, favoriteKeys } = data
  const trips = useMemo(() => groupBySession(history), [history])

  /** History keeps a category snapshot; map it back to a live category if the id is gone. */
  const toEntry = (row) => ({
    name: row.name,
    quantity: row.quantity,
    unit: row.unit,
    category_id:
      categories.find((c) => c.id === row.category_id)?.id ??
      categories.find((c) => c.name === row.category_name)?.id ??
      null,
  })

  const deleteTrip = (id) => {
    if (window.confirm(t.history.confirmDeleteTrip)) data.deleteTrip(id)
  }

  if (!trips.length) {
    return (
      <div className="py-20 text-center text-stone-500">
        <History className="mx-auto mb-3 text-stone-300" size={56} />
        <p className="text-lg font-semibold">{t.history.empty}</p>
        <p className="text-sm">{t.history.emptyHint}</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {trips.map((trip) => (
        <section
          key={trip.id}
          className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200"
        >
          <header className="flex items-center gap-2 bg-stone-50 px-4 py-2">
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{formatDate(trip.purchased_at)}</p>
              <p className="text-xs text-stone-500">{t.history.itemCount(trip.rows.length)}</p>
            </div>
            <button
              type="button"
              onClick={() => data.addItems(trip.rows.map(toEntry))}
              className="flex h-10 items-center gap-1 rounded-full bg-rose-600 px-3 text-sm font-semibold text-white active:bg-rose-700"
            >
              <ListPlus size={18} /> {t.history.addAll}
            </button>
            <button
              type="button"
              onClick={() => deleteTrip(trip.id)}
              aria-label={t.history.deleteTrip}
              className="flex h-10 w-10 items-center justify-center rounded-full text-stone-400 active:bg-red-50 active:text-red-600"
            >
              <Trash2 size={18} />
            </button>
          </header>

          <div className="divide-y divide-stone-100">
            {trip.rows.map((row) => {
              const entry = toEntry(row)
              return (
                <QuickRow
                  key={row.id}
                  name={row.name}
                  quantity={row.quantity}
                  unit={row.unit}
                  added={activeKeys.has(nameKey(row.name))}
                  isFavorite={favoriteKeys.has(nameKey(row.name))}
                  onAdd={() => data.addItem(entry)}
                  onToggleFavorite={() => data.toggleFavorite(entry)}
                />
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}

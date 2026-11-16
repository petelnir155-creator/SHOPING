import { useMemo } from 'react'
import { Star } from 'lucide-react'
import CategoryGroup from '../components/CategoryGroup'
import QuickRow from '../components/QuickRow'
import { groupByCategory } from '../lib/grouping'
import { nameKey } from '../lib/text'
import { t } from '../lib/strings'

export default function FavoritesView({ data }) {
  const { favorites, categories, activeKeys } = data
  const groups = useMemo(() => groupByCategory(categories, favorites), [categories, favorites])

  if (!favorites.length) {
    return (
      <div className="py-20 text-center text-stone-500">
        <Star className="mx-auto mb-3 text-stone-300" size={56} />
        <p className="text-lg font-semibold">{t.favorites.empty}</p>
        <p className="text-sm">{t.favorites.emptyHint}</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {groups.map(({ category, rows }) => (
        <CategoryGroup
          key={category?.id ?? 'none'}
          title={category?.name ?? t.uncategorized}
          count={rows.length}
        >
          {rows.map((fav) => (
            <QuickRow
              key={fav.id}
              name={fav.name}
              quantity={fav.quantity}
              added={activeKeys.has(nameKey(fav.name))}
              isFavorite
              onAdd={() => data.addItem(fav)}
              onToggleFavorite={() => data.toggleFavorite(fav)}
            />
          ))}
        </CategoryGroup>
      ))}
    </div>
  )
}

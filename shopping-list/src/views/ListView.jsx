import { useMemo } from 'react'
import { ShoppingBasket } from 'lucide-react'
import AddItemBar from '../components/AddItemBar'
import CategoryGroup from '../components/CategoryGroup'
import CompletedSection from '../components/CompletedSection'
import ItemRow from '../components/ItemRow'
import { groupByCategory } from '../lib/grouping'
import { nameKey } from '../lib/text'
import { t } from '../lib/strings'

export default function ListView({ data }) {
  const { items, categories, blueprint, favorites, history, activeKeys, favoriteKeys } = data

  const pending = useMemo(() => items.filter((i) => !i.checked), [items])
  const done = useMemo(() => items.filter((i) => i.checked), [items])
  const groups = useMemo(() => groupByCategory(categories, pending), [categories, pending])
  const categoryName = (id) => categories.find((c) => c.id === id)?.name ?? t.uncategorized

  const rowProps = (item) => ({
    item,
    categories,
    isFavorite: favoriteKeys.has(nameKey(item.name)),
    onToggle: data.toggleItem,
    onUpdate: data.updateItem,
    onDelete: data.deleteItem,
    onToggleFavorite: data.toggleFavorite,
  })

  return (
    <>
      <div className="sticky top-12 z-10 -mx-3 px-3">
        <AddItemBar
          categories={categories}
          blueprint={blueprint}
          favorites={favorites}
          history={history}
          activeKeys={activeKeys}
          onAdd={data.addItem}
        />
      </div>

      <div className="mt-1 space-y-2">
        {groups.map(({ category, rows }) => (
          <CategoryGroup
            key={category?.id ?? 'none'}
            title={category?.name ?? t.uncategorized}
            count={rows.length}
          >
            {rows.map((item) => (
              <ItemRow key={item.id} {...rowProps(item)} />
            ))}
          </CategoryGroup>
        ))}

        {!items.length && (
          <div className="py-16 text-center text-stone-500">
            <ShoppingBasket className="mx-auto mb-3 text-stone-300" size={56} />
            <p className="text-lg font-semibold">{t.list.empty}</p>
            <p className="text-sm">{t.list.emptyHint}</p>
          </div>
        )}

        <CompletedSection count={done.length} onFinish={data.finishShopping}>
          {done.map((item) => (
            <ItemRow key={item.id} {...rowProps(item)} categoryLabel={categoryName(item.category_id)} />
          ))}
        </CompletedSection>
      </div>
    </>
  )
}

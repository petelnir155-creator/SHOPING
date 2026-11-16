import { useMemo, useState } from 'react'
import { ArrowRight, LayoutGrid, List } from 'lucide-react'
import BlueprintCategoryBody from '../components/BlueprintCategoryBody'
import CategoryGroup from '../components/CategoryGroup'
import CategoryTile from '../components/CategoryTile'
import ViewToggle from '../components/ViewToggle'
import { categoryIcon } from '../lib/categoryIcons'
import { groupByCategory } from '../lib/grouping'
import { nameKey } from '../lib/text'
import { t } from '../lib/strings'

const MODE_KEY = 'shopping:categoriesView'
const readMode = () => {
  try {
    return localStorage.getItem(MODE_KEY) === 'list' ? 'list' : 'grid'
  } catch {
    return 'grid'
  }
}

const MODES = [
  { id: 'grid', icon: LayoutGrid, label: t.blueprint.view.grid },
  { id: 'list', icon: List, label: t.blueprint.view.list },
]

/**
 * Categories tab with two looks (remembered per phone):
 *  - grid: big icon tiles; tap a tile to open that category's items
 *  - list: all categories as collapsible lists
 */
export default function BlueprintView({ data }) {
  const { blueprint, categories, activeKeys } = data
  const [mode, setMode] = useState(readMode)
  const [openKey, setOpenKey] = useState(null)

  const groups = useMemo(
    () => groupByCategory(categories, blueprint, { keepEmpty: true }),
    [categories, blueprint],
  )
  const keyOf = (g) => g.category?.id ?? 'none'
  const nameOf = (g) => g.category?.name ?? t.uncategorized
  const onListIn = (rows) => rows.filter((b) => activeKeys.has(nameKey(b.name))).length

  const changeMode = (next) => {
    setMode(next)
    setOpenKey(null)
    try {
      localStorage.setItem(MODE_KEY, next)
    } catch {
      /* private mode: ignore */
    }
  }

  if (!groups.length) {
    return (
      <div className="py-20 text-center text-stone-500">
        <LayoutGrid className="mx-auto mb-3 text-stone-300" size={56} />
        <p className="text-lg font-semibold">{t.blueprint.empty}</p>
        <p className="text-sm">{t.blueprint.emptyHint}</p>
      </div>
    )
  }

  // ---------- grid mode: one category opened ----------
  const opened = mode === 'grid' ? groups.find((g) => keyOf(g) === openKey) : null
  if (opened) {
    return (
      <div className="space-y-2 pt-2">
        <button
          type="button"
          onClick={() => setOpenKey(null)}
          className="flex h-10 items-center gap-2 font-semibold text-rose-600"
        >
          <ArrowRight size={20} /> {t.blueprint.back}
        </button>
        <section className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-stone-200">
          <header className="flex items-center gap-2 bg-stone-50 px-3 py-2">
            <span className="text-2xl leading-none">{categoryIcon(nameOf(opened))}</span>
            <h2 dir="auto" className="font-semibold">
              {nameOf(opened)}
            </h2>
            <span className="ms-auto text-xs text-stone-500">
              {onListIn(opened.rows)}/{opened.rows.length}
            </span>
          </header>
          <div className="divide-y divide-stone-100">
            <BlueprintCategoryBody category={opened.category} rows={opened.rows} data={data} />
          </div>
        </section>
        <p className="px-1 text-xs text-stone-500">{t.blueprint.hint}</p>
      </div>
    )
  }

  // ---------- overview (grid or list) ----------
  return (
    <div className="space-y-2 pt-2">
      <div className="flex items-center gap-2 px-1">
        <p className="flex-1 text-sm font-semibold text-stone-600">
          {blueprint.length > 0 && t.blueprint.summary(onListIn(blueprint), blueprint.length)}
        </p>
        <ViewToggle options={MODES} value={mode} onChange={changeMode} />
      </div>

      {mode === 'grid' ? (
        <div className="grid grid-cols-2 gap-2">
          {groups.map((g) => (
            <CategoryTile
              key={keyOf(g)}
              icon={categoryIcon(nameOf(g))}
              name={nameOf(g)}
              total={g.rows.length}
              onList={onListIn(g.rows)}
              onClick={() => setOpenKey(keyOf(g))}
            />
          ))}
        </div>
      ) : (
        <>
          <p className="px-1 text-xs text-stone-500">{t.blueprint.hint}</p>
          {groups.map((g) => (
            <CategoryGroup
              key={keyOf(g)}
              title={`${categoryIcon(nameOf(g))} ${nameOf(g)}`}
              count={`${onListIn(g.rows)}/${g.rows.length}`}
              defaultOpen={g.rows.length === 0}
            >
              <BlueprintCategoryBody category={g.category} rows={g.rows} data={data} />
            </CategoryGroup>
          ))}
        </>
      )}
    </div>
  )
}

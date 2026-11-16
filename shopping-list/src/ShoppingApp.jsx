import { useState } from 'react'
import { History, Home, ListChecks, Settings2, Star, X } from 'lucide-react'
import ConnectionBadge from './components/ConnectionBadge'
import CategoryManager from './components/CategoryManager'
import TabBar from './components/TabBar'
import { useShoppingData } from './hooks/useShoppingData'
import BlueprintView from './views/BlueprintView'
import FavoritesView from './views/FavoritesView'
import HistoryView from './views/HistoryView'
import ListView from './views/ListView'
import { t } from './lib/strings'

/**
 * App shell. To add a screen: create a view in src/views, then add one entry here.
 */
export default function ShoppingApp() {
  const data = useShoppingData()
  const [tab, setTab] = useState('list')
  const [managingCategories, setManagingCategories] = useState(false)

  const pendingCount = data.items.filter((i) => !i.checked).length
  const doneCount = data.items.length - pendingCount

  const tabs = [
    { id: 'list', label: t.tabs.list, icon: ListChecks, badge: pendingCount, View: ListView },
    { id: 'blueprint', label: t.tabs.blueprint, icon: Home, View: BlueprintView },
    { id: 'favorites', label: t.tabs.favorites, icon: Star, View: FavoritesView },
    { id: 'history', label: t.tabs.history, icon: History, View: HistoryView },
  ]
  const ActiveView = tabs.find((x) => x.id === tab).View

  return (
    <div className="mx-auto min-h-screen max-w-xl pb-28">
      <header className="sticky top-0 z-20 bg-emerald-600 pt-[env(safe-area-inset-top)] text-white shadow">
        <div className="flex h-14 items-center gap-3 px-4">
          <h1 className="flex-1 text-xl font-bold">{t.appName}</h1>
          {data.items.length > 0 && (
            <span className="text-sm text-emerald-50">
              {doneCount}/{data.items.length}
            </span>
          )}
          <ConnectionBadge status={data.connection} />
          <button
            type="button"
            onClick={() => setManagingCategories(true)}
            aria-label={t.categories.title}
            className="flex h-10 w-10 items-center justify-center rounded-full active:bg-white/20"
          >
            <Settings2 size={22} />
          </button>
        </div>
      </header>

      {data.error && (
        <div className="mx-4 mt-3 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">
          <p className="min-w-0 flex-1 break-words">{data.error}</p>
          <button type="button" onClick={data.dismissError} aria-label={t.error.dismiss}>
            <X size={18} />
          </button>
        </div>
      )}

      <main className="px-4">{data.loading ? null : <ActiveView data={data} />}</main>

      <TabBar tabs={tabs} active={tab} onChange={setTab} />

      {managingCategories && (
        <CategoryManager
          categories={data.categories}
          onAdd={data.addCategory}
          onRename={data.renameCategory}
          onDelete={data.deleteCategory}
          onClose={() => setManagingCategories(false)}
        />
      )}
    </div>
  )
}

/** Bottom tab bar (thumb-reachable). `tabs` = [{ id, label, icon, badge? }]. */
export default function TabBar({ tabs, active, onChange }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-stone-200 bg-white pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-xl">
        {tabs.map(({ id, label, icon: Icon, badge }) => {
          const isActive = id === active
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex h-16 flex-1 flex-col items-center justify-center gap-0.5 text-xs font-medium ${
                isActive ? 'text-emerald-700' : 'text-stone-500'
              }`}
            >
              <Icon size={24} />
              {label}
              {badge > 0 && (
                <span className="absolute top-2 ms-6 min-w-5 rounded-full bg-emerald-600 px-1.5 text-center text-[11px] font-bold leading-5 text-white">
                  {badge}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

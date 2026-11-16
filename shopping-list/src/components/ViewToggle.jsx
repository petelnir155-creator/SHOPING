/** Small segmented control. options = [{ id, icon: Icon, label }]. */
export default function ViewToggle({ options, value, onChange }) {
  return (
    <div role="group" className="flex overflow-hidden rounded-lg bg-stone-200 p-0.5">
      {options.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          aria-pressed={value === id}
          aria-label={label}
          className={`flex h-8 w-9 items-center justify-center rounded-md transition-colors ${
            value === id ? 'bg-white text-rose-600 shadow-sm' : 'text-stone-500'
          }`}
        >
          <Icon size={18} />
        </button>
      ))}
    </div>
  )
}

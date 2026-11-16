import { DatabaseZap } from 'lucide-react'
import { t } from '../lib/strings'

export default function SetupNotice() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="max-w-sm rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-stone-200">
        <DatabaseZap className="mx-auto mb-3 text-emerald-600" size={40} />
        <h1 className="mb-2 text-xl font-bold">{t.setup.title}</h1>
        <p className="text-stone-600">{t.setup.body}</p>
      </div>
    </div>
  )
}

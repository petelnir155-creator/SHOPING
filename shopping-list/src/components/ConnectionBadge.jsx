import { useEffect, useState } from 'react'
import { Wifi, Loader2 } from 'lucide-react'
import { t } from '../lib/strings'

const SETTLE_MS = 1500

/**
 * Two states only, both white on the header: "מחובר" and "מתחבר…".
 * There is no "offline" wording, and short blips (phone waking up, brief
 * reconnects) are hidden: "מתחבר…" appears only after SETTLE_MS of no connection.
 */
export default function ConnectionBadge({ status }) {
  const [shown, setShown] = useState(status === 'connected' ? 'connected' : 'connecting')

  useEffect(() => {
    const next = status === 'connected' ? 'connected' : 'connecting'
    if (next === 'connected') {
      setShown(next)
      return undefined
    }
    const id = setTimeout(() => setShown(next), SETTLE_MS)
    return () => clearTimeout(id)
  }, [status])

  const Icon = shown === 'connected' ? Wifi : Loader2
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 text-xs text-white ${
        shown === 'connected' ? '' : 'animate-pulse'
      }`}
    >
      <Icon size={14} />
      {t.status[shown]}
    </span>
  )
}

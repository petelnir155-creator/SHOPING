import { Wifi, WifiOff, Loader2 } from 'lucide-react'
import { t } from '../lib/strings'

const STYLES = {
  connected: { icon: Wifi, cls: 'bg-white/20 text-white' },
  connecting: { icon: Loader2, cls: 'bg-white/20 text-white animate-pulse' },
  offline: { icon: WifiOff, cls: 'bg-amber-300 text-stone-900' },
}

export default function ConnectionBadge({ status }) {
  const { icon: Icon, cls } = STYLES[status] ?? STYLES.connecting
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${cls}`}>
      <Icon size={14} />
      {t.status[status]}
    </span>
  )
}

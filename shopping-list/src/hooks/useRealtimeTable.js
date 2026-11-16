import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const upsertById = (list, row) =>
  list.some((r) => r.id === row.id)
    ? list.map((r) => (r.id === row.id ? { ...r, ...row } : r))
    : [...list, row]

/**
 * Generic "live table" hook: loads a table, then keeps it in sync through
 * Supabase Realtime (INSERT / UPDATE / DELETE). To sync a new table in the
 * future, call this hook once with its name.
 *
 * It also re-fetches whenever the channel (re)connects and whenever the
 * phone's screen comes back, so nothing is missed while the phone sleeps.
 */
export function useRealtimeTable(table, { orderBy = 'created_at', ascending = true, limit } = {}) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [status, setStatus] = useState('connecting') // 'connecting' | 'connected' | 'offline'

  const reload = useCallback(async () => {
    let query = supabase.from(table).select('*').order(orderBy, { ascending })
    if (limit) query = query.limit(limit)
    const { data, error: err } = await query
    if (err) {
      setError(err.message)
    } else {
      setRows(data)
      setError(null)
    }
    setLoading(false)
  }, [table, orderBy, ascending, limit])

  useEffect(() => {
    reload()

    const channel = supabase
      .channel(`realtime:${table}`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, (payload) => {
        if (payload.eventType === 'DELETE') {
          setRows((list) => list.filter((r) => r.id !== payload.old.id))
        } else {
          setRows((list) => upsertById(list, payload.new))
        }
      })
      .subscribe((s) => {
        if (s === 'SUBSCRIBED') {
          setStatus('connected')
          reload() // catch up on anything missed while disconnected
        } else if (['CHANNEL_ERROR', 'TIMED_OUT', 'CLOSED'].includes(s)) {
          setStatus('offline')
        }
      })

    const onVisible = () => document.visibilityState === 'visible' && reload()
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      supabase.removeChannel(channel)
    }
  }, [table, reload])

  return { rows, setRows, loading, error, status, reload }
}

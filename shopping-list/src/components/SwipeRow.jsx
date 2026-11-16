import { useRef, useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { t } from '../lib/strings'

const ACTIONS_WIDTH = 128 // two 64px buttons
const LOCK_PX = 8 // movement before we decide horizontal swipe vs. vertical scroll

/**
 * Swipe a row to the RIGHT to reveal Edit / Delete on its left side.
 * Vertical scrolling is untouched. Tap the row (or swipe back) to close.
 */
export default function SwipeRow({ onEdit, onDelete, children }) {
  const [offset, setOffset] = useState(0)
  const [dragging, setDragging] = useState(false)
  const gesture = useRef(null)
  const justDragged = useRef(false)

  const clamp = (v) => Math.min(ACTIONS_WIDTH, Math.max(0, v))
  const close = () => setOffset(0)

  const onPointerDown = (e) => {
    gesture.current = { id: e.pointerId, x: e.clientX, y: e.clientY, base: offset, lock: null }
  }

  const onPointerMove = (e) => {
    const g = gesture.current
    if (!g || g.id !== e.pointerId) return
    const dx = e.clientX - g.x
    const dy = e.clientY - g.y
    if (!g.lock) {
      if (Math.abs(dx) > LOCK_PX && Math.abs(dx) > Math.abs(dy)) {
        g.lock = 'h'
        e.currentTarget.setPointerCapture(e.pointerId)
        setDragging(true)
      } else if (Math.abs(dy) > LOCK_PX) {
        g.lock = 'v'
      }
    }
    if (g.lock === 'h') setOffset(clamp(g.base + dx))
  }

  const endGesture = () => {
    const g = gesture.current
    gesture.current = null
    if (g?.lock !== 'h') return
    justDragged.current = true // swallow the click that follows a drag
    setTimeout(() => (justDragged.current = false), 60)
    setDragging(false)
    setOffset((o) => (o > ACTIONS_WIDTH / 2 ? ACTIONS_WIDTH : 0))
  }

  const onClickCapture = (e) => {
    if (justDragged.current) {
      e.stopPropagation()
      e.preventDefault()
    } else if (offset > 0) {
      e.stopPropagation()
      e.preventDefault()
      close()
    }
  }

  const isOpen = offset > 0
  const run = (fn) => () => {
    close()
    fn()
  }

  return (
    <div
      className="relative touch-pan-y select-none overflow-hidden"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endGesture}
      onPointerCancel={endGesture}
    >
      <div className="absolute inset-y-0 left-0 flex" style={{ width: ACTIONS_WIDTH }}>
        <button
          type="button"
          tabIndex={isOpen ? 0 : -1}
          onClick={run(onEdit)}
          aria-label={t.item.edit}
          className="flex w-16 flex-col items-center justify-center gap-0.5 bg-sky-500 text-xs text-white active:bg-sky-600"
        >
          <Pencil size={18} />
          {t.item.edit}
        </button>
        <button
          type="button"
          tabIndex={isOpen ? 0 : -1}
          onClick={run(onDelete)}
          aria-label={t.item.delete}
          className="flex w-16 flex-col items-center justify-center gap-0.5 bg-red-500 text-xs text-white active:bg-red-600"
        >
          <Trash2 size={18} />
          {t.item.delete}
        </button>
      </div>

      <div
        onClickCapture={onClickCapture}
        className="relative bg-white"
        style={{
          transform: `translateX(${offset}px)`,
          transition: dragging ? 'none' : 'transform 150ms ease-out',
        }}
      >
        {children}
      </div>
    </div>
  )
}

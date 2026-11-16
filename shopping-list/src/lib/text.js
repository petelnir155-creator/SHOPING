/** Normalised key used to compare item names ("חלב " === "חלב"). */
export const nameKey = (name = '') => name.trim().toLowerCase()

/**
 * Quick-add parsing: "חלב x2" or "milk ×3" -> { name: 'חלב', quantity: '2' }.
 * Anything else is just a name with quantity "1".
 */
export function parseQuickAdd(text) {
  const raw = text.trim()
  const match = raw.match(/^(.+?)\s+[x×]\s*(\d+)$/i)
  if (match) return { name: match[1].trim(), quantity: match[2] }
  return { name: raw, quantity: '1' }
}

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('he-IL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

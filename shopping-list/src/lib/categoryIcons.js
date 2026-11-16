/**
 * Emoji icon for a category, picked by keywords in its NAME (so renamed or newly
 * created categories get a fitting icon too). First match wins, so specific
 * entries come first. Unknown names fall back to a shopping cart.
 * To add a look: add a row here.
 */
const ICONS = [
  { icon: '🧊', keywords: ['קפוא', 'גלידה'] },
  { icon: '🍿', keywords: ['חטיפ', 'חטיף', 'ממתק', 'מתוק', 'עוגיות', 'שוקולד', 'נשנוש'] },
  { icon: '🐾', keywords: ['חיות', 'חתול', 'כלב'] },
  { icon: '👶', keywords: ['תינוק', 'ילדים', 'חיתול'] },
  { icon: '🥩', keywords: ['קצב', 'בשר', 'עוף', 'דגים'] },
  { icon: '🥛', keywords: ['מקרר', 'חלב', 'גבינ'] },
  { icon: '🥬', keywords: ['ירקות', 'פירות', 'פרי'] },
  { icon: '🍳', keywords: ['בישול', 'אפייה', 'אפיה'] },
  { icon: '🥐', keywords: ['מאפ', 'לחם', 'קונדיט'] },
  { icon: '🥫', keywords: ['מזווה', 'יבש', 'שימורים'] },
  { icon: '🥤', keywords: ['שתייה', 'שתיה', 'סודה', 'משקאות', 'בירה', 'יין'] },
  { icon: '🧻', keywords: ['ניקיון', 'תחזוקת', 'כביסה'] },
  { icon: '🧴', keywords: ['פארם', 'היגיינה', 'טיפוח', 'תרופות'] },
]

export const DEFAULT_CATEGORY_ICON = '🛒'

export function categoryIcon(name = '') {
  const n = name.toLowerCase()
  return ICONS.find(({ keywords }) => keywords.some((k) => n.includes(k)))?.icon ?? DEFAULT_CATEGORY_ICON
}

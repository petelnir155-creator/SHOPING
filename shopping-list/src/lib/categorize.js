/**
 * Smart category detection from an item name.
 *
 * Order of trust:
 *   1. exact match in the Household Blueprint (curated, always right)
 *   2. keyword dictionary below (longest keyword wins: "נייר אפייה" beats "נייר")
 *   3. exact match in favorites / history
 *   4. partial match against blueprint / favorites / history names
 * Returns a category id, or null when nothing fits (the caller then uses "Other").
 *
 * Active list items are deliberately NOT used for learning, so a one-time
 * mis-filed item can never teach the wrong category.
 *
 * To teach it new words: add them to the matching category in RULES.
 * Category names must equal the names in the categories table.
 */

const RULES = [
  {
    category: 'מקרר ומוצרי בסיס',
    keywords: [
      'חלב', 'משקה סויה', 'משקה שקדים', 'משקה שיבולת שועל', 'ביצים', 'ביצה', 'גבינה', 'גבינות', 'לבנה',
      'קוטג', 'יוגורט', 'שמנת', 'חמאה', 'מרגרינה', 'ממרח', 'ממרחים', 'קטשופ', 'מיונז', 'חרדל',
      'טחינה', 'חמוצים', 'מלפפונים חמוצים', 'זיתים', 'טופו', 'חומוס', 'סלט', 'נקניק', 'נקניקיות',
      'מעדן', 'מעדנים', 'פודינג', 'קפיר', 'שוקו', 'לאבנה', 'גבינת', 'מוצרלה', 'פטה', 'שמנת חמוצה',
    ],
  },
  {
    category: 'ירקות ופירות',
    keywords: [
      'עגבני', 'מלפפון', 'מלפפונים', 'בצל', 'שום', 'בצל ירוק', 'כוסברה', 'פטרוזיליה', 'שמיר', 'נענע',
      'בזיליקום', 'תפוחי אדמה', 'תפוח', 'תפוחים', 'בטטה', 'בטטות', 'לימון', 'לימונים', 'פלפל', 'פלפלים',
      'פלפל חריף', 'גזר', 'חסה', 'כרוב', 'כרובית', 'ברוקולי', 'קישוא', 'חציל', 'דלעת', 'פטריות',
      'אבוקדו', 'בננה', 'בננות', 'תפוז', 'תפוזים', 'אשכולית', 'ענבים', 'תותים', 'אבטיח', 'מלון',
      'אפרסק', 'שזיף', 'אגס', 'ירקות', 'פירות', 'סלרי', 'תרד', 'קייל', 'צנון', 'סלק', 'גינגר', 'נבטים',
      'קלמנטינה', 'רימון', 'מנגו', 'ענבים', 'תמר', 'תמרים', 'נקטרינה', 'עלי',
    ],
  },
  {
    category: 'בישול ואפייה',
    keywords: [
      'נייר אפייה', 'אפייה', 'נייר כסף', 'ניילון נצמד', 'אבקת אפייה', 'שמרים', 'וניל', 'קקאו',
      'תבנית', 'תבניות', 'קורנפלור', 'סוכר וניל', 'צלופן', 'שקיות הקפאה', 'ניילון',
    ],
  },
  {
    category: 'קצב, דגים ובישול ביתי',
    keywords: [
      'חזה עוף', 'עוף', 'כנפיים', 'שוקיים', 'פרגית', 'פרגיות', 'בשר', 'בקר', 'טחון', 'סטייק',
      'אנטריקוט', 'שניצל', 'קבב', 'המבורגר', 'דג', 'דגים', 'סלמון', 'אמנון', 'בורי', 'כבד', 'הודו',
      'עגל', 'כבש', 'צלי', 'עצמות', 'פילה', 'קציצות', 'דניס', 'לברק', 'טילאפיה',
    ],
  },
  {
    category: 'מזווה ויבש',
    keywords: [
      'פסטה', 'אורז', 'קוסקוס', 'שימורים', 'תירס', 'טונה', 'עגבניות מרוסקות', 'קפה', 'נמס', 'תה',
      'סוכר', 'מלח', 'קמח', 'רוטב', 'סויה', 'סילאן', 'שמן', 'שמן זית', 'חומץ', 'לחם', 'פיתה', 'פיתות',
      'לחמניות', 'לחמנייה', 'דבש', 'קורנפלקס', 'דגנים', 'שוקולד', 'וופל', 'עוגיות', 'חטיף', 'חטיפים',
      'במבה', 'ביסלי', 'אגוזים', 'שקדים', 'קטניות', 'עדשים', 'שעועית', 'פתיתים', 'אטריות', 'נודלס',
      'מרק', 'תבלין', 'תבלינים', 'פפריקה', 'כמון', 'אורגנו', 'קינמון', 'ריבה', 'גרנולה', 'שיבולת שועל',
      'קרקרים', 'צנימים', 'טורטייה', 'חומוס יבש', 'גרעינים', 'צימוקים', 'בורגול', 'פולנטה',
    ],
  },
  {
    category: 'שתייה וסודסטרים',
    keywords: [
      'בלוני גז', 'בלון גז', 'גז', 'סודסטרים', 'סודה', 'סירופ', 'סירופים', 'טעמים', 'מים', 'מים מינרליים',
      'מינרליים', 'בירה', 'בירות', 'יין', 'יינות', 'וויסקי', 'וודקה', 'ערק', 'מיץ', 'משקה', 'קולה',
      'פפסי', 'ספרייט', 'שתייה', 'שתיה', 'אלכוהול', 'פחיות', 'נביעות',
    ],
  },
  {
    category: 'תחזוקת הבית וניקיון',
    keywords: [
      'נייר טואלט', 'טואלט', 'נייר סופג', 'מגבונים', 'נוזל כלים', 'סבון כלים', 'סקוצים', 'סקוץ', 'ספוג',
      'שקיות זבל', 'זבל', 'אקונומיקה', 'ניקוי', 'מנקה', 'אבקת כביסה', 'כביסה', 'מרכך כביסה', 'דטרגנט',
      'נרות', 'סוללות', 'נורה', 'נורות', 'מטליות', 'מטלית', 'מגב', 'מטאטא', 'שקיות', 'מסיר שומנים',
      'טבליות למדיח', 'מדיח', 'מלח למדיח', 'מנקה רצפות', 'מחטא', 'מפיות', 'כוסות חד פעמי',
    ],
  },
  {
    category: 'פארם והיגיינה',
    keywords: [
      'משחת שיניים', 'שיניים', 'מברשת', 'מברשות', 'שמפו', 'מרכך', 'סבון', 'דאודורנט', 'טישו',
      'צמר גפן', 'תחבושת', 'תחבושות', 'טמפונים', 'פדים', 'חיתולים', 'קרם', 'תרופה', 'אקמול',
      'נורופן', 'ויטמין', 'ויטמינים', 'פלסטר', 'פלסטרים', 'גילוח', 'סכיני גילוח', 'בושם', 'חוט דנטלי',
      'מי פה', 'קוטונטה', 'מקלוני אוזניים', 'קרם הגנה', 'מסכה',
    ],
  },
  {
    category: 'חיות מחמד',
    keywords: [
      'חול לחתולים', 'אוכל לחתולים', 'חתול', 'חתולים', 'כלב', 'כלבים', 'חול', 'מזון לחיות', 'חיות',
      'אוכל לכלבים', 'עצם לכלב', 'כלוב', 'קולר', 'רצועה', 'פינוקים לחתול', 'פינוקים לכלב',
    ],
  },
]

/** Lower-case, drop apostrophes/quotes ("קוטג'" -> "קוטג"), other punctuation -> spaces. */
const norm = (s = '') =>
  s
    .replace(/['"׳״’`]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()

const COMPILED = RULES.flatMap(({ category, keywords }) =>
  keywords.map((k) => {
    const kw = norm(k)
    return { category, kw, multi: kw.includes(' ') }
  }),
)

// Hebrew one-letter prefixes: "לחתולים" -> "חתולים"
const PREFIXES = new Set(['ה', 'ו', 'ב', 'ל', 'ש', 'מ', 'כ'])
const variants = (w) => (w.length > 3 && PREFIXES.has(w[0]) ? [w, w.slice(1)] : [w])

function keywordMatches({ kw, multi }, words, padded) {
  if (multi) return padded.includes(` ${kw}`)
  return words.some((w) =>
    variants(w).some(
      (v) =>
        v === kw ||
        (kw.length >= 4 && v.startsWith(kw)) ||
        v === `${kw}ים` ||
        v === `${kw}ות`,
    ),
  )
}

/** Category NAME for the best keyword hit (longest keyword wins), or null. */
function matchRules(q) {
  const words = q.split(' ')
  const padded = ` ${q} `
  let best = null
  for (const entry of COMPILED) {
    if (!keywordMatches(entry, words, padded)) continue
    if (!best || entry.kw.length > best.kw.length) best = entry
  }
  return best?.category ?? null
}

export function detectCategory({ text, categories, blueprint = [], favorites = [], history = [] }) {
  const q = norm(text)
  if (q.length < 2) return null

  const validIds = new Set(categories.map((c) => c.id))
  const idByName = new Map(categories.map((c) => [c.name, c.id]))
  const usable = (r) => r.category_id && validIds.has(r.category_id)
  const exact = (list) => list.find((r) => usable(r) && norm(r.name) === q)

  const fromBlueprint = exact(blueprint)
  if (fromBlueprint) return fromBlueprint.category_id

  const ruleCategory = matchRules(q)
  if (ruleCategory && idByName.has(ruleCategory)) return idByName.get(ruleCategory)

  const fromKnown = exact(favorites) ?? exact(history)
  if (fromKnown) return fromKnown.category_id

  if (q.length >= 3) {
    const partial = [...blueprint, ...favorites, ...history].find((r) => {
      if (!usable(r)) return false
      const n = norm(r.name)
      return n.includes(q) || (n.length >= 3 && q.includes(n))
    })
    if (partial) return partial.category_id
  }
  return null
}

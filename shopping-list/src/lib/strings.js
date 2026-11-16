/**
 * All user-facing text lives here (Hebrew). Components never hard-code copy,
 * so translating or tweaking wording is a one-file change.
 */
export const t = {
  appName: 'מה חסר בבית?',
  uncategorized: 'אחר',
  units: { unit: 'יח׳', kg: 'ק״ג' },

  tabs: { list: 'רשימה', blueprint: 'קטגוריות', favorites: 'מועדפים', history: 'היסטוריה' },
  status: { connected: 'מחובר', connecting: 'מתחבר…' },

  add: {
    placeholder: 'מה קונים?',
    submit: 'הוספה',
    category: 'קטגוריה',
    auto: 'קטגוריה: אוטומטי',
    autoWithName: (name) => `אוטומטי · ${name}`,
  },

  list: {
    empty: 'הרשימה ריקה',
    emptyHint: 'הוסיפו פריט למעלה, או בחרו ממועדפים והיסטוריה',
    completed: 'הושלמו',
    finish: 'סיום קנייה',
    finishHint: 'שומר להיסטוריה ומנקה את הרשימה',
  },

  item: {
    name: 'שם',
    quantity: 'כמות',
    category: 'קטגוריה',
    save: 'שמירה',
    cancel: 'ביטול',
    delete: 'מחיקה',
    edit: 'עריכה',
    note: 'הערה',
    notePlaceholder: 'הערה (למשל: נשאר חצי בקבוק)',
    quantityPlaceholder: 'כמות',
    favorite: 'הוספה למועדפים',
    unfavorite: 'הסרה ממועדפים',
    add: 'הוספה לרשימה',
    onList: 'כבר ברשימה',
  },

  blueprint: {
    empty: 'רשימת הבסיס ריקה',
    emptyHint: 'הוסיפו קטגוריה דרך כפתור ההגדרות בראש המסך',
    summary: (on, total) => `${on} מתוך ${total} סומנו לקנייה`,
    hint: 'לחצו על פריט כדי לסמן אותו לקנייה (V). החליקו ימינה כדי למחוק אותו מהרשימה הקבועה.',
    addMissing: 'סמנו את כל הקטגוריה',
    remove: 'הסרה מהרשימה',
    emptyCategory: 'אין עדיין פריטים בקטגוריה הזו',
    addPlaceholder: (category) => `הוספת פריט ל${category}`,
    addToCategory: 'הוספה',
    back: 'חזרה לקטגוריות',
    itemCount: (n) => `${n} פריטים`,
    view: { grid: 'תצוגת אייקונים', list: 'תצוגת רשימה' },
    duplicate: (name) => `"${name}" כבר קיים ברשימת הקטגוריות`,
  },

  favorites: {
    empty: 'עוד אין מועדפים',
    emptyHint: 'סמנו כוכב ליד פריט ברשימה או בהיסטוריה כדי לשמור אותו כאן',
  },

  history: {
    empty: 'עוד אין היסטוריית קניות',
    emptyHint: 'לחצו "סיום קנייה" ברשימה כדי לשמור קנייה כאן',
    addAll: 'הוספת הכל',
    deleteTrip: 'מחיקת קנייה',
    confirmDeleteTrip: 'למחוק את הקנייה הזו מההיסטוריה?',
    itemCount: (n) => `${n} פריטים`,
  },

  categories: {
    title: 'ניהול קטגוריות',
    newPlaceholder: 'קטגוריה חדשה',
    add: 'הוספה',
    close: 'סגירה',
    confirmDelete: (name) => `למחוק את "${name}"? הפריטים שלה יעברו ל"אחר".`,
  },

  error: { dismiss: 'סגירה' },

  setup: {
    title: 'צריך לחבר את Supabase',
    body: 'צרו קובץ .env.local לפי .env.example, מלאו את VITE_SUPABASE_URL ו-VITE_SUPABASE_ANON_KEY והפעילו מחדש את שרת הפיתוח.',
  },
}

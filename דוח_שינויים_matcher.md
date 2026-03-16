# דוח שינויים — מערכת התאמת הצעות מחיר מול חשבוניות

## תאריך: 16.3.2026
## Commit: a4a892f

---

## סיכום כללי

נוספה מערכת חדשה בנתיב `/matcher` לאתר d-one1.com.
המערכת מאפשרת לרואה חשבון להעלות שני קבצי Excel (שנהב + חשבשבת),
לבצע התאמה אוטומטית לפי מספר עבודה, ולקבל דוח מפורט + ייצוא Excel.

**20 קבצים שונו** (2 קיימים + 18 חדשים), סה"כ ~1,650 שורות קוד.

---

## שינויים בקבצים קיימים

### 1. `next.config.ts`
- **מה שונה:** הוסר `output: 'export'` ו-`images.unoptimized`
- **למה:** המצב הקודם (static export) לא תומך ב-API routes ו-middleware. הסרת ההגדרה מאפשרת deployment רגיל של Next.js על Vercel עם serverless functions
- **השפעה על האתר הקיים:** אין — כל הדפים הקיימים סטטיים ממילא וימשיכו לעבוד

### 2. `app/globals.css`
- **מה שונה:** נוסף `input[type="password"]` לרשימת ה-inputs שמקבלים cursor רגיל (text) במקום הcursor המותאם של האתר
- **למה:** בלי זה, שדה הסיסמה מקבל את הcursor של הדולר, מה שמבלבל

### 3. `package.json` / `package-lock.json`
- **מה שונה:** נוספו 2 תלויות: `jose` (JWT) ו-`xlsx` (SheetJS)

---

## קבצים חדשים

### מערכת אימות (Auth)

| קובץ | תיאור |
|-------|--------|
| `middleware.ts` | מגן על כל הנתיבים תחת `/matcher/*` (חוץ מ-login). בודק JWT cookie בשם `matcher_token`. אם אין או לא תקף → redirect ל-`/matcher/login` |
| `app/api/matcher/auth/route.ts` | API route שמקבל POST עם סיסמה, משווה ל-`MATCHER_PASSWORD` מ-env, ובהצלחה יוצר JWT עם `jose` ומגדיר cookie ל-7 ימים |
| `app/matcher/login/page.tsx` | דף כניסה — שדה סיסמה בלבד, עיצוב מרכזי עם לוגו Done1, loading state, הודעת שגיאה |
| `app/matcher/layout.tsx` | Layout למערכת ההתאמה — header עם לוגו, כותרת "מערכת התאמה", וכפתור יציאה |

### טיפוסים ופרסור

| קובץ | תיאור |
|-------|--------|
| `lib/matcher/types.ts` | כל הinterfaces: `QuoteRecord`, `InvoiceRecord`, `ColumnMapping`, `MatchResult`, `MatchReport`, `UploadedFile` |
| `lib/matcher/parse-shenhav.ts` | פרסור קובץ שנהב — קורא Excel עם SheetJS, ממפה עמודות לפי בחירת המשתמש, מנרמל מספרי עבודה (מסיר אפסים מובילים, רווחים, מקפים) |
| `lib/matcher/parse-hashavshevet.ts` | פרסור קובץ חשבשבת — כמו שנהב + יכולת לחלץ מספר עבודה מתוך שדה "פרטים" חופשי באמצעות regex |

### מנוע ההתאמה

| קובץ | תיאור |
|-------|--------|
| `lib/matcher/matching-engine.ts` | הלוגיקה המרכזית: (1) בניית מפות lookup לפי מספר עבודה (2) זיהוי כפילויות (3) Forward match: הצעה→חשבונית (4) Reverse match: חשבונית→הצעה (5) בדיקת הפרשי סכומים (6) Integrity check — כל שורה מופיעה בדוח |

### רכיבי UI

| קובץ | תיאור |
|-------|--------|
| `components/matcher/FileUploader.tsx` | Drag & drop upload עם preview — מציג 3 שורות ראשונות + שמות עמודות. תומך xlsx/xls/csv. הגבלת 10MB |
| `components/matcher/ColumnMapper.tsx` | מיפוי עמודות — dropdowns לכל שדה נדרש. Auto-detect של שמות עמודות נפוצים בעברית ואנגלית. Collapsible |
| `components/matcher/SummaryCards.tsx` | 6 כרטיסים צבעוניים: הותאמו (ירוק), חסר חשבונית (אדום), חשבונית יתומה (כתום), הפרש סכום (צהוב), כפילויות (סגול), שגיאות (אפור). + שורת integrity check |
| `components/matcher/MatchTable.tsx` | טבלת תוצאות עם טאבים לפי סטטוס, חיפוש, מיון לפי עמודה, RTL |
| `components/matcher/ResultsDashboard.tsx` | מרכיב את SummaryCards + MatchTable + כפתורי ייצוא Excel והתאמה חדשה |

### דפים ו-API routes

| קובץ | תיאור |
|-------|--------|
| `app/matcher/page.tsx` | הדף הראשי — multi-step flow: העלאת קבצים → מיפוי עמודות → עיבוד (עם spinner) → תוצאות |
| `app/api/matcher/process/route.ts` | מקבל FormData עם 2 קבצים + JSON מיפוי עמודות. מפעיל parsers + matching engine. מחזיר MatchReport |
| `app/api/matcher/export-excel/route.ts` | מקבל MatchReport ומייצר Excel עם 6 גיליונות: סיכום, הצעות ללא חשבונית, חשבוניות ללא הצעה, הפרשי סכומים, כל ההתאמות, log מלא. RTL |

---

## קבצי Environment נדרשים

חייב להגדיר ב-Vercel Dashboard → Settings → Environment Variables:

| משתנה | תיאור | דוגמה |
|-------|--------|--------|
| `MATCHER_PASSWORD` | הסיסמה לכניסה למערכת | `MySecurePass123` |
| `JWT_SECRET` | מפתח חתימה ל-JWT, חייב להיות ארוך | `a8f2k9d7...` (32+ תווים) |

**בלי הגדרת המשתנים האלה — המערכת לא תעבוד!**

---

## זרימת המשתמש

```
1. נכנס ל-d-one1.com/matcher
2. Middleware מפנה ל-/matcher/login
3. מזין סיסמה → JWT cookie נשמר ל-7 ימים
4. מועבר ל-/matcher — דף ראשי
5. מעלה קובץ שנהב (drag & drop או בחירה)
6. מעלה קובץ חשבשבת
7. מוודא מיפוי עמודות (auto-detect + ידני)
8. לוחץ "בצע התאמה"
9. רואה דוח: כרטיסי סיכום + טבלה מפורטת
10. מוריד דוח Excel
```

---

## סטטוסים אפשריים בדוח

| סטטוס | סימון | משמעות |
|--------|--------|---------|
| MATCHED | ירוק | הצעה + חשבונית נמצאו, סכומים זהים |
| MISSING_INVOICE | אדום | יש הצעה, אין חשבונית |
| ORPHAN_INVOICE | כתום | יש חשבונית, אין הצעה |
| AMOUNT_MISMATCH | צהוב | נמצא זוג אבל סכומים שונים (הפרש > 1₪) |
| DUPLICATE | סגול | מספר עבודה מופיע יותר מפעם אחת |
| PARSE_ERROR | אפור | שורה שלא ניתן לפרסר (מספר עבודה ריק) |

---

## בדיקת שלמות (Integrity Check)

בסוף כל ריצה, המערכת מוודאת:
- כל שורה מקובץ שנהב מופיעה בדוח (כולל שגיאות)
- כל שורה מקובץ חשבשבת מופיעה בדוח
- אם חסרות שורות → אזהרה אדומה

---

## הערה טכנית

Next.js 16 מציג אזהרה: `The "middleware" file convention is deprecated. Please use "proxy" instead.`
ה-middleware עדיין עובד, אבל בגרסאות עתידיות ייתכן שיצטרך להתעדכן לקונבנציית proxy.

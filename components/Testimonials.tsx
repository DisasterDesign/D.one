import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "בתחום הבנייה הניירת יכולה לקבור אותך. לפני דניאל הייתי רודף אחרי חשבוניות וספקים, והיום? אני בשטח בראש שקט. דניאל פשוט מסדר את הכל, מתנהל מול הספקים שלי ולא נותן לשום שקל ללכת לאיבוד.",
    name: "רונן אברהמי",
    title: "בעלים, אדירים יזמות ובנייה",
  },
  {
    quote: "חיפשתי מישהו שייקח ממני את החלק המעיק של הגבייה וההתעסקות האדמיניסטרטיבית כדי שאוכל נטו לעבוד על התיקים. דניאל נכנס לעניינים סופר מהר, הוא דיסקרטי, יסודי, וסוגר לי פינות בצורה אלגנטית.",
    name: "עו״ד יעל בר-נתן",
    title: "שותפה, בר-נתן ושות׳ עורכי דין",
  },
  {
    quote: "אין לי זמן להתעסק בבירוקרטיה, אני צריך לרוץ קדימה. דניאל הוא ה\"באק-אופיס\" הכי יעיל שיצא לי לעבוד איתו. זמין בטירוף, מתקתק עניינים, ופשוט נותן תחושה שיש על מי לסמוך.",
    name: "אסף כהן",
    title: "מנכ״ל, סטארט-אפ TechFlow",
  },
  {
    quote: "כעצמאית, הסדר בניירת היה הצד החלש שלי. דניאל עשה לי סדר בבלגן של הקבלות וההוצאות בצורה שלא האמנתי שאפשרית. השירות שלו חוסך לי המון כאב ראש והרבה כסף שהיה מתפספס.",
    name: "שרי גולן",
    title: "אדריכלית ומעצבת פנים, סטודיו SG",
  },
  {
    quote: "וואלה, מאז שדניאל מטפל לי בעניינים אני ישן טוב בלילה. הבנאדם מקצוען, ישר כמו סרגל, ולא משאיר קצוות פתוחים. כל הבלגן של הניירת מול רשויות ומול ספקים? הכל עליו.",
    name: "דודו מלכה",
    title: "בעלים, מוסך הציר המרכזי",
  },
  {
    quote: "בהפקות יש תקופות של לחץ מטורף ומיליון ספקים קטנים. דניאל הוא העוגן שלי בתוך הכאוס הזה. הוא דואג שהכל ישולם בזמן, שהכל מתועד, ושאני לא צריכה לרדוף אחרי אף אחד.",
    name: "נועה לביא",
    title: "מפיקת אירועים, Lavi Productions",
  },
  {
    quote: "אני רואה הרבה עסקים שנופלים על חוסר סדר. כשאני מפנה לקוחות לדניאל, אני יודע שהם בידיים טובות. השילוב של הידע שלו בחשבונאות עם היכולת האדמיניסטרטיבית זה בדיוק מה שבעל עסק צריך.",
    name: "עידן סלע",
    title: "יועץ עסקי ופיננסי",
  },
  {
    quote: "דניאל הוא לא עוד נותן שירות, הוא ממש שותף לדרך. תמיד זמין לשאלות, תמיד עם חיוך, ותמיד פותר בעיות לפני שהן צצות. הוא הוריד ממני את כל העומס של המשרד.",
    name: "מיטל בן-דוד",
    title: "בעלת רשת בוטיק שיק & סטייל",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block bg-[#0090D5]/10 text-[#0090D5] px-4 py-2 rounded-full text-sm font-medium mb-4">
            מה הלקוחות אומרים
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#142850] mb-4">
            לקוחות ממליצים
          </h2>
          <p className="text-lg text-[#666666]">
            מאות לקוחות מרוצים כבר נהנים משקט נפשי פיננסי
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative bg-[#F7F9FB] rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow border border-gray-100 flex flex-col"
            >
              {/* Quote Icon */}
              <div className="absolute -top-3 right-5">
                <div className="w-8 h-8 bg-[#0090D5] rounded-full flex items-center justify-center">
                  <Quote size={16} className="text-white" />
                </div>
              </div>

              {/* Decorative Line */}
              <div className="w-12 h-1 bg-gradient-to-r from-[#0090D5] to-[#142850] rounded-full mb-4 mt-3" />

              {/* Quote Text */}
              <p className="text-[#333333] leading-relaxed mb-4 text-sm flex-grow">
                &quot;{testimonial.quote}&quot;
              </p>

              {/* Author */}
              <div className="pt-3 border-t border-gray-200">
                <h4 className="font-bold text-[#142850] text-sm">{testimonial.name}</h4>
                <p className="text-xs text-[#888888]">{testimonial.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Stats */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-8 bg-[#142850] rounded-2xl px-8 py-6">
            <div className="text-white">
              <div className="text-3xl font-bold text-[#0090D5]">500+</div>
              <div className="text-sm text-white/70">לקוחות מרוצים</div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-white">
              <div className="text-3xl font-bold text-[#0090D5]">4.9/5</div>
              <div className="text-sm text-white/70">דירוג ממוצע</div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-white">
              <div className="text-3xl font-bold text-[#0090D5]">100%</div>
              <div className="text-sm text-white/70">ממליצים</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

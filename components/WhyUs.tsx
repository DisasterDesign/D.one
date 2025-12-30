import { Zap, HeartHandshake, TrendingUp } from "lucide-react";

const reasons = [
  {
    icon: Zap,
    title: "דיגיטלי ומהיר",
    description: "עבודה ללא קלסרים וניירת מיותרת. הכל דיגיטלי, מאורגן ונגיש בכל רגע.",
    gradient: "from-[#0090D5] to-[#142850]",
  },
  {
    icon: HeartHandshake,
    title: "זמינות אישית",
    description: "מענה ישיר מהצוות הפיננסי שלך. לא מזכירה, לא מתנות - ישירות לעניין.",
    gradient: "from-[#142850] to-[#0090D5]",
  },
  {
    icon: TrendingUp,
    title: "מקצועיות ללא פשרות",
    description: "ידע עדכני בכל חוקי המס והשתלמויות מקצועיות שוטפות לשירותך.",
    gradient: "from-[#0090D5] to-[#142850]",
  },
];

export default function WhyUs() {
  return (
    <section className="py-20 bg-[#142850] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#0090D5] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#0090D5] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
            למה לבחור בנו
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            היתרונות שלנו
          </h2>
          <p className="text-lg text-white/70">
            אנחנו לא סתם עוד משרד - אנחנו השותף הפיננסי לפרויקט שלך
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div
              key={reason.title}
              className="text-center group"
            >
              {/* Icon */}
              <div className="relative inline-flex mb-6">
                <div className={`w-20 h-20 bg-gradient-to-br ${reason.gradient} rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                  <reason.icon size={40} className="text-white" />
                </div>
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${reason.gradient} rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity`} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3">
                {reason.title}
              </h3>
              <p className="text-white/70 leading-relaxed max-w-sm mx-auto">
                {reason.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-white/10">
          {[
            { number: "20+", label: "שנות ניסיון" },
            { number: "500+", label: "לקוחות מרוצים" },
            { number: "100%", label: "שביעות רצון" },
            { number: "24/7", label: "זמינות" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-[#0090D5] mb-2">
                {stat.number}
              </div>
              <div className="text-white/60 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

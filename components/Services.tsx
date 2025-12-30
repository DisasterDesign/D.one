"use client";

import {
  Building2,
  Landmark,
  HardHat,
  Calculator,
  FileText,
  Users,
  MessageCircle
} from "lucide-react";

const services = [
  {
    icon: Building2,
    title: "ליווי פיננסי לפרויקטי בנייה",
    description: "ניהול תזרים, בקרה תקציבית ודיווח שוטף לכל שלבי הפרויקט.",
    color: "bg-[#0090D5]",
    whatsappMessage: "היי דניאל, אני מתעניין בליווי פיננסי לפרויקט בנייה",
  },
  {
    icon: Landmark,
    title: "ניהול יזום נדל\"ן",
    description: "ליווי מלא בניהול פיננסי של פרויקטי יזום - מרכישת קרקע ועד מסירה.",
    color: "bg-[#142850]",
    whatsappMessage: "היי דניאל, אני מתעניין בניהול יזום נדל\"ן",
  },
  {
    icon: HardHat,
    title: "ליווי שלבי ביצוע בנייה",
    description: "בקרת עלויות, ניהול תשלומים לקבלני משנה ואישורי חשבונות.",
    color: "bg-[#0090D5]",
    whatsappMessage: "היי דניאל, אני מתעניין בליווי ביצוע בנייה",
  },
  {
    icon: Calculator,
    title: "ייעוץ מס ותכנון פיננסי",
    description: "אופטימיזציה מיסויית לעסקאות נדל\"ן ותכנון מס לטווח ארוך.",
    color: "bg-[#142850]",
    whatsappMessage: "היי דניאל, אני מתעניין בייעוץ מס לחברת בנייה",
  },
  {
    icon: FileText,
    title: "הנהלת חשבונות לחברות בנייה",
    description: "ניהול שוטף מותאם לענף הבנייה - ספקים, קבלני משנה ודיווחים.",
    color: "bg-[#0090D5]",
    whatsappMessage: "היי דניאל, אני מתעניין בהנהלת חשבונות לחברת בנייה",
  },
  {
    icon: Users,
    title: "ניהול שכר לעובדי בנייה",
    description: "תלושי שכר, דיווחי עובדים זרים ועמידה ברגולציה.",
    color: "bg-[#142850]",
    whatsappMessage: "היי דניאל, אני מתעניין בניהול שכר לחברת בנייה",
  },
];

const openWhatsApp = (message: string) => {
  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/972509700263?text=${encodedMessage}`, '_blank');
};

export default function Services() {
  return (
    <section id="services" className="section-padding bg-[#F7F9FB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block bg-[#142850]/10 text-[#142850] px-4 py-2 rounded-full text-sm font-medium mb-4">
            מה אנחנו מציעים
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#142850] mb-4">
            השירותים שלנו
          </h2>
          <p className="text-lg text-[#666666]">
            מעטפת פיננסית מלאה לחברות יזום, קבלנים וחברות בנייה
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#0090D5]/30"
            >
              {/* Icon */}
              <div className={`w-14 h-14 ${service.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <service.icon size={28} className="text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-[#142850] mb-3">
                {service.title}
              </h3>
              <p className="text-[#666666] leading-relaxed mb-4">
                {service.description}
              </p>

              {/* WhatsApp Link */}
              <button
                onClick={() => openWhatsApp(service.whatsappMessage)}
                className="inline-flex items-center gap-2 text-[#0090D5] font-medium group-hover:gap-3 transition-all hover:text-[#007bb8]"
              >
                <MessageCircle size={18} />
                <span>דבר איתנו בוואטסאפ</span>
              </button>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-[#666666] mb-4">לא מצאת את מה שחיפשת?</p>
          <button
            onClick={() => openWhatsApp("היי דניאל, אני מתעניין לשמוע עוד על השירותים שלך")}
            className="inline-flex items-center gap-2 bg-[#0090D5] text-white px-8 py-4 rounded-full font-bold hover:bg-[#007bb8] transition-colors"
          >
            <MessageCircle size={20} />
            <span>דברו איתנו בוואטסאפ</span>
          </button>
        </div>
      </div>
    </section>
  );
}

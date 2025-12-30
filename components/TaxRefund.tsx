"use client";

import { useState } from "react";
import { Building2, MessageCircle, ArrowLeft, Send } from "lucide-react";

export default function TaxRefund() {
  const [customMessage, setCustomMessage] = useState("");
  const defaultMessage = "היי דניאל, אני מתעניין בליווי פיננסי לפרויקט בנייה";

  const openWhatsApp = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/972509700263?text=${encodedMessage}`, '_blank');
  };

  return (
    <section id="construction" className="section-padding bg-gradient-to-br from-[#0090D5] to-[#006d9e] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Building2 size={18} />
              <span className="text-sm font-medium">ליווי חברות יזום ובנייה</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              פרויקט בנייה בדרך?
              <span className="block mt-2">בוא נדבר על הליווי הפיננסי.</span>
            </h2>

            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              ניהול פיננסי של פרויקט בנייה דורש מומחיות ייחודית.
              אנחנו מלווים חברות יזום וקבלנים מהשלב הראשון ועד המסירה.
            </p>

            <ul className="space-y-4">
              {[
                "בקרת תקציב ותזרים לכל שלב בפרויקט",
                "ניהול תשלומים לקבלני משנה וספקים",
                "דיווח שוטף ושקיפות מלאה",
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Building2 size={16} />
                  </div>
                  <span className="text-white/90">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* WhatsApp CTA */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-[#142850] mb-2 text-center">
              שיחת ייעוץ ראשונית
            </h3>
            <p className="text-[#666666] mb-6 text-center text-lg">
              ספר לנו על הפרויקט שלך - <br />
              <span className="font-bold text-[#142850]">ונבנה לך תוכנית ליווי מותאמת!</span>
            </p>

            {/* Main WhatsApp Button with Arrows */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {/* Animated Arrows Right */}
              <div className="flex items-center">
                <ArrowLeft size={20} className="text-[#0090D5] animate-bounce-arrow" style={{ animationDelay: '0ms' }} />
                <ArrowLeft size={20} className="text-[#0090D5] animate-bounce-arrow" style={{ animationDelay: '150ms' }} />
                <ArrowLeft size={20} className="text-[#0090D5] animate-bounce-arrow" style={{ animationDelay: '300ms' }} />
              </div>

              {/* WhatsApp Button */}
              <button
                onClick={() => openWhatsApp(defaultMessage)}
                className="bg-[#0090D5] hover:bg-[#007bb8] text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-3 transition-all hover:scale-105 shadow-lg hover:shadow-xl whatsapp-pulse"
              >
                <MessageCircle size={24} />
                <span>בואו נדבר</span>
              </button>

              {/* Animated Arrows Left */}
              <div className="flex items-center">
                <ArrowLeft size={20} className="text-[#0090D5] rotate-180 animate-bounce-arrow-reverse" style={{ animationDelay: '0ms' }} />
                <ArrowLeft size={20} className="text-[#0090D5] rotate-180 animate-bounce-arrow-reverse" style={{ animationDelay: '150ms' }} />
                <ArrowLeft size={20} className="text-[#0090D5] rotate-180 animate-bounce-arrow-reverse" style={{ animationDelay: '300ms' }} />
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-[#888888] text-sm">או כתוב הודעה מותאמת</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Custom Message */}
            <div className="space-y-4">
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="ספר לנו על הפרויקט שלך..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0090D5] focus:ring-2 focus:ring-[#0090D5]/20 outline-none transition-all text-[#333333] resize-none h-24"
              />

              <button
                onClick={() => openWhatsApp(customMessage || defaultMessage)}
                className="w-full bg-[#142850] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#1a3a6e] transition-colors flex items-center justify-center gap-2"
              >
                <Send size={18} />
                <span>שלח בוואטסאפ</span>
              </button>
            </div>

            <p className="text-xs text-[#888888] text-center mt-4">
              לחיצה תפתח את וואטסאפ עם ההודעה מוכנה לשליחה
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

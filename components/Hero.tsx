import { ArrowLeft, Building2 } from "lucide-react";
import Link from "next/link";
import BankAnimation from "./BankAnimation";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Main Background - 45° Diagonal Blue to White Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #142850 0%, #1a4a7a 35%, #4a90c2 55%, #a8d4f0 75%, #ffffff 100%)'
        }}
      />

      {/* Soft Glowing Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[0%] left-[0%] w-[500px] h-[500px] bg-[#0090D5] rounded-full blur-[150px] opacity-25" />
        <div className="absolute bottom-[0%] right-[0%] w-[400px] h-[400px] bg-white rounded-full blur-[120px] opacity-50" />
      </div>

      {/* Subtle decorative elements - hidden on mobile */}
      <div className="absolute inset-0 overflow-hidden hidden md:block">
        {/* Circles on blue side */}
        <div className="absolute top-[15%] left-[10%] w-3 h-3 bg-white/20 rounded-full" />
        <div className="absolute top-[35%] left-[20%] w-2 h-2 bg-white/30 rounded-full" />
        <div className="absolute top-[55%] left-[8%] w-4 h-4 bg-[#0090D5]/30 rounded-full" />
        {/* Circles on white side */}
        <div className="absolute top-[30%] right-[15%] w-3 h-3 bg-[#0090D5]/15 rounded-full" />
        <div className="absolute top-[60%] right-[8%] w-2 h-2 bg-[#142850]/15 rounded-full" />
        <div className="absolute bottom-[20%] right-[25%] w-4 h-4 bg-[#0090D5]/10 rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content - Now on white/light background */}
          <div className="text-center lg:text-right">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#142850]/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8 border border-[#142850]/20">
              <Building2 size={18} className="text-[#0090D5]" />
              <span className="text-[#142850] text-sm font-medium">ליווי פיננסי לחברות בנייה ויזמות</span>
            </div>

            {/* Main Heading - Blue text */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#142850] mb-6 leading-tight">
              שקט נפשי
              <span className="block text-[#0090D5]">לפרויקט שלך</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl md:text-2xl text-[#142850]/70 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Done1 מעניק ליווי פיננסי מלא לחברות יזום ובנייה, כדי שתוכל להתמקד בפרויקטים.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="#construction"
                className="group flex items-center gap-2 bg-[#142850] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#0090D5] transition-all shadow-lg hover:shadow-xl"
              >
                <span>לשיחת ייעוץ ראשונית</span>
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#contact"
                className="flex items-center gap-2 border-2 border-[#142850] text-[#142850] px-8 py-4 rounded-full font-bold text-lg hover:bg-[#142850] hover:text-white transition-all"
              >
                <span>תיאום שיחת ייעוץ</span>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-[#142850]/60">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#0090D5] rounded-full" />
                <span>מומחה בליווי חברות בנייה</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#0090D5] rounded-full" />
                <span>+20 שנות ניסיון</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#0090D5] rounded-full" />
                <span>מאות לקוחות מרוצים</span>
              </div>
            </div>
          </div>

          {/* Animation Side - On blue background */}
          <div className="flex justify-center lg:justify-start">
            <BankAnimation />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-[#142850]/30 rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-[#142850]/50 rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
}

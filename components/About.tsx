import { Award, Users, Clock } from "lucide-react";
import Image from "next/image";

const features = [
  {
    icon: Award,
    title: "מקצועיות",
    description: "ידע עדכני בכל חוקי המס",
  },
  {
    icon: Users,
    title: "יחס אישי",
    description: "ליווי צמוד לכל לקוח",
  },
  {
    icon: Clock,
    title: "זמינות",
    description: "מענה מהיר ואישי",
  },
];

export default function About() {
  return (
    <section id="about" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Side */}
          <div className="relative">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/danny.jpeg"
                alt="דני - רואה חשבון"
                fill
                className="object-cover"
              />
            </div>
            {/* Decorative Elements - hidden on mobile */}
            <div className="hidden md:block absolute -bottom-6 -left-6 w-24 h-24 bg-[#0090D5] rounded-2xl -z-10" />
            <div className="hidden md:block absolute -top-6 -right-6 w-32 h-32 border-4 border-[#142850]/20 rounded-2xl -z-10" />
          </div>

          {/* Content Side */}
          <div>
            <div className="inline-block bg-[#0090D5]/10 text-[#0090D5] px-4 py-2 rounded-full text-sm font-medium mb-4">
              נעים להכיר
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#142850] mb-6">
              משרד Done<span className="text-[#0090D5]">1</span> - הבית הפיננסי שלך
            </h2>
            <p className="text-lg text-[#666666] mb-6 leading-relaxed">
              משרד Done הוקם במטרה לתת לעסקים בישראל בית פיננסים חכם ומתקדם.
              אנחנו מאמינים שכל בעל עסק זכאי לשירות אישי, מקצועי וזמין.
            </p>
            <p className="text-lg text-[#666666] mb-8 leading-relaxed">
              הגישה שלנו פשוטה: אנחנו מטפלים בכל הנושאים הפיננסיים והבירוקרטיים,
              כדי שאתם תוכלו להתמקד במה שאתם עושים הכי טוב - לנהל ולהצמיח את העסק.
            </p>

            {/* Features */}
            <div className="grid sm:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div key={feature.title} className="text-center">
                  <div className="w-14 h-14 mx-auto mb-3 bg-[#F7F9FB] rounded-xl flex items-center justify-center">
                    <feature.icon size={28} className="text-[#0090D5]" />
                  </div>
                  <h3 className="font-bold text-[#142850] mb-1">{feature.title}</h3>
                  <p className="text-sm text-[#888888]">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

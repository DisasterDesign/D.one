import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const quickLinks = [
  { label: "אודות", href: "#about" },
  { label: "השירותים שלנו", href: "#services" },
  { label: "ליווי בנייה", href: "#construction" },
  { label: "צור קשר", href: "#contact" },
];

const services = [
  "ליווי פרויקטי בנייה",
  "ניהול יזום נדל\"ן",
  "ביצוע בנייה",
  "הנהלת חשבונות",
  "ייעוץ מס",
  "ליווי יזמי",
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-[#142850] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Image src="/logo.svg" alt="Done1" width={140} height={63} />
            </Link>
            <p className="text-white/70 mb-6 leading-relaxed">
              מומחים בליווי פיננסי לחברות יזום, קבלנים וחברות בנייה.
            </p>
            <a
              href="https://wa.me/972509700263"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#0090D5] hover:bg-[#007bb8] text-white px-6 py-3 rounded-full transition-colors font-medium"
            >
              <MessageCircle size={18} />
              <span>דברו איתי בוואטסאפ</span>
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">קישורים מהירים</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-[#0090D5] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-6">השירותים שלנו</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-white/70">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6">צור קשר</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+972509700263"
                  className="flex items-center gap-3 text-white/70 hover:text-[#0090D5] transition-colors"
                >
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone size={18} />
                  </div>
                  <span>050-970-0263</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:danielninuse@gmail.com"
                  className="flex items-center gap-3 text-white/70 hover:text-[#0090D5] transition-colors"
                >
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail size={18} />
                  </div>
                  <span>danielninuse@gmail.com</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-white/70">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} />
                  </div>
                  <span>דם המכבים 28, מודיעין מכבים רעות</span>
                </div>
              </li>
              <li>
                <div className="flex items-center gap-3 text-white/70">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock size={18} />
                  </div>
                  <span>ראשון - חמישי 8:30-18:00</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-white/50 text-sm text-center">
            © {currentYear} Done1. כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const navItems = [
  { label: "אודות", href: "#about" },
  { label: "השירותים שלנו", href: "#services" },
  { label: "החזרי מס", href: "#tax-refund" },
  { label: "צור קשר", href: "#contact" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-[#142850] shadow-lg overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Right Side */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/logo.svg"
              alt="Done1"
              width={50}
              height={23}
              priority
              className="w-[50px] sm:w-[100px] h-auto max-w-[50px] sm:max-w-[100px]"
            />
          </Link>

          {/* Desktop Navigation - Center */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white hover:text-[#0090D5] transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button - Left Side */}
          <a
            href="https://wa.me/972509700263"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:block bg-[#0090D5] hover:bg-[#007bb8] text-white px-5 py-2.5 rounded-full transition-colors font-medium"
          >
            רוצה לחסוך?
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2"
            aria-label="תפריט"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#142850] border-t border-[#1a3a6e]">
          <nav className="flex flex-col px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:text-[#0090D5] py-3 border-b border-[#1a3a6e] transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4">
              <a
                href="https://wa.me/972509700263"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-[#0090D5] text-white py-3 rounded-lg font-medium"
              >
                רוצה לחסוך?
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

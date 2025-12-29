"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/972509700263"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-[#0090D5] hover:bg-[#007bb8] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all whatsapp-pulse"
      aria-label="פתח שיחה בוואטסאפ"
    >
      <MessageCircle size={28} className="text-white" />
    </a>
  );
}

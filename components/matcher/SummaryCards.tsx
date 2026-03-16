'use client';

import { CheckCircle, XCircle, AlertTriangle, DollarSign, AlertOctagon, Copy } from 'lucide-react';
import type { MatchReport } from '@/lib/matcher/types';

interface Props {
  summary: MatchReport['summary'];
  integrityCheck: MatchReport['integrityCheck'];
}

export default function SummaryCards({ summary, integrityCheck }: Props) {
  const cards = [
    { label: 'הותאמו', value: summary.matched, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
    { label: 'חסר חשבונית', value: summary.missingInvoice, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
    { label: 'חשבונית יתומה', value: summary.orphanInvoice, icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
    { label: 'הפרש סכום', value: summary.amountMismatch, icon: DollarSign, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
    { label: 'כפילויות', value: summary.duplicates, icon: Copy, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
    { label: 'שגיאות פרסור', value: summary.parseErrors, icon: AlertOctagon, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {cards.map((card) => (
          <div key={card.label} className={`${card.bg} ${card.border} border rounded-xl p-4 text-center`}>
            <card.icon className={`w-6 h-6 ${card.color} mx-auto mb-2`} />
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            <p className="text-xs text-[#666666] mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Integrity check */}
      <div className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg ${
        integrityCheck.isComplete ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
      }`}>
        {integrityCheck.isComplete ? (
          <CheckCircle className="w-4 h-4" />
        ) : (
          <AlertOctagon className="w-4 h-4" />
        )}
        <span>
          בדיקת שלמות: {integrityCheck.quotesAccountedFor}/{summary.totalQuotes} הצעות
          {' · '}
          {integrityCheck.invoicesAccountedFor}/{summary.totalInvoices} חשבוניות
          {integrityCheck.isComplete ? ' — תקין' : ' — חסרות שורות!'}
        </span>
      </div>
    </div>
  );
}

'use client';

import type { MatchReport } from '@/lib/matcher/types';

interface Props {
  report: MatchReport;
}

export default function SummaryCards({ report }: Props) {
  const cards = [
    {
      label: 'עבודות לבדיקה',
      value: report.total,
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      color: 'text-blue-700',
    },
    {
      label: 'יצאה חשבונית',
      value: report.totalMatched,
      bg: 'bg-green-50',
      border: 'border-green-200',
      color: 'text-green-700',
    },
    {
      label: 'בוטלו',
      value: report.canceled,
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      color: 'text-gray-600',
    },
    {
      label: 'ללא חשבונית',
      value: report.missing,
      bg: 'bg-red-50',
      border: 'border-red-200',
      color: 'text-red-700',
    },
    {
      label: 'אחוז התאמה',
      value: report.matchedPercent,
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      color: 'text-purple-700',
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`${card.bg} ${card.border} border rounded-xl p-4 text-center`}
          >
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            <p className="text-xs text-[#666666] mt-1">{card.label}</p>
          </div>
        ))}
      </div>
      {report.filteredOutBoxNumber > 0 && (
        <p className="text-sm text-[#888888] mt-3 text-center">
          סה&quot;כ {report.totalInFile} עבודות בקובץ. {report.filteredOutBoxNumber} עבודות עם מספר קופסה (Box) סוננו — אלה נשלחו פיזית וחשבוניתן יוצאת אוטומטית.
        </p>
      )}
    </div>
  );
}

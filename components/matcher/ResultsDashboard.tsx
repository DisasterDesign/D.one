'use client';

import { useState } from 'react';
import { Download, RotateCcw, Loader2 } from 'lucide-react';
import type { MatchReport } from '@/lib/matcher/types';
import SummaryCards from './SummaryCards';
import MatchTable from './MatchTable';

interface Props {
  report: MatchReport;
  onReset: () => void;
}

export default function ResultsDashboard({ report, onReset }: Props) {
  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    setExporting(true);
    try {
      const res = await fetch('/api/matcher/export-excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      });

      if (!res.ok) throw new Error('Export failed');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `דוח_התאמה_${new Date().toLocaleDateString('he-IL').replace(/\./g, '-')}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('שגיאה בייצוא הדוח');
    } finally {
      setExporting(false);
    }
  }

  const reportDate = new Date(report.timestamp).toLocaleString('he-IL', {
    dateStyle: 'short',
    timeStyle: 'short',
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#142850]">
          דוח התאמה — {reportDate}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 bg-[#0090D5] hover:bg-[#007bb8] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {exporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            ייצוא Excel
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#333333] rounded-lg text-sm font-medium transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            התאמה חדשה
          </button>
        </div>
      </div>

      <SummaryCards report={report} />

      {/* Match type breakdown */}
      <div className="flex items-center gap-4 text-sm text-[#666666] bg-gray-50 px-4 py-2 rounded-lg">
        <span>
          התאמה לפי מספר עבודה: <strong>{report.matchedByNumber}</strong>
        </span>
        <span>|</span>
        <span>
          התאמה לפי שם מטופל: <strong>{report.matchedByName}</strong>
        </span>
      </div>

      <MatchTable results={report.results} />
    </div>
  );
}

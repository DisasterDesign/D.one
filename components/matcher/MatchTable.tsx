'use client';

import { useState, useMemo } from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import type { MatchResult, MatchStatus } from '@/lib/matcher/types';

interface Props {
  results: MatchResult[];
}

const TABS: { key: MatchStatus | 'ALL'; label: string; color: string }[] = [
  { key: 'ALL', label: 'הכל', color: 'bg-[#142850]' },
  { key: 'MISSING_INVOICE', label: 'חסר חשבונית', color: 'bg-red-600' },
  { key: 'ORPHAN_INVOICE', label: 'חשבונית יתומה', color: 'bg-orange-500' },
  { key: 'AMOUNT_MISMATCH', label: 'הפרש סכום', color: 'bg-yellow-500' },
  { key: 'MATCHED', label: 'הותאמו', color: 'bg-green-600' },
  { key: 'DUPLICATE', label: 'כפילויות', color: 'bg-purple-600' },
  { key: 'PARSE_ERROR', label: 'שגיאות', color: 'bg-gray-500' },
];

const STATUS_BADGES: Record<MatchStatus, { label: string; className: string }> = {
  MATCHED: { label: 'הותאם', className: 'bg-green-100 text-green-700' },
  MISSING_INVOICE: { label: 'חסר חשבונית', className: 'bg-red-100 text-red-700' },
  ORPHAN_INVOICE: { label: 'חשבונית יתומה', className: 'bg-orange-100 text-orange-700' },
  AMOUNT_MISMATCH: { label: 'הפרש סכום', className: 'bg-yellow-100 text-yellow-700' },
  DUPLICATE: { label: 'כפילות', className: 'bg-purple-100 text-purple-700' },
  PARSE_ERROR: { label: 'שגיאה', className: 'bg-gray-100 text-gray-700' },
};

type SortField = 'workNumber' | 'clientName' | 'quoteAmount' | 'invoiceAmount' | 'status';

export default function MatchTable({ results }: Props) {
  const [activeTab, setActiveTab] = useState<MatchStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('workNumber');
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = useMemo(() => {
    let items = results;

    if (activeTab !== 'ALL') {
      items = items.filter((r) => r.status === activeTab);
    }

    if (search) {
      const s = search.toLowerCase();
      items = items.filter((r) => {
        const workNum = r.quote?.workNumber || r.invoice?.workNumber || '';
        const client = r.quote?.clientName || r.invoice?.clientName || '';
        const notes = r.notes || '';
        return workNum.includes(s) || client.toLowerCase().includes(s) || notes.toLowerCase().includes(s);
      });
    }

    items = [...items].sort((a, b) => {
      let aVal = '';
      let bVal = '';

      switch (sortField) {
        case 'workNumber':
          aVal = a.quote?.workNumber || a.invoice?.workNumber || '';
          bVal = b.quote?.workNumber || b.invoice?.workNumber || '';
          break;
        case 'clientName':
          aVal = a.quote?.clientName || a.invoice?.clientName || '';
          bVal = b.quote?.clientName || b.invoice?.clientName || '';
          break;
        case 'quoteAmount':
          return sortAsc
            ? (a.quote?.amount || 0) - (b.quote?.amount || 0)
            : (b.quote?.amount || 0) - (a.quote?.amount || 0);
        case 'invoiceAmount':
          return sortAsc
            ? (a.invoice?.amount || 0) - (b.invoice?.amount || 0)
            : (b.invoice?.amount || 0) - (a.invoice?.amount || 0);
        case 'status':
          aVal = a.status;
          bVal = b.status;
          break;
      }

      return sortAsc ? aVal.localeCompare(bVal, 'he') : bVal.localeCompare(aVal, 'he');
    });

    return items;
  }, [results, activeTab, search, sortField, sortAsc]);

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  }

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: results.length };
    for (const r of results) {
      counts[r.status] = (counts[r.status] || 0) + 1;
    }
    return counts;
  }, [results]);

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const count = tabCounts[tab.key] || 0;
          if (tab.key !== 'ALL' && count === 0) return null;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? `${tab.color} text-white`
                  : 'bg-gray-100 text-[#666666] hover:bg-gray-200'
              }`}
            >
              {tab.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="חיפוש לפי מספר עבודה, לקוח..."
          className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#0090D5]"
          dir="rtl"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#142850] text-white">
              <th className="px-3 py-2 text-right">#</th>
              {(['workNumber', 'clientName', 'quoteAmount', 'invoiceAmount', 'status'] as SortField[]).map((field) => {
                const labels: Record<SortField, string> = {
                  workNumber: 'מס׳ עבודה',
                  clientName: 'לקוח',
                  quoteAmount: 'סכום הצעה',
                  invoiceAmount: 'סכום חשבונית',
                  status: 'סטטוס',
                };
                return (
                  <th
                    key={field}
                    className="px-3 py-2 text-right cursor-pointer hover:bg-[#1a3a6e] transition-colors"
                    onClick={() => toggleSort(field)}
                  >
                    <div className="flex items-center gap-1">
                      {labels[field]}
                      <ArrowUpDown className="w-3 h-3 opacity-50" />
                    </div>
                  </th>
                );
              })}
              <th className="px-3 py-2 text-right">הערות</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-[#888888]">
                  לא נמצאו תוצאות
                </td>
              </tr>
            ) : (
              filtered.map((r, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-3 py-2 text-[#888888]">{i + 1}</td>
                  <td className="px-3 py-2 font-mono">{r.quote?.workNumber || r.invoice?.workNumber || '—'}</td>
                  <td className="px-3 py-2">{r.quote?.clientName || r.invoice?.clientName || '—'}</td>
                  <td className="px-3 py-2">{r.quote ? r.quote.amount.toLocaleString('he-IL') : '—'}</td>
                  <td className="px-3 py-2">{r.invoice ? r.invoice.amount.toLocaleString('he-IL') : '—'}</td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGES[r.status].className}`}>
                      {STATUS_BADGES[r.status].label}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-xs text-[#666666] max-w-48 truncate">{r.notes}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-[#888888] text-left">מציג {filtered.length} מתוך {results.length} תוצאות</p>
    </div>
  );
}

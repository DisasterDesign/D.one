'use client';

import { useState, useMemo } from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import type { MatchResult, MatchType } from '@/lib/matcher/types';

interface Props {
  results: MatchResult[];
}

type TabKey = 'missing' | 'matched' | 'canceled';

const TABS: { key: TabKey; label: string; color: string }[] = [
  { key: 'missing', label: 'ללא חשבונית', color: 'bg-red-600' },
  { key: 'matched', label: 'עם חשבונית', color: 'bg-green-600' },
  { key: 'canceled', label: 'בוטלו', color: 'bg-gray-500' },
];

function filterByTab(results: MatchResult[], tab: TabKey): MatchResult[] {
  switch (tab) {
    case 'missing':
      return results.filter(
        (r) => r.matchType === 'NONE' && r.status !== 'canceled'
      );
    case 'matched':
      return results.filter((r) => r.matchType !== 'NONE');
    case 'canceled':
      return results.filter(
        (r) => r.matchType === 'NONE' && r.status === 'canceled'
      );
  }
}

function matchTypeLabel(mt: MatchType): string {
  switch (mt) {
    case 'JOB_NUMBER':
      return 'מספר עבודה';
    case 'EXACT_NAME':
      return 'שם מטופל';
    default:
      return '';
  }
}

type SortField = 'jobCode' | 'patient' | 'jobTags' | 'status';

export default function MatchTable({ results }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('missing');
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('jobCode');
  const [sortAsc, setSortAsc] = useState(true);

  const tabCounts = useMemo(() => {
    return {
      missing: results.filter(
        (r) => r.matchType === 'NONE' && r.status !== 'canceled'
      ).length,
      matched: results.filter((r) => r.matchType !== 'NONE').length,
      canceled: results.filter(
        (r) => r.matchType === 'NONE' && r.status === 'canceled'
      ).length,
    };
  }, [results]);

  const filtered = useMemo(() => {
    let items = filterByTab(results, activeTab);

    if (search) {
      const s = search.toLowerCase();
      items = items.filter((r) => {
        return (
          String(r.jobCode).includes(s) ||
          r.patient.toLowerCase().includes(s) ||
          r.jobTags.toLowerCase().includes(s) ||
          r.matchedInvoiceDetails.toLowerCase().includes(s) ||
          (r.invoiceNumber && r.invoiceNumber.toLowerCase().includes(s))
        );
      });
    }

    items = [...items].sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;

      switch (sortField) {
        case 'jobCode':
          return sortAsc ? a.jobCode - b.jobCode : b.jobCode - a.jobCode;
        case 'patient':
          aVal = a.patient;
          bVal = b.patient;
          break;
        case 'jobTags':
          aVal = a.jobTags;
          bVal = b.jobTags;
          break;
        case 'status':
          aVal = a.status;
          bVal = b.status;
          break;
        default:
          return 0;
      }
      return sortAsc
        ? String(aVal).localeCompare(String(bVal), 'he')
        : String(bVal).localeCompare(String(aVal), 'he');
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

  function SortHeader({
    field,
    label,
  }: {
    field: SortField;
    label: string;
  }) {
    return (
      <th
        className="px-3 py-2 text-right cursor-pointer hover:bg-[#1a3a6e] transition-colors"
        onClick={() => toggleSort(field)}
      >
        <div className="flex items-center gap-1">
          {label}
          <ArrowUpDown className="w-3 h-3 opacity-50" />
        </div>
      </th>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? `${tab.color} text-white`
                : 'bg-gray-100 text-[#666666] hover:bg-gray-200'
            }`}
          >
            {tab.label} ({tabCounts[tab.key]})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="חיפוש לפי מספר עבודה, שם מטופל..."
          className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#0090D5]"
          dir="rtl"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#142850] text-white">
              <th className="px-3 py-2 text-right w-10">#</th>
              <SortHeader field="jobCode" label="מס׳ עבודה" />
              <SortHeader field="patient" label="שם מטופל" />
              <SortHeader field="jobTags" label="סוג עבודה" />
              {activeTab === 'missing' && (
                <>
                  <th className="px-3 py-2 text-right">תאריך קבלה</th>
                  <th className="px-3 py-2 text-right">תאריך משלוח</th>
                  <SortHeader field="status" label="סטטוס" />
                </>
              )}
              {activeTab === 'matched' && (
                <>
                  <th className="px-3 py-2 text-right">מספר חשבונית</th>
                  <th className="px-3 py-2 text-right">התאמה לפי</th>
                  <th className="px-3 py-2 text-right">פרטים בחשבשבת</th>
                </>
              )}
              {activeTab === 'canceled' && (
                <th className="px-3 py-2 text-right">תאריך קבלה</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-3 py-8 text-center text-[#888888]"
                >
                  לא נמצאו תוצאות
                </td>
              </tr>
            ) : (
              filtered.map((r, i) => (
                <tr
                  key={`${r.jobCode}-${i}`}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-3 py-2 text-[#888888]">{i + 1}</td>
                  <td className="px-3 py-2 font-mono">{r.jobCode}</td>
                  <td className="px-3 py-2">{r.patient || '—'}</td>
                  <td className="px-3 py-2 text-xs">{r.jobTags || '—'}</td>
                  {activeTab === 'missing' && (
                    <>
                      <td className="px-3 py-2 text-xs">{r.acceptDate || '—'}</td>
                      <td className="px-3 py-2 text-xs">
                        {r.deliveryDate || '—'}
                      </td>
                      <td className="px-3 py-2">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {r.status}
                        </span>
                      </td>
                    </>
                  )}
                  {activeTab === 'matched' && (
                    <>
                      <td className="px-3 py-2 font-mono">{r.invoiceNumber || '—'}</td>
                      <td className="px-3 py-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            r.matchType === 'JOB_NUMBER'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {matchTypeLabel(r.matchType)}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-xs max-w-64 truncate">
                        {r.matchedInvoiceDetails || '—'}
                      </td>
                    </>
                  )}
                  {activeTab === 'canceled' && (
                    <td className="px-3 py-2 text-xs">{r.acceptDate || '—'}</td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-[#888888] text-left">
        מציג {filtered.length} מתוך {tabCounts[activeTab]} תוצאות
      </p>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Settings2 } from 'lucide-react';

interface MappingField {
  key: string;
  label: string;
  autoDetectNames: string[];
  required: boolean;
}

interface Props {
  headers: string[];
  fileType: 'shenhav' | 'hashavshevet';
  onMappingChange: (mapping: Record<string, string>) => void;
}

const SHENHAV_FIELDS: MappingField[] = [
  { key: 'workNumber', label: 'מספר עבודה', autoDetectNames: ['מספר עבודה', 'מס עבודה', 'work number', 'job', 'job #', 'מס׳ עבודה'], required: true },
  { key: 'clientName', label: 'שם לקוח', autoDetectNames: ['שם לקוח', 'לקוח', 'client', 'שם מרפאה', 'מרפאה'], required: true },
  { key: 'amount', label: 'סכום', autoDetectNames: ['סכום', 'סה"כ', 'סהכ', 'amount', 'total', 'מחיר'], required: true },
  { key: 'date', label: 'תאריך', autoDetectNames: ['תאריך', 'date'], required: false },
];

const HASHAVSHEVET_FIELDS: MappingField[] = [
  { key: 'invoiceNumber', label: 'מספר חשבונית', autoDetectNames: ['מספר חשבונית', 'מס חשבונית', 'חשבונית', 'invoice', 'מס׳ חשבונית'], required: true },
  { key: 'workNumber', label: 'מספר עבודה / פרטים', autoDetectNames: ['פרטים', 'מספר עבודה', 'details', 'תיאור', 'הערות', 'מס עבודה'], required: true },
  { key: 'clientName', label: 'שם לקוח', autoDetectNames: ['שם לקוח', 'לקוח', 'client', 'שם'], required: true },
  { key: 'amount', label: 'סכום', autoDetectNames: ['סכום', 'סה"כ', 'סהכ', 'amount', 'total', 'חובה', 'זכות'], required: true },
  { key: 'date', label: 'תאריך', autoDetectNames: ['תאריך', 'date'], required: false },
];

function autoDetect(headers: string[], autoDetectNames: string[]): string {
  for (const name of autoDetectNames) {
    const match = headers.find(
      (h) => h.trim().toLowerCase() === name.toLowerCase() || h.trim().includes(name)
    );
    if (match) return match;
  }
  return '';
}

export default function ColumnMapper({ headers, fileType, onMappingChange }: Props) {
  const fields = fileType === 'shenhav' ? SHENHAV_FIELDS : HASHAVSHEVET_FIELDS;
  const [open, setOpen] = useState(false);
  const [mapping, setMapping] = useState<Record<string, string>>({});

  // Auto-detect on mount
  useEffect(() => {
    const initial: Record<string, string> = {};
    for (const field of fields) {
      initial[field.key] = autoDetect(headers, field.autoDetectNames);
    }
    setMapping(initial);
    onMappingChange(initial);
    // Auto-open if any required field wasn't auto-detected
    const hasMissing = fields.some((f) => f.required && !initial[f.key]);
    if (hasMissing) setOpen(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headers, fileType]);

  function updateField(key: string, value: string) {
    const updated = { ...mapping, [key]: value };
    setMapping(updated);
    onMappingChange(updated);
  }

  const missingRequired = fields.filter((f) => f.required && !mapping[f.key]);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors text-sm"
      >
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-[#888888]" />
          <span className="text-[#333333]">מיפוי עמודות — {fileType === 'shenhav' ? 'שנהב' : 'חשבשבת'}</span>
        </div>
        <div className="flex items-center gap-2">
          {missingRequired.length > 0 && (
            <span className="text-xs text-red-500">{missingRequired.length} שדות חסרים</span>
          )}
          <span className="text-[#888888]">{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {open && (
        <div className="p-4 space-y-3">
          {fields.map((field) => (
            <div key={field.key} className="flex items-center gap-3">
              <label className="w-36 text-sm text-[#333333] text-right flex-shrink-0">
                {field.label}
                {field.required && <span className="text-red-500 mr-1">*</span>}
              </label>
              <select
                value={mapping[field.key] || ''}
                onChange={(e) => updateField(field.key, e.target.value)}
                className={`flex-1 border rounded-lg px-3 py-2 text-sm text-right ${
                  field.required && !mapping[field.key] ? 'border-red-300' : 'border-gray-200'
                }`}
              >
                <option value="">— בחר עמודה —</option>
                {headers.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

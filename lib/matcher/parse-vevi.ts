import * as XLSX from 'xlsx';
import type { VeviRecord } from './types';

function formatDate(val: unknown): string {
  if (!val) return '';
  if (val instanceof Date) return val.toISOString().slice(0, 10);
  const s = String(val);
  if (s.includes('T')) return s.slice(0, 10);
  return s;
}

function getField(row: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    if (row[key] != null && String(row[key]).trim() !== '') {
      return String(row[key]).trim();
    }
  }
  return '';
}

export function parseVeviFile(buffer: ArrayBuffer): {
  records: VeviRecord[];
  totalBeforeFilter: number;
  filteredOut: number;
  errors: string[];
} {
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });

  const records: VeviRecord[] = [];
  const errors: string[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    const jobCodeRaw = row['Job code'] ?? row['מספר עבודה'] ?? row['job_code'] ?? row['JobCode'];
    if (jobCodeRaw == null || isNaN(Number(jobCodeRaw))) {
      errors.push(`שורה ${i + 2}: מספר עבודה לא תקין (${jobCodeRaw})`);
      continue;
    }

    records.push({
      jobCode: Number(jobCodeRaw),
      jobTags: getField(row, 'Job tags', 'סוג עבודה', 'JobTags'),
      customer: getField(row, 'Customer', 'לקוח'),
      doctor: getField(row, 'Doctor', 'רופא'),
      patient: getField(row, 'Patient', 'מטופל'),
      boxNumber: getField(row, 'Box number', 'מספר קופסה', 'BoxNumber'),
      acceptDate: formatDate(row['Accept date'] ?? row['תאריך קבלה']),
      deliveryDate: formatDate(row['Delivery date'] ?? row['תאריך משלוח']),
      finishDate: formatDate(row['Finish date'] ?? row['תאריך סיום']),
      status: getField(row, 'Status', 'סטטוס'),
    });
  }

  // Filter: only jobs WITHOUT Box number (these need invoice verification)
  // Jobs with a Box number are physically shipped and invoiced automatically
  const filteredRecords = records.filter(r => !r.boxNumber);

  return {
    records: filteredRecords,
    totalBeforeFilter: records.length,
    filteredOut: records.length - filteredRecords.length,
    errors,
  };
}

import * as XLSX from 'xlsx';
import type { QuoteRecord } from './types';

export function normalizeWorkNumber(raw: string | number | null | undefined): string {
  if (raw == null) return '';
  const str = String(raw).trim();
  if (!str) return '';
  const noLeadingZeros = str.replace(/^0+/, '') || '0';
  return noLeadingZeros.replace(/[-\s\/]/g, '');
}

function parseAmount(raw: unknown): number {
  if (raw == null) return 0;
  if (typeof raw === 'number') return raw;
  const str = String(raw).replace(/[₪,\s]/g, '').trim();
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

export function parseShenhavFile(
  buffer: ArrayBuffer,
  columnMapping: { workNumber: string; clientName: string; amount: string; date?: string }
): { records: QuoteRecord[]; errors: string[] } {
  const records: QuoteRecord[] = [];
  const errors: string[] = [];

  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rawWorkNumber = row[columnMapping.workNumber] as string | number | null | undefined;
    const workNumber = normalizeWorkNumber(rawWorkNumber);

    if (!workNumber) {
      errors.push(`שורה ${i + 2}: מספר עבודה ריק`);
      records.push({
        workNumber: '',
        clientName: String(row[columnMapping.clientName] ?? ''),
        amount: parseAmount(row[columnMapping.amount]),
        date: columnMapping.date ? String(row[columnMapping.date] ?? '') : '',
        rawRow: row,
        rowIndex: i + 2,
      });
      continue;
    }

    records.push({
      workNumber,
      clientName: String(row[columnMapping.clientName] ?? ''),
      amount: parseAmount(row[columnMapping.amount]),
      date: columnMapping.date ? String(row[columnMapping.date] ?? '') : '',
      rawRow: row,
      rowIndex: i + 2,
    });
  }

  return { records, errors };
}

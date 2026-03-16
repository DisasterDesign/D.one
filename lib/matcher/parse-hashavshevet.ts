import * as XLSX from 'xlsx';
import type { InvoiceRecord } from './types';
import { normalizeWorkNumber } from './parse-shenhav';

function parseAmount(raw: unknown): number {
  if (raw == null) return 0;
  if (typeof raw === 'number') return raw;
  const str = String(raw).replace(/[₪,\s]/g, '').trim();
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

export function extractWorkNumber(details: string): string {
  if (!details) return '';
  const str = String(details).trim();

  // Try labeled patterns first
  const labeledMatch = str.match(/עבודה\s*(?:מס['.׳]?\s*)?(\d+)/);
  if (labeledMatch) return normalizeWorkNumber(labeledMatch[1]);

  const quoteMatch = str.match(/הצעה\s*(\d+)/);
  if (quoteMatch) return normalizeWorkNumber(quoteMatch[1]);

  // Fallback: find a 3-8 digit number
  const numberMatch = str.match(/\d{3,8}/);
  if (numberMatch) return normalizeWorkNumber(numberMatch[0]);

  return normalizeWorkNumber(str);
}

export function parseHashavshevetFile(
  buffer: ArrayBuffer,
  columnMapping: { invoiceNumber: string; workNumber: string; clientName: string; amount: string; date?: string }
): { records: InvoiceRecord[]; errors: string[] } {
  const records: InvoiceRecord[] = [];
  const errors: string[] = [];

  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rawWorkField = String(row[columnMapping.workNumber] ?? '');

    // Try direct value first, then extract from text
    let workNumber = normalizeWorkNumber(rawWorkField);
    if (!workNumber || workNumber === '0') {
      workNumber = extractWorkNumber(rawWorkField);
    }

    if (!workNumber) {
      errors.push(`שורה ${i + 2}: לא ניתן לזהות מספר עבודה`);
      records.push({
        invoiceNumber: String(row[columnMapping.invoiceNumber] ?? ''),
        workNumber: '',
        clientName: String(row[columnMapping.clientName] ?? ''),
        amount: parseAmount(row[columnMapping.amount]),
        date: columnMapping.date ? String(row[columnMapping.date] ?? '') : '',
        details: rawWorkField,
        rawRow: row,
        rowIndex: i + 2,
      });
      continue;
    }

    records.push({
      invoiceNumber: String(row[columnMapping.invoiceNumber] ?? ''),
      workNumber,
      clientName: String(row[columnMapping.clientName] ?? ''),
      amount: parseAmount(row[columnMapping.amount]),
      date: columnMapping.date ? String(row[columnMapping.date] ?? '') : '',
      details: rawWorkField,
      rawRow: row,
      rowIndex: i + 2,
    });
  }

  return { records, errors };
}

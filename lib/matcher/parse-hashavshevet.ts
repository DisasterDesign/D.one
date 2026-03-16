import * as XLSX from 'xlsx';
import type { HashavshevetRecord } from './types';
import { extractFromDetails } from './extract-details';

function formatDate(val: unknown): string {
  if (!val) return '';
  if (val instanceof Date) return val.toISOString().slice(0, 10);
  const s = String(val);
  if (s.includes('T')) return s.slice(0, 10);
  return s;
}

export function parseHashavshevetFile(buffer: ArrayBuffer): {
  records: HashavshevetRecord[];
  invoiceRecords: HashavshevetRecord[];
  errors: string[];
} {
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const raw = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    defval: null,
  });

  // --- STEP 1: Find the header row ---
  let headerRowIndex = -1;
  for (let i = 0; i < Math.min(raw.length, 10); i++) {
    const row = raw[i] as unknown[];
    if (!row) continue;
    const rowText = row.filter(Boolean).map(String).join(' ');
    if (rowText.includes('כותרת') && rowText.includes('פרטים')) {
      headerRowIndex = i;
      break;
    }
  }
  if (headerRowIndex === -1) {
    throw new Error('לא נמצאה שורת כותרות בקובץ חשבשבת');
  }

  // --- STEP 2: Find column indices from header ---
  const headerRow = raw[headerRowIndex] as unknown[];
  const colMap: Record<string, number> = {};

  headerRow.forEach((val, idx) => {
    if (val == null) return;
    const s = String(val).trim();
    if (s === 'כותרת') colMap.header = idx;
    if (s === 'ס"ת' || s === "ס\"ת") colMap.sot = idx;
    if (s.includes('ח-ן נגדי')) colMap.counter = idx;
    if (s.includes('ת.אסמכ')) colMap.date = idx;
    if (s.includes('ת.ערך')) colMap.valueDate = idx;
    if (s === "אסמ'" || s === "אסמ\'" || s === 'אסמ׳') colMap.ref = idx;
    if (s === 'פרטים') colMap.details = idx;
    // For debit/credit: look for חובה and זכות columns
    if (s.includes('חובה') && !colMap.debit) colMap.debit = idx;
    if (s.includes('זכות') && !colMap.credit) colMap.credit = idx;
  });

  // --- STEP 3: Find data start ---
  let dataStartIndex = headerRowIndex + 1;
  while (dataStartIndex < raw.length) {
    const row = raw[dataStartIndex] as unknown[];
    if (!row) { dataStartIndex++; continue; }
    const headerVal = row[colMap.header];
    if (headerVal != null && !isNaN(Number(headerVal)) && Number(headerVal) > 10000) {
      break;
    }
    dataStartIndex++;
  }

  // --- STEP 4: Parse data rows ---
  const records: HashavshevetRecord[] = [];
  const errors: string[] = [];

  for (let i = dataStartIndex; i < raw.length; i++) {
    const row = raw[i] as unknown[];
    if (!row) continue;
    const headerVal = row[colMap.header];

    // Stop at summary rows
    if (headerVal != null && String(headerVal).includes('סה"כ')) break;
    if (headerVal != null && String(headerVal).includes('מספר תנועות')) break;

    // Skip rows without a numeric header
    if (headerVal == null || isNaN(Number(headerVal))) continue;

    const details =
      colMap.details != null && row[colMap.details] != null
        ? String(row[colMap.details]).trim()
        : '';
    const sot =
      colMap.sot != null && row[colMap.sot] != null
        ? String(row[colMap.sot]).trim()
        : '';
    const debit =
      colMap.debit != null && row[colMap.debit] != null
        ? Number(row[colMap.debit])
        : null;
    const credit =
      colMap.credit != null && row[colMap.credit] != null
        ? Number(row[colMap.credit])
        : null;

    const { patientName, jobNumbers } = extractFromDetails(details);

    records.push({
      headerNumber: Number(headerVal),
      transactionType: sot,
      counterAccount:
        colMap.counter != null && row[colMap.counter] != null
          ? String(row[colMap.counter])
          : '',
      date: colMap.date != null ? formatDate(row[colMap.date]) : '',
      valueDate: colMap.valueDate != null ? formatDate(row[colMap.valueDate]) : '',
      reference:
        colMap.ref != null && row[colMap.ref] != null
          ? String(row[colMap.ref])
          : '',
      details,
      debitAmount: debit != null && !isNaN(debit) ? debit : null,
      creditAmount: credit != null && !isNaN(credit) ? credit : null,
      patientName,
      jobNumbers,
      isInvoice: sot === '1',
    });
  }

  const invoiceRecords = records.filter((r) => r.isInvoice);
  return { records, invoiceRecords, errors };
}

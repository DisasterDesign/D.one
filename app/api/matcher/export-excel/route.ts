import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import type { MatchReport, MatchResult } from '@/lib/matcher/types';

function resultToRow(r: MatchResult) {
  return {
    'מספר עבודה': r.quote?.workNumber || r.invoice?.workNumber || '',
    'שם לקוח': r.quote?.clientName || r.invoice?.clientName || '',
    'סכום הצעה': r.quote?.amount ?? '',
    'סכום חשבונית': r.invoice?.amount ?? '',
    'מספר חשבונית': r.invoice?.invoiceNumber || '',
    'הפרש': r.amountDiff ?? '',
    'אחוז הפרש': r.amountDiffPercent != null ? `${r.amountDiffPercent}%` : '',
    'סטטוס': statusLabel(r.status),
    'הערות': r.notes,
  };
}

function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    MATCHED: 'הותאם',
    MISSING_INVOICE: 'חסר חשבונית',
    ORPHAN_INVOICE: 'חשבונית יתומה',
    AMOUNT_MISMATCH: 'הפרש סכום',
    DUPLICATE: 'כפילות',
    PARSE_ERROR: 'שגיאת פרסור',
  };
  return labels[status] || status;
}

export async function POST(req: Request) {
  try {
    const report: MatchReport = await req.json();

    const wb = XLSX.utils.book_new();

    // Sheet 1: Summary
    const summaryData = [
      ['דוח התאמה', ''],
      ['תאריך', new Date(report.timestamp).toLocaleString('he-IL')],
      ['', ''],
      ['סה"כ הצעות', report.summary.totalQuotes],
      ['סה"כ חשבוניות', report.summary.totalInvoices],
      ['הותאמו', report.summary.matched],
      ['חסר חשבונית', report.summary.missingInvoice],
      ['חשבונית יתומה', report.summary.orphanInvoice],
      ['הפרש סכום', report.summary.amountMismatch],
      ['כפילויות', report.summary.duplicates],
      ['שגיאות פרסור', report.summary.parseErrors],
      ['', ''],
      ['בדיקת שלמות', report.integrityCheck.isComplete ? 'תקין' : 'חסרות שורות!'],
      ['הצעות בדוח', `${report.integrityCheck.quotesAccountedFor}/${report.summary.totalQuotes}`],
      ['חשבוניות בדוח', `${report.integrityCheck.invoicesAccountedFor}/${report.summary.totalInvoices}`],
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    summarySheet['!cols'] = [{ wch: 20 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, summarySheet, 'סיכום');

    // Sheet 2: Missing invoices
    const missingInvoices = report.results
      .filter((r) => r.status === 'MISSING_INVOICE')
      .map(resultToRow);
    if (missingInvoices.length > 0) {
      const sheet = XLSX.utils.json_to_sheet(missingInvoices);
      sheet['!cols'] = Array(9).fill({ wch: 15 });
      XLSX.utils.book_append_sheet(wb, sheet, 'הצעות ללא חשבונית');
    }

    // Sheet 3: Orphan invoices
    const orphanInvoices = report.results
      .filter((r) => r.status === 'ORPHAN_INVOICE')
      .map(resultToRow);
    if (orphanInvoices.length > 0) {
      const sheet = XLSX.utils.json_to_sheet(orphanInvoices);
      sheet['!cols'] = Array(9).fill({ wch: 15 });
      XLSX.utils.book_append_sheet(wb, sheet, 'חשבוניות ללא הצעה');
    }

    // Sheet 4: Amount mismatches
    const amountMismatches = report.results
      .filter((r) => r.status === 'AMOUNT_MISMATCH')
      .map(resultToRow);
    if (amountMismatches.length > 0) {
      const sheet = XLSX.utils.json_to_sheet(amountMismatches);
      sheet['!cols'] = Array(9).fill({ wch: 15 });
      XLSX.utils.book_append_sheet(wb, sheet, 'הפרשי סכומים');
    }

    // Sheet 5: All matched
    const matched = report.results
      .filter((r) => r.status === 'MATCHED')
      .map(resultToRow);
    if (matched.length > 0) {
      const sheet = XLSX.utils.json_to_sheet(matched);
      sheet['!cols'] = Array(9).fill({ wch: 15 });
      XLSX.utils.book_append_sheet(wb, sheet, 'כל ההתאמות');
    }

    // Sheet 6: Full log
    const fullLog = report.results.map(resultToRow);
    const logSheet = XLSX.utils.json_to_sheet(fullLog);
    logSheet['!cols'] = Array(9).fill({ wch: 15 });
    XLSX.utils.book_append_sheet(wb, logSheet, 'log מלא');

    // Set RTL on all sheets
    for (const sheetName of wb.SheetNames) {
      const sheet = wb.Sheets[sheetName];
      if (!sheet['!views']) sheet['!views'] = [{}];
      (sheet['!views'] as Record<string, unknown>[])[0].RTL = true;
    }

    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buf, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="match-report.xlsx"`,
      },
    });
  } catch (err) {
    console.error('Export error:', err);
    return NextResponse.json({ error: 'שגיאה בייצוא הדוח' }, { status: 500 });
  }
}

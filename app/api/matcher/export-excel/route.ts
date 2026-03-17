import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import type { MatchReport } from '@/lib/matcher/types';

export async function POST(req: Request) {
  try {
    const report: MatchReport = await req.json();
    const wb = XLSX.utils.book_new();

    // === Sheet 1: סיכום ===
    const summaryData = [
      ['דוח התאמת עבודות מול חשבוניות'],
      [`תאריך הפקה: ${new Date().toLocaleDateString('he-IL')}`],
      [],
      ['', 'כמות', 'אחוז'],
      ...(report.filteredOutBoxNumber > 0
        ? [
            ['סה"כ עבודות בקובץ', report.totalInFile, '100%'],
            [
              'סוננו (יש Box number)',
              report.filteredOutBoxNumber,
              report.totalInFile > 0
                ? ((report.filteredOutBoxNumber / report.totalInFile) * 100).toFixed(1) + '%'
                : '0%',
            ],
            ['─────────────────', '────', '────'],
          ]
        : []),
      ['עבודות לבדיקה', report.total, report.filteredOutBoxNumber > 0
        ? ((report.total / report.totalInFile) * 100).toFixed(1) + '%'
        : '100%'],
      [
        'יצאה חשבונית (התאמה לפי מספר עבודה)',
        report.matchedByNumber,
        report.total > 0
          ? ((report.matchedByNumber / report.total) * 100).toFixed(1) + '%'
          : '0%',
      ],
      [
        'יצאה חשבונית (התאמה לפי שם מטופל)',
        report.matchedByName,
        report.total > 0
          ? ((report.matchedByName / report.total) * 100).toFixed(1) + '%'
          : '0%',
      ],
      ['סה"כ יצאה חשבונית', report.totalMatched, report.matchedPercent],
      [
        'בוטלו (canceled)',
        report.canceled,
        report.total > 0
          ? ((report.canceled / report.total) * 100).toFixed(1) + '%'
          : '0%',
      ],
      ['ללא חשבונית', report.missing, report.missingPercent],
    ];
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    wsSummary['!cols'] = [{ wch: 42 }, { wch: 12 }, { wch: 10 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, 'סיכום');

    // === Sheet 2: עבודות עם חשבונית ===
    const matchedResults = report.results.filter((r) => r.matchType !== 'NONE');
    const matchedData = [
      ['מס׳ עבודה', 'שם מטופל', 'סוג עבודה', 'מספר חשבונית', 'התאמה לפי', 'פרטים בחשבשבת'],
      ...matchedResults.map((r) => [
        r.jobCode,
        r.patient,
        r.jobTags,
        r.invoiceNumber || '',
        r.matchType === 'JOB_NUMBER' ? 'מספר עבודה' : 'שם מטופל',
        r.matchedInvoiceDetails,
      ]),
    ];
    const wsMatched = XLSX.utils.aoa_to_sheet(matchedData);
    wsMatched['!cols'] = [
      { wch: 14 },
      { wch: 22 },
      { wch: 35 },
      { wch: 14 },
      { wch: 16 },
      { wch: 45 },
    ];
    XLSX.utils.book_append_sheet(wb, wsMatched, 'עבודות עם חשבונית');

    // === Sheet 3: עבודות ללא חשבונית (NOT canceled) ===
    const missingResults = report.results.filter(
      (r) => r.matchType === 'NONE' && r.status !== 'canceled'
    );
    const missingData = [
      [
        'מס׳ עבודה',
        'שם מטופל',
        'סוג עבודה',
        'תאריך קבלה',
        'תאריך משלוח',
        'סטטוס',
      ],
      ...missingResults.map((r) => [
        r.jobCode,
        r.patient,
        r.jobTags,
        r.acceptDate,
        r.deliveryDate,
        r.status,
      ]),
    ];
    const wsMissing = XLSX.utils.aoa_to_sheet(missingData);
    wsMissing['!cols'] = [
      { wch: 14 },
      { wch: 22 },
      { wch: 35 },
      { wch: 14 },
      { wch: 14 },
      { wch: 12 },
    ];
    XLSX.utils.book_append_sheet(wb, wsMissing, 'עבודות ללא חשבונית');

    // === Sheet 4: בוטלו ===
    const canceledResults = report.results.filter(
      (r) => r.matchType === 'NONE' && r.status === 'canceled'
    );
    const canceledData = [
      ['מס׳ עבודה', 'שם מטופל', 'סוג עבודה', 'תאריך קבלה'],
      ...canceledResults.map((r) => [
        r.jobCode,
        r.patient,
        r.jobTags,
        r.acceptDate,
      ]),
    ];
    const wsCanceled = XLSX.utils.aoa_to_sheet(canceledData);
    wsCanceled['!cols'] = [{ wch: 14 }, { wch: 22 }, { wch: 35 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(wb, wsCanceled, 'בוטלו');

    // Set RTL for all sheets
    for (const name of wb.SheetNames) {
      const sheet = wb.Sheets[name];
      if (!sheet['!views']) sheet['!views'] = [{}];
      (sheet['!views'] as Record<string, unknown>[])[0].RTL = true;
    }

    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buf, {
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="match-report.xlsx"`,
      },
    });
  } catch (err) {
    console.error('Export error:', err);
    return NextResponse.json({ error: 'שגיאה בייצוא הדוח' }, { status: 500 });
  }
}

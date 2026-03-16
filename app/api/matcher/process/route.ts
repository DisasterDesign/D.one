import { NextResponse } from 'next/server';
import { parseShenhavFile } from '@/lib/matcher/parse-shenhav';
import { parseHashavshevetFile } from '@/lib/matcher/parse-hashavshevet';
import { runMatching } from '@/lib/matcher/matching-engine';
import type { ColumnMapping } from '@/lib/matcher/types';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const shenhavBlob = formData.get('shenhavFile') as Blob | null;
    const hashavshevetBlob = formData.get('hashavshevetFile') as Blob | null;
    const mappingStr = formData.get('columnMapping') as string | null;

    if (!shenhavBlob || !hashavshevetBlob || !mappingStr) {
      return NextResponse.json({ error: 'חסרים קבצים או מיפוי עמודות' }, { status: 400 });
    }

    let columnMapping: ColumnMapping;
    try {
      columnMapping = JSON.parse(mappingStr);
    } catch {
      return NextResponse.json({ error: 'מיפוי עמודות לא תקין' }, { status: 400 });
    }

    const shenhavBuffer = await shenhavBlob.arrayBuffer();
    const hashavshevetBuffer = await hashavshevetBlob.arrayBuffer();

    const { records: quotes, errors: quoteErrors } = parseShenhavFile(shenhavBuffer, columnMapping.shenhav);
    const { records: invoices, errors: invoiceErrors } = parseHashavshevetFile(hashavshevetBuffer, columnMapping.hashavshevet);

    if (quotes.length === 0 && invoices.length === 0) {
      return NextResponse.json({ error: 'שני הקבצים ריקים' }, { status: 400 });
    }

    const allErrors = [...quoteErrors, ...invoiceErrors];
    const report = runMatching(quotes, invoices, allErrors);

    return NextResponse.json(report);
  } catch (err) {
    console.error('Matcher process error:', err);
    return NextResponse.json({ error: 'שגיאה בעיבוד הקבצים' }, { status: 500 });
  }
}

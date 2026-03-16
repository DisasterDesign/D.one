import { NextResponse } from 'next/server';
import { parseVeviFile } from '@/lib/matcher/parse-vevi';
import { parseHashavshevetFile } from '@/lib/matcher/parse-hashavshevet';
import { runMatching } from '@/lib/matcher/matching-engine';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const veviBlob = formData.get('veviFile') as Blob | null;
    const hashavshevetBlob = formData.get('hashavshevetFile') as Blob | null;

    if (!veviBlob || !hashavshevetBlob) {
      return NextResponse.json({ error: 'חסרים קבצים' }, { status: 400 });
    }

    const veviBuffer = await veviBlob.arrayBuffer();
    const hashavshevetBuffer = await hashavshevetBlob.arrayBuffer();

    const { records: veviJobs, totalBeforeFilter, filteredOut, errors: veviErrors } = parseVeviFile(veviBuffer);
    const { invoiceRecords, errors: hashavErrors } =
      parseHashavshevetFile(hashavshevetBuffer);

    if (veviJobs.length === 0) {
      return NextResponse.json(
        { error: 'קובץ Vevi ריק או לא ניתן לקרוא' },
        { status: 400 }
      );
    }

    const report = runMatching(veviJobs, invoiceRecords, {
      totalInFile: totalBeforeFilter,
      filteredOutBoxNumber: filteredOut,
    });

    // Attach parse errors for debugging
    const parseErrors = [...veviErrors, ...hashavErrors];
    return NextResponse.json({ ...report, parseErrors });
  } catch (err) {
    console.error('Matcher process error:', err);
    const message = err instanceof Error ? err.message : 'שגיאה בעיבוד הקבצים';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

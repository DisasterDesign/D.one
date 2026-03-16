'use client';

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import FileUploader from '@/components/matcher/FileUploader';
import ColumnMapper from '@/components/matcher/ColumnMapper';
import ResultsDashboard from '@/components/matcher/ResultsDashboard';
import type { UploadedFile, ColumnMapping, MatchReport } from '@/lib/matcher/types';

type Step = 'upload' | 'processing' | 'results';

export default function MatcherPage() {
  const [step, setStep] = useState<Step>('upload');
  const [shenhavFile, setShenhavFile] = useState<UploadedFile | null>(null);
  const [hashavshevetFile, setHashavshevetFile] = useState<UploadedFile | null>(null);
  const [shenhavMapping, setShenhavMapping] = useState<Record<string, string>>({});
  const [hashavshevetMapping, setHashavshevetMapping] = useState<Record<string, string>>({});
  const [report, setReport] = useState<MatchReport | null>(null);
  const [error, setError] = useState('');
  const [processingStep, setProcessingStep] = useState('');

  const canProcess =
    shenhavFile &&
    hashavshevetFile &&
    shenhavMapping.workNumber &&
    shenhavMapping.clientName &&
    shenhavMapping.amount &&
    hashavshevetMapping.invoiceNumber &&
    hashavshevetMapping.workNumber &&
    hashavshevetMapping.clientName &&
    hashavshevetMapping.amount;

  async function handleProcess() {
    if (!shenhavFile || !hashavshevetFile) return;

    setStep('processing');
    setError('');
    setProcessingStep('מכין קבצים...');

    try {
      const formData = new FormData();
      formData.append('shenhavFile', new Blob([shenhavFile.rawData]), shenhavFile.name);
      formData.append('hashavshevetFile', new Blob([hashavshevetFile.rawData]), hashavshevetFile.name);

      const mapping: ColumnMapping = {
        shenhav: {
          workNumber: shenhavMapping.workNumber,
          clientName: shenhavMapping.clientName,
          amount: shenhavMapping.amount,
          date: shenhavMapping.date || undefined,
        },
        hashavshevet: {
          invoiceNumber: hashavshevetMapping.invoiceNumber,
          workNumber: hashavshevetMapping.workNumber,
          clientName: hashavshevetMapping.clientName,
          amount: hashavshevetMapping.amount,
          date: hashavshevetMapping.date || undefined,
        },
      };

      formData.append('columnMapping', JSON.stringify(mapping));

      setProcessingStep('מעבד נתונים...');

      const res = await fetch('/api/matcher/process', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'שגיאה בעיבוד');
      }

      const data: MatchReport = await res.json();
      setReport(data);
      setStep('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה לא צפויה');
      setStep('upload');
    }
  }

  function handleReset() {
    setStep('upload');
    setShenhavFile(null);
    setHashavshevetFile(null);
    setShenhavMapping({});
    setHashavshevetMapping({});
    setReport(null);
    setError('');
  }

  if (step === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-[#0090D5] animate-spin mb-4" />
        <p className="text-lg font-bold text-[#142850]">{processingStep}</p>
        <p className="text-sm text-[#888888] mt-2">אנא המתן...</p>
      </div>
    );
  }

  if (step === 'results' && report) {
    return <ResultsDashboard report={report} onReset={handleReset} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#142850] mb-2">התאמת הצעות מחיר מול חשבוניות</h2>
        <p className="text-[#888888]">העלה קובץ Excel מ-שנהב + קובץ מחשבשבת</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* File Uploaders */}
      <div className="grid md:grid-cols-2 gap-4">
        <FileUploader
          label="קובץ שנהב"
          description="הצעות מחיר מ-Vevi Dental"
          onFileLoaded={setShenhavFile}
          onClear={() => { setShenhavFile(null); setShenhavMapping({}); }}
          file={shenhavFile}
        />
        <FileUploader
          label="קובץ חשבשבת"
          description="חשבוניות מחשבשבת"
          onFileLoaded={setHashavshevetFile}
          onClear={() => { setHashavshevetFile(null); setHashavshevetMapping({}); }}
          file={hashavshevetFile}
        />
      </div>

      {/* Column Mapping */}
      {(shenhavFile || hashavshevetFile) && (
        <div className="space-y-3">
          {shenhavFile && (
            <ColumnMapper
              headers={shenhavFile.headers}
              fileType="shenhav"
              onMappingChange={setShenhavMapping}
            />
          )}
          {hashavshevetFile && (
            <ColumnMapper
              headers={hashavshevetFile.headers}
              fileType="hashavshevet"
              onMappingChange={setHashavshevetMapping}
            />
          )}
        </div>
      )}

      {/* Process Button */}
      <div className="text-center">
        <button
          onClick={handleProcess}
          disabled={!canProcess}
          className="inline-flex items-center gap-2 px-8 py-3 bg-[#0090D5] hover:bg-[#007bb8] text-white font-bold rounded-xl text-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Search className="w-5 h-5" />
          בצע התאמה
        </button>
        {!canProcess && shenhavFile && hashavshevetFile && (
          <p className="text-sm text-red-500 mt-2">יש להשלים מיפוי עמודות חובה בשני הקבצים</p>
        )}
      </div>
    </div>
  );
}

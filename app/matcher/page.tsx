'use client';

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import FileUploader from '@/components/matcher/FileUploader';
import ResultsDashboard from '@/components/matcher/ResultsDashboard';
import type { MatchReport } from '@/lib/matcher/types';

interface UploadedFile {
  name: string;
  rawData: ArrayBuffer;
  rowCount: number;
}

type Step = 'upload' | 'processing' | 'results';

export default function MatcherPage() {
  const [step, setStep] = useState<Step>('upload');
  const [veviFile, setVeviFile] = useState<UploadedFile | null>(null);
  const [hashavshevetFile, setHashavshevetFile] = useState<UploadedFile | null>(null);
  const [report, setReport] = useState<MatchReport | null>(null);
  const [error, setError] = useState('');
  const [processingStep, setProcessingStep] = useState('');

  const canProcess = veviFile && hashavshevetFile;

  async function handleProcess() {
    if (!veviFile || !hashavshevetFile) return;

    setStep('processing');
    setError('');
    setProcessingStep('מכין קבצים...');

    try {
      const formData = new FormData();
      formData.append('veviFile', new Blob([veviFile.rawData]), veviFile.name);
      formData.append(
        'hashavshevetFile',
        new Blob([hashavshevetFile.rawData]),
        hashavshevetFile.name
      );

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
    setVeviFile(null);
    setHashavshevetFile(null);
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
        <h2 className="text-2xl font-bold text-[#142850] mb-2">
          התאמת עבודות מול חשבוניות
        </h2>
        <p className="text-[#888888]">
          העלה קובץ Excel מ-Vevi (שנהב) + קובץ כרטסת מחשבשבת
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* File Uploaders */}
      <div className="grid md:grid-cols-2 gap-4">
        <FileUploader
          label="קובץ Vevi (שנהב)"
          description="רשימת עבודות מ-Vevi Dental"
          onFileLoaded={setVeviFile}
          onClear={() => setVeviFile(null)}
          file={veviFile}
        />
        <FileUploader
          label="קובץ חשבשבת"
          description="כרטסת הנהלת חשבונות"
          onFileLoaded={setHashavshevetFile}
          onClear={() => setHashavshevetFile(null)}
          file={hashavshevetFile}
        />
      </div>

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
      </div>
    </div>
  );
}

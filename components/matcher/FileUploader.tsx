'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, FileSpreadsheet, X } from 'lucide-react';

interface UploadedFile {
  name: string;
  rawData: ArrayBuffer;
  rowCount: number;
  headers?: string[];
  previewRows?: Record<string, unknown>[];
}

interface Props {
  label: string;
  description: string;
  onFileLoaded: (file: UploadedFile) => void;
  onClear: () => void;
  file: UploadedFile | null;
}

export default function FileUploader({ label, description, onFileLoaded, onClear, file }: Props) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function processFile(f: File) {
    setError('');
    setLoading(true);

    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
    ];
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const hasValidExt = validExtensions.some((ext) => f.name.toLowerCase().endsWith(ext));

    if (!validTypes.includes(f.type) && !hasValidExt) {
      setError('פורמט לא נתמך. יש להעלות קובץ Excel או CSV');
      setLoading(false);
      return;
    }

    if (f.size > 10 * 1024 * 1024) {
      setError('הקובץ גדול מדי (מקסימום 10MB)');
      setLoading(false);
      return;
    }

    try {
      const XLSX = await import('xlsx');
      const arrayBuffer = await f.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });

      if (rows.length === 0) {
        setError('הקובץ ריק');
        setLoading(false);
        return;
      }

      const headers = Object.keys(rows[0]);
      const previewRows = rows.slice(0, 3);

      onFileLoaded({
        name: f.name,
        headers,
        previewRows,
        rowCount: rows.length,
        rawData: arrayBuffer,
      });
    } catch {
      setError('שגיאה בקריאת הקובץ');
    } finally {
      setLoading(false);
    }
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) processFile(f);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) processFile(f);
    if (inputRef.current) inputRef.current.value = '';
  }

  if (file) {
    return (
      <div className="border-2 border-[#0090D5] bg-blue-50 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-[#0090D5]" />
            <span className="font-bold text-[#142850]">{label}</span>
          </div>
          <button onClick={onClear} className="text-gray-400 hover:text-red-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-[#333333] mb-2">{file.name}</p>
        <p className="text-xs text-[#888888] mb-3">{file.rowCount} שורות{file.headers ? ` · ${file.headers.length} עמודות` : ''}</p>

        {/* Preview table */}
        {file.headers && file.previewRows && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr>
                  {file.headers.map((h) => (
                    <th key={h} className="bg-[#142850] text-white px-2 py-1 text-right whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {file.previewRows.map((row, i) => (
                  <tr key={i} className="border-b border-gray-200">
                    {file.headers!.map((h) => (
                      <td key={h} className="px-2 py-1 text-right whitespace-nowrap">
                        {String(row[h] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
        dragging ? 'border-[#0090D5] bg-blue-50' : 'border-gray-300 hover:border-[#0090D5]'
      }`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleChange}
        className="hidden"
      />
      {loading ? (
        <div className="animate-pulse">
          <FileSpreadsheet className="w-10 h-10 text-[#0090D5] mx-auto mb-3" />
          <p className="text-sm text-[#888888]">קורא קובץ...</p>
        </div>
      ) : (
        <>
          <Upload className="w-10 h-10 text-[#888888] mx-auto mb-3" />
          <p className="font-bold text-[#142850] mb-1">{label}</p>
          <p className="text-sm text-[#888888] mb-2">{description}</p>
          <p className="text-xs text-[#888888]">גרור לכאן או לחץ לבחירה</p>
          <p className="text-xs text-[#888888] mt-1">xlsx, xls, csv · עד 10MB</p>
        </>
      )}
      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
    </div>
  );
}

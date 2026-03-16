export interface QuoteRecord {
  workNumber: string;
  clientName: string;
  amount: number;
  date: string;
  rawRow: Record<string, unknown>;
  rowIndex: number;
}

export interface InvoiceRecord {
  invoiceNumber: string;
  workNumber: string;
  clientName: string;
  amount: number;
  date: string;
  details: string;
  rawRow: Record<string, unknown>;
  rowIndex: number;
}

export interface ColumnMapping {
  shenhav: {
    workNumber: string;
    clientName: string;
    amount: string;
    date?: string;
  };
  hashavshevet: {
    invoiceNumber: string;
    workNumber: string;
    clientName: string;
    amount: string;
    date?: string;
  };
}

export type MatchStatus =
  | 'MATCHED'
  | 'MISSING_INVOICE'
  | 'ORPHAN_INVOICE'
  | 'AMOUNT_MISMATCH'
  | 'DUPLICATE'
  | 'PARSE_ERROR';

export interface MatchResult {
  status: MatchStatus;
  quote?: QuoteRecord;
  invoice?: InvoiceRecord;
  amountDiff?: number;
  amountDiffPercent?: number;
  notes: string;
}

export interface MatchReport {
  timestamp: string;
  summary: {
    totalQuotes: number;
    totalInvoices: number;
    matched: number;
    missingInvoice: number;
    orphanInvoice: number;
    amountMismatch: number;
    duplicates: number;
    parseErrors: number;
  };
  results: MatchResult[];
  integrityCheck: {
    quotesAccountedFor: number;
    invoicesAccountedFor: number;
    isComplete: boolean;
  };
}

export interface UploadedFile {
  name: string;
  headers: string[];
  previewRows: Record<string, unknown>[];
  rowCount: number;
  rawData: ArrayBuffer;
}

export interface VeviRecord {
  jobCode: number;
  jobTags: string;
  customer: string;
  doctor: string;
  patient: string;
  boxNumber: string;
  acceptDate: string;
  deliveryDate: string;
  finishDate: string;
  status: string;
}

export interface HashavshevetRecord {
  headerNumber: number;
  transactionType: string;
  counterAccount: string;
  date: string;
  valueDate: string;
  reference: string;
  details: string;
  debitAmount: number | null;
  creditAmount: number | null;
  patientName: string;
  jobNumbers: number[];
  isInvoice: boolean;
}

export type MatchType = 'JOB_NUMBER' | 'EXACT_NAME' | 'NONE';

export interface MatchResult {
  jobCode: number;
  patient: string;
  jobTags: string;
  acceptDate: string;
  deliveryDate: string;
  status: string;
  matchType: MatchType;
  matchedInvoiceDetails: string;
  matchedInvoiceAmount: number | null;
  invoiceNumber: string;
}

export interface MatchReport {
  timestamp: string;
  totalInFile: number;
  filteredOutBoxNumber: number;
  total: number;
  matchedByNumber: number;
  matchedByName: number;
  totalMatched: number;
  canceled: number;
  missing: number;
  matchedPercent: string;
  missingPercent: string;
  results: MatchResult[];
}

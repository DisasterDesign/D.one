import type { VeviRecord, HashavshevetRecord, MatchResult, MatchReport } from './types';

export function runMatching(
  veviJobs: VeviRecord[],
  hashavInvoices: HashavshevetRecord[]
): MatchReport {
  const timestamp = new Date().toISOString();

  // === STEP 1: Build lookup sets from Hashavshevet invoices ===
  const invoiceJobNumbers = new Set<number>();
  const invoiceNames = new Set<string>();
  const nameToInvoice = new Map<string, HashavshevetRecord>();
  const jobNumToInvoice = new Map<number, HashavshevetRecord>();

  for (const inv of hashavInvoices) {
    if (!inv.isInvoice) continue;

    for (const num of inv.jobNumbers) {
      invoiceJobNumbers.add(num);
      if (!jobNumToInvoice.has(num)) {
        jobNumToInvoice.set(num, inv);
      }
    }
    if (inv.patientName) {
      invoiceNames.add(inv.patientName);
      if (!nameToInvoice.has(inv.patientName)) {
        nameToInvoice.set(inv.patientName, inv);
      }
    }
  }

  // === STEP 2: Match each Vevi job ===
  const results: MatchResult[] = [];
  let matchedByNumber = 0;
  let matchedByName = 0;
  let canceledCount = 0;
  let missingCount = 0;

  for (const job of veviJobs) {
    const result: MatchResult = {
      jobCode: job.jobCode,
      patient: job.patient,
      jobTags: job.jobTags,
      acceptDate: job.acceptDate,
      deliveryDate: job.deliveryDate,
      status: job.status,
      matchType: 'NONE',
      matchedInvoiceDetails: '',
      matchedInvoiceAmount: null,
    };

    // Try match by job number first (highest confidence)
    if (invoiceJobNumbers.has(job.jobCode)) {
      result.matchType = 'JOB_NUMBER';
      const inv = jobNumToInvoice.get(job.jobCode);
      if (inv) {
        result.matchedInvoiceDetails = inv.details;
        result.matchedInvoiceAmount = inv.debitAmount;
      }
      matchedByNumber++;
    }
    // Fallback: try EXACT name match
    else if (job.patient && invoiceNames.has(job.patient)) {
      result.matchType = 'EXACT_NAME';
      const inv = nameToInvoice.get(job.patient);
      if (inv) {
        result.matchedInvoiceDetails = inv.details;
        result.matchedInvoiceAmount = inv.debitAmount;
      }
      matchedByName++;
    }
    // No match
    else {
      if (job.status === 'canceled') {
        canceledCount++;
      } else {
        missingCount++;
      }
    }

    results.push(result);
  }

  const totalMatched = matchedByNumber + matchedByName;
  const total = veviJobs.length;

  return {
    timestamp,
    total,
    matchedByNumber,
    matchedByName,
    totalMatched,
    canceled: canceledCount,
    missing: missingCount,
    matchedPercent: total > 0 ? ((totalMatched / total) * 100).toFixed(1) + '%' : '0%',
    missingPercent: total > 0 ? ((missingCount / total) * 100).toFixed(1) + '%' : '0%',
    results,
  };
}

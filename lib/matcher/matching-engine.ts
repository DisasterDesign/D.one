import type { QuoteRecord, InvoiceRecord, MatchResult, MatchReport } from './types';

export function runMatching(
  quotes: QuoteRecord[],
  invoices: InvoiceRecord[],
  parseErrors: string[] = []
): MatchReport {
  const results: MatchResult[] = [];
  const timestamp = new Date().toISOString();

  // Build lookup maps (arrays to handle duplicates)
  const quotesByWork = new Map<string, QuoteRecord[]>();
  const invoicesByWork = new Map<string, InvoiceRecord[]>();

  for (const q of quotes) {
    if (!q.workNumber) continue;
    const existing = quotesByWork.get(q.workNumber) || [];
    existing.push(q);
    quotesByWork.set(q.workNumber, existing);
  }

  for (const inv of invoices) {
    if (!inv.workNumber) continue;
    const existing = invoicesByWork.get(inv.workNumber) || [];
    existing.push(inv);
    invoicesByWork.set(inv.workNumber, existing);
  }

  // Track which invoices have been matched
  const matchedInvoiceIndices = new Set<number>();

  // Parse error records (quotes/invoices with empty work numbers)
  for (const q of quotes) {
    if (!q.workNumber) {
      results.push({
        status: 'PARSE_ERROR',
        quote: q,
        notes: `שורה ${q.rowIndex}: מספר עבודה ריק`,
      });
    }
  }

  for (const inv of invoices) {
    if (!inv.workNumber) {
      results.push({
        status: 'PARSE_ERROR',
        invoice: inv,
        notes: `שורה ${inv.rowIndex}: מספר עבודה ריק`,
      });
      matchedInvoiceIndices.add(inv.rowIndex);
    }
  }

  // Forward match: quotes → invoices
  const processedQuoteWorkNumbers = new Set<string>();

  for (const q of quotes) {
    if (!q.workNumber) continue;

    // Check for duplicate quotes
    const sameQuotes = quotesByWork.get(q.workNumber) || [];
    if (sameQuotes.length > 1 && !processedQuoteWorkNumbers.has(q.workNumber)) {
      processedQuoteWorkNumbers.add(q.workNumber);
      for (const dupQ of sameQuotes) {
        results.push({
          status: 'DUPLICATE',
          quote: dupQ,
          notes: `מספר עבודה ${q.workNumber} מופיע ${sameQuotes.length} פעמים בקובץ הצעות`,
        });
      }
      // Still try to match duplicates with invoices
      const matchingInvoices = invoicesByWork.get(q.workNumber) || [];
      for (const inv of matchingInvoices) {
        matchedInvoiceIndices.add(inv.rowIndex);
      }
      continue;
    }

    if (processedQuoteWorkNumbers.has(q.workNumber)) continue;
    processedQuoteWorkNumbers.add(q.workNumber);

    const matchingInvoices = invoicesByWork.get(q.workNumber) || [];

    if (matchingInvoices.length === 0) {
      results.push({
        status: 'MISSING_INVOICE',
        quote: q,
        notes: `הצעה ${q.workNumber} — לא נמצאה חשבונית`,
      });
    } else if (matchingInvoices.length > 1) {
      // Multiple invoices for same work number
      for (const inv of matchingInvoices) {
        matchedInvoiceIndices.add(inv.rowIndex);
        results.push({
          status: 'DUPLICATE',
          quote: q,
          invoice: inv,
          notes: `מספר עבודה ${q.workNumber} — ${matchingInvoices.length} חשבוניות`,
        });
      }
    } else {
      const inv = matchingInvoices[0];
      matchedInvoiceIndices.add(inv.rowIndex);

      const diff = Math.abs(q.amount - inv.amount);
      const diffPercent = q.amount !== 0 ? (diff / q.amount) * 100 : (inv.amount !== 0 ? 100 : 0);

      if (diff > 1) {
        results.push({
          status: 'AMOUNT_MISMATCH',
          quote: q,
          invoice: inv,
          amountDiff: q.amount - inv.amount,
          amountDiffPercent: Math.round(diffPercent * 100) / 100,
          notes: `הפרש: ${(q.amount - inv.amount).toLocaleString('he-IL')} ₪ (${diffPercent.toFixed(1)}%)`,
        });
      } else {
        results.push({
          status: 'MATCHED',
          quote: q,
          invoice: inv,
          amountDiff: 0,
          amountDiffPercent: 0,
          notes: 'התאמה מלאה',
        });
      }
    }
  }

  // Reverse match: orphan invoices
  for (const inv of invoices) {
    if (!inv.workNumber) continue;
    if (matchedInvoiceIndices.has(inv.rowIndex)) continue;

    results.push({
      status: 'ORPHAN_INVOICE',
      invoice: inv,
      notes: `חשבונית ${inv.invoiceNumber || inv.workNumber} — לא נמצאה הצעה`,
    });
  }

  // Summary
  const summary = {
    totalQuotes: quotes.length,
    totalInvoices: invoices.length,
    matched: results.filter((r) => r.status === 'MATCHED').length,
    missingInvoice: results.filter((r) => r.status === 'MISSING_INVOICE').length,
    orphanInvoice: results.filter((r) => r.status === 'ORPHAN_INVOICE').length,
    amountMismatch: results.filter((r) => r.status === 'AMOUNT_MISMATCH').length,
    duplicates: results.filter((r) => r.status === 'DUPLICATE').length,
    parseErrors: results.filter((r) => r.status === 'PARSE_ERROR').length + parseErrors.length,
  };

  // Integrity check
  const quotesInResults = new Set<number>();
  const invoicesInResults = new Set<number>();
  for (const r of results) {
    if (r.quote) quotesInResults.add(r.quote.rowIndex);
    if (r.invoice) invoicesInResults.add(r.invoice.rowIndex);
  }

  const integrityCheck = {
    quotesAccountedFor: quotesInResults.size,
    invoicesAccountedFor: invoicesInResults.size,
    isComplete: quotesInResults.size === quotes.length && invoicesInResults.size === invoices.length,
  };

  return { timestamp, summary, results, integrityCheck };
}

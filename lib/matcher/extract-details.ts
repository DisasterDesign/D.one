/**
 * Extract patient name and job numbers from Hashavshevet "details" field.
 *
 * Handles these formats:
 * 1. "פאר רמי-33151"              → name + [33151]
 * 2. "הלמן מיכאל-30553+31641"     → name + [30553, 31641]
 * 3. "אייל חיה"                   → name + []
 * 4. "מור מיקי-עבור כתר חרסינה"   → name + []
 * 5. "העברה ישירה לבנק"           → text + []
 */
export function extractFromDetails(details: string): {
  patientName: string;
  jobNumbers: number[];
} {
  if (!details || details.trim() === '') {
    return { patientName: '', jobNumbers: [] };
  }

  // Extract ALL 4-5 digit numbers from the string
  const allNumbers = details.match(/\b(\d{4,5})\b/g);
  const jobNumbers = allNumbers ? allNumbers.map(Number) : [];

  // Extract patient name:
  // Remove the dash and everything after it that starts with a number
  let patientName = details
    .replace(/[-–]\s*\d[\d+\s]*$/, '')  // Remove "-XXXXX+YYYYY" at end
    .replace(/[-–]\s*\d[\d+\s]*/g, '')  // Remove "-XXXXX" in middle
    .trim();

  // If the name still has 4-5 digit numbers, clean them
  if (/\d{4,5}/.test(patientName)) {
    patientName = patientName.replace(/\d{4,5}/g, '').replace(/[+]/g, '').trim();
  }

  // Clean extra spaces and leading/trailing dashes
  patientName = patientName
    .replace(/\s+/g, ' ')
    .replace(/^[-–\s]+|[-–\s]+$/g, '')
    .trim();

  return { patientName, jobNumbers };
}

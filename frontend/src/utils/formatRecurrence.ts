/**
 * Format recurrence months to display label
 * @param months - Number of months (0, 1, 3, 6, 12, etc.)
 * @returns Formatted label (e.g., "1 mese", "3 mesi", "Annuale")
 */
export function formatRecurrence(months: number): string {
  if (!months || months === 0) return '—';
  if (months === 1) return '1 mese';
  if (months === 3) return 'Trimestrale';
  if (months === 6) return 'Semestrale';
  if (months === 12) return 'Annuale';
  return `${months} mesi`;
}

/**
 * Get recurrence options for dropdown/select
 */
export const recurrenceOptions = [
  { value: 0, label: 'Non ricorrente' },
  { value: 1, label: '1 mese' },
  { value: 3, label: 'Trimestrale (3 mesi)' },
  { value: 6, label: 'Semestrale (6 mesi)' },
  { value: 12, label: 'Annuale (12 mesi)' },
];

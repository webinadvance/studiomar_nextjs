import { addMonths, isBefore, startOfDay } from 'date-fns';

/**
 * Calculates the next recurring deadline date.
 *
 * Algorithm:
 * - If rec === 0 (non-recurring), return original date as-is
 * - If rec > 0, add 'rec' months to the original date repeatedly until
 *   the result is >= today
 *
 * @param originalDate - The base deadline date
 * @param recuranceMonths - Number of months for recurrence (0 = non-recurring)
 * @returns The calculated next deadline date, or null if no date provided
 */
export function calculateRecurringDate(
  originalDate: Date | null,
  recuranceMonths: number
): Date | null {
  if (!originalDate) return null;

  if (recuranceMonths === 0) {
    return originalDate;
  }

  const today = startOfDay(new Date());
  let calculatedDate = originalDate;

  // Keep adding months until we reach a date >= today
  while (isBefore(calculatedDate, today)) {
    calculatedDate = addMonths(calculatedDate, recuranceMonths);
  }

  return calculatedDate;
}

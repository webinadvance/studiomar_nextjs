import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';

/**
 * Format a date to Italian locale string.
 * Default format: dd/MM/yyyy
 */
export function formatDate(
  date: Date | string | null | undefined,
  formatStr: string = 'dd/MM/yyyy'
): string {
  if (!date) return '—';
  try {
    const parsed = typeof date === 'string' ? parseISO(date) : date;
    return format(parsed, formatStr, { locale: it });
  } catch {
    return '—';
  }
}

/**
 * Format a date with time to Italian locale string.
 * Format: dd/MM/yyyy HH:mm
 */
export function formatDateTime(
  date: Date | string | null | undefined
): string {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
}

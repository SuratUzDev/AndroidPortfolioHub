import { format, parseISO, isValid } from "date-fns";

/**
 * Format a date using date-fns with a consistent format
 * @param date Date object, ISO string, or timestamp
 * @param formatStr Optional format string (defaults to 'MMMM d, yyyy')
 * @returns Formatted date string or empty string if invalid
 */
export function formatDate(
  date: Date | string | number | null | undefined,
  formatStr = "MMMM d, yyyy"
): string {
  if (!date) return "";
  
  try {
    let dateObj: Date;
    
    if (date instanceof Date) {
      dateObj = date;
    } else if (typeof date === "string") {
      // Try to parse as ISO string
      dateObj = parseISO(date);
    } else if (typeof date === "number") {
      // Assume timestamp
      dateObj = new Date(date);
    } else {
      return "";
    }
    
    if (!isValid(dateObj)) {
      return "";
    }
    
    return format(dateObj, formatStr);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
}

/**
 * Format a date for HTML input date fields (yyyy-MM-dd format)
 * @param date Date object, ISO string, or timestamp
 * @returns Date string formatted as yyyy-MM-dd
 */
export function formatDateForInput(
  date: Date | string | number | null | undefined
): string {
  if (!date) return "";
  
  return formatDate(date, "yyyy-MM-dd");
}

/**
 * Format a date range (start and optional end date)
 * @param startDate Start date
 * @param endDate Optional end date
 * @param formatStr Optional format string
 * @returns Formatted date range string
 */
export function formatDateRange(
  startDate: Date | string | number | null | undefined,
  endDate: Date | string | number | null | undefined,
  formatStr = "MMM yyyy"
): string {
  const start = formatDate(startDate, formatStr);
  
  if (!endDate) {
    return `${start} - Present`;
  }
  
  const end = formatDate(endDate, formatStr);
  return `${start} - ${end}`;
}

/**
 * Returns a relative time string (e.g., "2 days ago")
 * Currently a placeholder for future implementation
 */
export function getRelativeTimeString(date: Date | string | number): string {
  // This could be expanded with a library like date-fns/formatDistanceToNow
  const dateStr = formatDate(date);
  return dateStr;
}
/**
 * Persian Date Service
 * Provides utilities for working with Persian (Jalali) calendar dates
 */

import {
  format as formatJalali,
  formatRelative as formatRelativeJalali,
  formatDistance as formatDistanceJalali,
  parse as parseJalali,
  isValid as isValidJalali,
  addDays as addDaysJalali,
  addMonths as addMonthsJalali,
  addYears as addYearsJalali,
  subDays as subDaysJalali,
  subMonths as subMonthsJalali,
  subYears as subYearsJalali,
  startOfDay as startOfDayJalali,
  endOfDay as endOfDayJalali,
  startOfMonth as startOfMonthJalali,
  endOfMonth as endOfMonthJalali,
  startOfYear as startOfYearJalali,
  endOfYear as endOfYearJalali,
  isBefore as isBeforeJalali,
  isAfter as isAfterJalali,
  isSameDay as isSameDayJalali,
  isSameMonth as isSameMonthJalali,
  isSameYear as isSameYearJalali,
  differenceInDays as differenceInDaysJalali,
  differenceInMonths as differenceInMonthsJalali,
  differenceInYears as differenceInYearsJalali
} from "date-fns-jalali";
import { toPersianDigits } from "./utils";

/**
 * Format a date to Persian calendar string with Persian digits
 * @param date - Date to format (Date object, timestamp, or ISO string)
 * @param formatStr - Format string (default: "yyyy/MM/dd")
 * @returns Formatted Persian date string with Persian digits
 *
 * Common format patterns:
 * - "yyyy/MM/dd" -> ۱۴۰۳/۱۰/۱۳
 * - "dd MMMM yyyy" -> ۱۳ دی ۱۴۰۳
 * - "EEEE dd MMMM yyyy" -> جمعه ۱۳ دی ۱۴۰۳
 * - "HH:mm:ss" -> ۱۴:۳۰:۴۵
 * - "yyyy/MM/dd HH:mm" -> ۱۴۰۳/۱۰/۱۳ ۱۴:۳۰
 */
export function formatPersianDate(date: Date | number | string, formatStr = "yyyy/MM/dd"): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const formatted = formatJalali(dateObj, formatStr);
  return toPersianDigits(formatted);
}

/** with Persian digits
 * @param date - Date to format
 * @returns Relative date string with Persian digits (e.g., "دیروز در ساعت ۱۴:۳۰")
 */
export function formatPersianRelative(date: Date | number | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const formatted = formatRelativeJalali(dateObj, new Date());
  return toPersianDigits(formatted);
}

/** with Persian digits
 * @param date - Date to compare
 * @param baseDate - Base date (default: now)
 * @param addSuffix - Add "ago" or "in" suffix (default: true)
 * @returns Distance string with Persian digits (e.g., "۳ روز پیش")
 */
export function formatPersianDistance(
  date: Date | number | string,
  baseDate?: Date | number,
  addSuffix = true
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const formatted = formatDistanceJalali(dateObj, baseDate ?? new Date(), { addSuffix });
  return toPersianDigits(formatted);
}

/**
 * Parse a Persian date string to Date object
 * @param dateString - Persian date string
 * @param formatStr - Format pattern (default: "yyyy/MM/dd")
 * @param referenceDate - Reference date for parsing (default: now)
 * @returns Parsed Date object
 */
export function parsePersianDate(dateString: string, formatStr = "yyyy/MM/dd", referenceDate?: Date): Date {
  return parseJalali(dateString, formatStr, referenceDate ?? new Date());
}

/**
 * Check if a date is valid
 * @param date - Date to validate
 * @returns true if valid
 */
export function isValidDate(date: Date | number | string): boolean {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return isValidJalali(dateObj);
}

/**
 * Add days to a date
 */
export function addDays(date: Date | number | string, amount: number): Date {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return addDaysJalali(dateObj, amount);
}

/**
 * Add months to a date
 */
export function addMonths(date: Date | number | string, amount: number): Date {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return addMonthsJalali(dateObj, amount);
}

/**
 * Add years to a date
 */
export function addYears(date: Date | number | string, amount: number): Date {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return addYearsJalali(dateObj, amount);
}

/**
 * Subtract days from a date
 */
export function subDays(date: Date | number | string, amount: number): Date {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return subDaysJalali(dateObj, amount);
}

/**
 * Subtract months from a date
 */
export function subMonths(date: Date | number | string, amount: number): Date {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return subMonthsJalali(dateObj, amount);
}

/**
 * Subtract years from a date
 */
export function subYears(date: Date | number | string, amount: number): Date {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return subYearsJalali(dateObj, amount);
}

/**
 * Get start of day
 */
export function startOfDay(date: Date | number | string): Date {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return startOfDayJalali(dateObj);
}

/**
 * Get end of day
 */
export function endOfDay(date: Date | number | string): Date {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return endOfDayJalali(dateObj);
}

/**
 * Get start of month
 */
export function startOfMonth(date: Date | number | string): Date {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return startOfMonthJalali(dateObj);
}

/**
 * Get end of month
 */
export function endOfMonth(date: Date | number | string): Date {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return endOfMonthJalali(dateObj);
}

/**
 * Get start of year
 */
export function startOfYear(date: Date | number | string): Date {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return startOfYearJalali(dateObj);
}

/**
 * Get end of year
 */
export function endOfYear(date: Date | number | string): Date {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return endOfYearJalali(dateObj);
}

/**
 * Check if first date is before second date
 */
export function isBefore(date: Date | number | string, dateToCompare: Date | number | string): boolean {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const compareObj = typeof dateToCompare === "string" ? new Date(dateToCompare) : dateToCompare;
  return isBeforeJalali(dateObj, compareObj);
}

/**
 * Check if first date is after second date
 */
export function isAfter(date: Date | number | string, dateToCompare: Date | number | string): boolean {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const compareObj = typeof dateToCompare === "string" ? new Date(dateToCompare) : dateToCompare;
  return isAfterJalali(dateObj, compareObj);
}

/**
 * Check if two dates are on the same day
 */
export function isSameDay(dateLeft: Date | number | string, dateRight: Date | number | string): boolean {
  const leftObj = typeof dateLeft === "string" ? new Date(dateLeft) : dateLeft;
  const rightObj = typeof dateRight === "string" ? new Date(dateRight) : dateRight;
  return isSameDayJalali(leftObj, rightObj);
}

/**
 * Check if two dates are in the same month
 */
export function isSameMonth(dateLeft: Date | number | string, dateRight: Date | number | string): boolean {
  const leftObj = typeof dateLeft === "string" ? new Date(dateLeft) : dateLeft;
  const rightObj = typeof dateRight === "string" ? new Date(dateRight) : dateRight;
  return isSameMonthJalali(leftObj, rightObj);
}

/**
 * Check if two dates are in the same year
 */
export function isSameYear(dateLeft: Date | number | string, dateRight: Date | number | string): boolean {
  const leftObj = typeof dateLeft === "string" ? new Date(dateLeft) : dateLeft;
  const rightObj = typeof dateRight === "string" ? new Date(dateRight) : dateRight;
  return isSameYearJalali(leftObj, rightObj);
}

/**
 * Get difference in days between two dates
 */
export function differenceInDays(dateLeft: Date | number | string, dateRight: Date | number | string): number {
  const leftObj = typeof dateLeft === "string" ? new Date(dateLeft) : dateLeft;
  const rightObj = typeof dateRight === "string" ? new Date(dateRight) : dateRight;
  return differenceInDaysJalali(leftObj, rightObj);
}

/**
 * Get difference in months between two dates
 */
export function differenceInMonths(dateLeft: Date | number | string, dateRight: Date | number | string): number {
  const leftObj = typeof dateLeft === "string" ? new Date(dateLeft) : dateLeft;
  const rightObj = typeof dateRight === "string" ? new Date(dateRight) : dateRight;
  return differenceInMonthsJalali(leftObj, rightObj);
}

/**
 * Get difference in years between two dates
 */
export function differenceInYears(dateLeft: Date | number | string, dateRight: Date | number | string): number {
  const leftObj = typeof dateLeft === "string" ? new Date(dateLeft) : dateLeft;
  const rightObj = typeof dateRight === "string" ? new Date(dateRight) : dateRight;
  return differenceInYearsJalali(leftObj, rightObj);
}

/** with Persian digits
 * Get current Persian date as formatted string
 */
export function nowPersian(formatStr = "yyyy/MM/dd"): string {
  return formatPersianDate(new Date(), formatStr);
}

/**
 * Get today at start of day
 */
export function todayStart(): Date {
  return startOfDay(new Date());
}

/**
 * Get today at end of day
 */
export function todayEnd(): Date {
  return endOfDay(new Date());
}

/** (all output with Persian digits)
 */
export const DATE_FORMATS = {
  /** ۱۴۰۳/۱۰/۱۳ */
  SHORT: "yyyy/MM/dd",
  /** ۱۳ دی ۱۴۰۳ */
  MEDIUM: "dd MMMM yyyy",
  /** جمعه ۱۳ دی ۱۴۰۳ */
  LONG: "EEEE dd MMMM yyyy",
  /** ۱۴۰۳/۱۰/۱۳ ۱۴:۳۰ */
  SHORT_WITH_TIME: "yyyy/MM/dd HH:mm",
  /** ۱۳ دی ۱۴۰۳ ساعت ۱۴:۳۰ */
  MEDIUM_WITH_TIME: "dd MMMM yyyy 'ساعت' HH:mm",
  /** ۱۴:۳۰:۴۵ */
  TIME_ONLY: "HH:mm:ss",
  /** ۱۴:۳۰: "HH:mm:ss",
  /** 14:30 */
  TIME_SHORT: "HH:mm"
} as const;

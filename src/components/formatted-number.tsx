import * as React from "react";
import { toPersianDigits } from "@/lib/utils";

export type FormattedNumberProps = {
  value: number | string;
  className?: string;
  locale?: string;
  useGrouping?: boolean;
};

function formatWithGrouping(value: number | string, locale: string, useGrouping: boolean): string {
  // Preserve leading zeros for string inputs (phone numbers, national codes, etc.).
  // If `value` is a string, format it as a string so we don't lose leading zeroes by coercing to Number.
  if (typeof value === "string") {
    // If the string is not a plain number (contains letters/symbols), return as-is.
    if (!/^\d+(?:\.\d+)?$/.test(value)) return value.toString();

    // For pure digit strings, optionally insert grouping separators without converting to Number.
    if (!useGrouping) return value.toString();

    const parts = value.split(".");
    const intPart = parts[0];
    const decPart = parts[1];

    // Insert grouping separator (every 3 digits) from the right, preserving leading zeros.
    const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, "٬");
    return decPart ? `${grouped}.${decPart}` : grouped;
  }

  // For numeric values use Intl so locale-specific formatting is correct.
  const num = value;
  if (isNaN(Number(num))) return String(num);
  if (useGrouping) {
    return Number(num).toLocaleString(locale, { useGrouping: true }).replace(/,/g, "٬");
  }
  return Number(num).toLocaleString(locale, { useGrouping: false });
}

export function FormattedNumber({ value, className, locale = "fa-IR", useGrouping = true }: FormattedNumberProps) {
  const formatted = formatWithGrouping(value, locale, useGrouping);
  return <span className={className}>{toPersianDigits(formatted)}</span>;
}

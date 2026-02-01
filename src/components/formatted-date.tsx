import * as React from "react";
import { formatPersianDate, formatPersianDistance, DATE_FORMATS } from "@/lib/date-service";

export type FormattedDateProps = {
  value: Date | string;
  className?: string;
  format?: string | "relative";
};

/**
 * FormattedDate component: formats a date with Persian (Jalali) calendar
 */
export function FormattedDate({ value, className, format = DATE_FORMATS.MEDIUM }: FormattedDateProps) {
  const formatted = format === "relative" ? formatPersianDistance(value) : formatPersianDate(value, format);
  return <span className={className}>{formatted}</span>;
}

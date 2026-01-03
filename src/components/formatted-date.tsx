import * as React from "react";
import { formatPersianDate, DATE_FORMATS } from "@/lib/date-service";

export type FormattedDateProps = {
  value: Date | string;
  className?: string;
  format?: string;
};

/**
 * FormattedDate component: formats a date with Persian (Jalali) calendar
 */
export function FormattedDate({ value, className, format = DATE_FORMATS.MEDIUM }: FormattedDateProps) {
  const formatted = formatPersianDate(value, format);
  return <span className={className}>{formatted}</span>;
}

import * as React from "react";
import { toPersianDigits } from "@/lib/utils";

export type FormattedNumberProps = {
  value: number | string;
  className?: string;
  locale?: string;
};

function formatWithGrouping(value: number | string, locale: string): string {
  const num = typeof value === "string" ? Number(value) : value;
  if (isNaN(num)) return value.toString();
  // Use custom grouping for every 3 digits
  return num.toLocaleString(locale, { useGrouping: true }).replace(/,/g, "٬"); // Use Persian thousands separator
}

export function FormattedNumber({ value, className, locale = "fa-IR" }: FormattedNumberProps) {
  const formatted = formatWithGrouping(value, locale);
  return <span className={className}>{toPersianDigits(formatted)}</span>;
}

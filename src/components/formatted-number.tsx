import * as React from "react";
import { toPersianDigits } from "@/lib/utils";

export type FormattedNumberProps = {
  value: number | string;
  className?: string;
  locale?: string;
  useGrouping?: boolean;
};

function formatWithGrouping(value: number | string, locale: string, useGrouping: boolean): string {
  const num = typeof value === "string" ? Number(value) : value;
  if (isNaN(num)) return value.toString();
  if (useGrouping) {
    return num.toLocaleString(locale, { useGrouping: true }).replace(/,/g, "٬");
  }
  return num.toLocaleString(locale, { useGrouping: false });
}

export function FormattedNumber({ value, className, locale = "fa-IR", useGrouping = true }: FormattedNumberProps) {
  const formatted = formatWithGrouping(value, locale, useGrouping);
  return <span className={className}>{toPersianDigits(formatted)}</span>;
}

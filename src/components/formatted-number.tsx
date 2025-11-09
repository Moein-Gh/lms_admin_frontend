import * as React from "react";
import { toPersianDigits } from "@/lib/utils";

export type FormattedNumberProps = {
  value: number | string;
  className?: string;
  locale?: string;
};

export function FormattedNumber({ value, className, locale = "fa-IR" }: FormattedNumberProps) {
  // Format number with locale grouping, then convert digits
  const formatted = typeof value === "number" ? value.toLocaleString(locale) : value;
  return <span className={className}>{toPersianDigits(formatted)}</span>;
}

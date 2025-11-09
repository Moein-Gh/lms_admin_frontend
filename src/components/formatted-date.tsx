import * as React from "react";
import { toPersianDigits } from "@/lib/utils";

export type FormattedDateProps = {
  value: Date | string;
  className?: string;
  locale?: string;
  options?: Intl.DateTimeFormatOptions;
};

/**
 * FormattedDate component: formats a date with Persian locale and digits
 */
export function FormattedDate({ value, className, locale = "fa-IR", options }: FormattedDateProps) {
  const dateObj = typeof value === "string" ? new Date(value) : value;
  const formatted = dateObj.toLocaleDateString(
    locale,
    options ?? {
      year: "numeric",
      month: "long",
      day: "numeric"
    }
  );
  return <span className={className}>{toPersianDigits(formatted)}</span>;
}

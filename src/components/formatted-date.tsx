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
  // Use a safe Intl formatting with a fallback to a deterministic ISO-like format
  const formatOptions: Intl.DateTimeFormatOptions = options ?? {
    year: "numeric",
    month: "long",
    day: "numeric"
  };

  let formatted: string;
  try {
    // Try to format using the requested locale. Node.js may not have full ICU data
    // for some locales in all environments, so guard with try/catch and provide
    // a deterministic fallback to avoid hydration mismatches between server and client.
    formatted = dateObj.toLocaleDateString(locale, formatOptions);
  } catch (e) {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, "0");
    const d = String(dateObj.getDate()).padStart(2, "0");
    formatted = `${y}/${m}/${d}`;
  }
  return <span className={className}>{toPersianDigits(formatted)}</span>;
}

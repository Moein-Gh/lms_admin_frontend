import * as React from "react";
import Toman from "@/app/icons/toman";
import { cn, toPersianDigits } from "@/lib/utils";

export type FormattedNumberProps = {
  readonly value: number | string;
  readonly className?: string;
  readonly locale?: string;
  readonly useGrouping?: boolean;
  readonly type: "price" | "normal";
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
    try {
      return Number(num).toLocaleString(locale, { useGrouping: true }).replace(/,/g, "٬");
    } catch (e) {
      // Fallback: basic grouping insertion so server and client stay consistent
      const parts = String(Math.trunc(Number(num))).split("");
      let i = parts.length - 3;
      while (i > 0) {
        parts.splice(i, 0, "٬");
        i -= 3;
      }
      const intPart = parts.join("");
      const dec = String(Number(num)).split(".")[1];
      return dec ? `${intPart}.${dec}` : intPart;
    }
  }
  try {
    return Number(num).toLocaleString(locale, { useGrouping: false });
  } catch (e) {
    return String(num);
  }
}

export function FormattedNumber({
  value,
  className,
  locale = "fa-IR",
  useGrouping,
  type = "normal"
}: FormattedNumberProps) {
  // Precedence: if `useGrouping` is explicitly provided, it overrides `type`.
  // Otherwise `type` controls grouping: `price` -> true, `normal` -> false.
  const effectiveGrouping = useGrouping ?? type === "price";
  const formatted = formatWithGrouping(value, locale, effectiveGrouping);
  const persian = toPersianDigits(formatted);

  if (type === "price") {
    return (
      <span className={cn("inline-flex items-center gap-1", className)}>
        <span>{persian}</span>
        <Toman size="1em" />
      </span>
    );
  }

  return <span className={className}>{persian}</span>;
}

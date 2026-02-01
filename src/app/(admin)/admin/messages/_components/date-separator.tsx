"use client";

import { FormattedDate } from "@/components/formatted-date";
import { DATE_FORMATS } from "@/lib/date-service";

interface DateSeparatorProps {
  date: Date | string;
}

export function DateSeparator({ date }: DateSeparatorProps) {
  return (
    <div className="relative flex items-center justify-center py-4">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border/50" />
      </div>
      <div className="relative bg-background px-4">
        <span className="text-xs font-medium text-muted-foreground">
          <FormattedDate value={date} format={DATE_FORMATS.MEDIUM} />
        </span>
      </div>
    </div>
  );
}

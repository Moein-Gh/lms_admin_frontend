"use client";

import * as React from "react";

type Props = {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  dir?: "rtl" | "ltr";
};

export function EmptyStateCard({ title, description, icon, className, dir = "rtl" }: Props) {
  return (
    <div dir={dir} className={"flex justify-center items-center py-8 " + (className ?? "")}>
      <div className="max-w-sm w-full bg-muted/40 rounded-xl shadow-sm border border-muted p-6 flex flex-col items-center gap-3">
        {icon ?? (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-muted-foreground">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}

        <span className="font-bold text-lg text-muted-foreground">{title}</span>

        {description && <span className="text-sm text-muted-foreground text-center">{description}</span>}
      </div>
    </div>
  );
}

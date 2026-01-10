"use client";

import { SearchIcon, XIcon } from "lucide-react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

type SearchFilterProps = {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
  readonly size?: "default" | "lg";
  readonly autoFocus?: boolean;
  readonly className?: string;
};

export function SearchFilter({
  value,
  onChange,
  placeholder = "جستجو...",
  size = "default",
  autoFocus = false,
  className
}: SearchFilterProps) {
  const handleClear = () => {
    onChange("");
  };

  return (
    <div className={cn("relative", className)}>
      <SearchIcon
        className={cn(
          "text-muted-foreground pointer-events-none absolute start-3 top-1/2 -translate-y-1/2",
          size === "lg" ? "size-5" : "size-4"
        )}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={cn(
          "border-input bg-background placeholder:text-muted-foreground focus:ring-ring w-full rounded-lg border transition-all focus:ring-2 focus:ring-offset-2 focus:outline-none",
          size === "lg" ? "h-12 ps-11 pe-10 text-base" : "h-10 ps-9 pe-8 text-sm"
        )}
      />
      {value && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={handleClear}
          className={cn(
            "text-muted-foreground hover:text-foreground absolute end-2 top-1/2 -translate-y-1/2 rounded-md p-1 transition-colors",
            size === "lg" ? "end-2.5" : "end-1.5"
          )}
          aria-label="پاک کردن جستجو"
        >
          <XIcon className="size-4" />
        </motion.button>
      )}
    </div>
  );
}

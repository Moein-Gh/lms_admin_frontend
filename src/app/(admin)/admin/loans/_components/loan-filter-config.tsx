"use client";

import { TagsIcon } from "lucide-react";

import { EntityFilterConfig, FilterState } from "@/components/filters";
import { LoanStatus, LoanStatusLabels } from "@/types/entities/loan.type";

// Loan filter state type
export type LoanFilters = FilterState & {
  search?: string;
  sortBy?: string;
  status?: string;
  loanTypeId?: string;
  userId?: string[];
  // Date range ISO strings for API
  minCreatedAt?: string;
  maxCreatedAt?: string;
  minUpdatedAt?: string;
  maxUpdatedAt?: string;
  // Date range objects for UI (not sent to API)
  createdAt?: [Date, Date];
  updatedAt?: [Date, Date];
};

// Default filter values
export const defaultLoanFilters: LoanFilters = {
  sortBy: "createdAt_desc"
};

// Loan filter configuration
export const loanFilterConfig: EntityFilterConfig<LoanFilters> = {
  title: "فیلتر وام‌ها",
  description: "وام‌ها را بر اساس معیارهای مختلف فیلتر کنید",

  // Search configuration
  search: {
    placeholder: "جستجوی نام، کد یا توضیحات...",
    key: "search"
  },

  // Sort options (always shown first in the menu)
  sort: {
    key: "sortBy",
    defaultValue: "createdAt_desc",
    options: [
      { value: "createdAt_desc", label: "جدیدترین" },
      { value: "createdAt_asc", label: "قدیمی‌ترین" },
      { value: "amount_desc", label: "بیشترین مبلغ" },
      { value: "amount_asc", label: "کمترین مبلغ" },
      { value: "code_asc", label: "کد (صعودی)" },
      { value: "code_desc", label: "کد (نزولی)" },
      { value: "startDate_desc", label: "تاریخ شروع (جدیدترین)" },
      { value: "startDate_asc", label: "تاریخ شروع (قدیمی‌ترین)" }
    ]
  },

  // Default filter values
  defaultFilters: defaultLoanFilters,

  // Filter fields
  filters: [
    {
      type: "radio",
      key: "status",
      label: "وضعیت",
      icon: <TagsIcon className="size-5" />,
      showAll: true,
      allLabel: "همه وام‌ها",
      options: [
        { value: LoanStatus.PENDING, label: LoanStatusLabels[LoanStatus.PENDING] },
        { value: LoanStatus.ACTIVE, label: LoanStatusLabels[LoanStatus.ACTIVE] },
        { value: LoanStatus.PAID, label: LoanStatusLabels[LoanStatus.PAID] }
      ]
    },

    // User filter (populate options dynamically)
    {
      type: "multi-select",
      key: "userId",
      label: "کاربر",
      searchable: true,
      searchPlaceholder: "جستجوی کاربر...",
      asPills: true,
      options: []
    },

    // Created at date range
    {
      type: "date-range",
      key: "createdAt",
      label: "تاریخ ایجاد",
      presets: [
        { label: "هفت روز گذشته", range: [new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), new Date()] },
        { label: "۳۰ روز گذشته", range: [new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), new Date()] },
        { label: "۹۰ روز گذشته", range: [new Date(Date.now() - 1000 * 60 * 60 * 24 * 90), new Date()] }
      ]
    },

    // Updated at date range
    {
      type: "date-range",
      key: "updatedAt",
      label: "تاریخ به‌روزرسانی",
      presets: [
        { label: "هفت روز گذشته", range: [new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), new Date()] },
        { label: "۳۰ روز گذشته", range: [new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), new Date()] },
        { label: "۹۰ روز گذشته", range: [new Date(Date.now() - 1000 * 60 * 60 * 24 * 90), new Date()] }
      ]
    }
    // Note: loanTypeId and userId filters would require dynamic data
    // You can add them as multi-select filters later if needed
  ]
};

// Helper to parse sort value into orderBy and orderDir
export function parseSortValue(sortBy: string | undefined): { orderBy?: string; orderDir?: "asc" | "desc" } {
  if (!sortBy) return {};

  const parts = sortBy.split("_");
  if (parts.length !== 2) return {};

  const [field, direction] = parts;
  return {
    orderBy: field,
    orderDir: direction as "asc" | "desc"
  };
}

// Helper to create sort value from orderBy and orderDir
export function createSortValue(orderBy?: string, orderDir?: string): string | undefined {
  if (!orderBy) return undefined;
  return `${orderBy}_${orderDir ?? "desc"}`;
}

// Helper to convert date range to ISO strings for API
export function dateRangeToISO(dates?: [Date, Date]): { min?: string; max?: string } {
  if (!dates || dates.length !== 2) return {};
  return {
    min: dates[0].toISOString(),
    max: dates[1].toISOString()
  };
}

// Helper to convert ISO strings to date range for UI
export function isoToDateRange(min?: string, max?: string): [Date, Date] | undefined {
  if (!min || !max) return undefined;
  return [new Date(min), new Date(max)];
}

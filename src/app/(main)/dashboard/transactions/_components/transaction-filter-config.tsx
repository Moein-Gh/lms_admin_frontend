"use client";

import { TagsIcon, Filter } from "lucide-react";

import type { EntityFilterConfig, FilterState } from "@/components/filters";
import {
  TRANSACTION_KIND_META,
  TRANSACTION_STATUS_BADGE,
  TransactionKind,
  TransactionStatus
} from "@/types/entities/transaction.type";

// Transaction filter state type
export type TransactionFilters = FilterState & {
  search?: string;
  sortBy?: string;
  status?: string;
  kind?: string;
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
export const defaultTransactionFilters: TransactionFilters = {
  sortBy: "createdAt_desc"
};

// Transaction filter configuration
export const transactionFilterConfig: EntityFilterConfig<TransactionFilters> = {
  title: "فیلتر تراکنش‌ها",
  description: "تراکنش‌ها را بر اساس معیارهای مختلف فیلتر کنید",

  // Search configuration
  search: {
    placeholder: "جستجو با کد، شماره کارت، نام کاربر...",
    key: "search"
  },

  // Sort options
  sort: {
    key: "sortBy",
    defaultValue: "createdAt_desc",
    options: [
      { value: "createdAt_desc", label: "جدیدترین" },
      { value: "createdAt_asc", label: "قدیمی‌ترین" },
      { value: "code_asc", label: "کد تراکنش (صعودی)" },
      { value: "code_desc", label: "کد تراکنش (نزولی)" },
      { value: "amount_desc", label: "بیشترین مبلغ" },
      { value: "amount_asc", label: "کمترین مبلغ" }
    ]
  },

  // Default filter values
  defaultFilters: defaultTransactionFilters,

  // Filter fields
  filters: [
    {
      type: "radio",
      key: "status",
      label: "وضعیت",
      icon: <TagsIcon className="size-5" />,
      showAll: true,
      allLabel: "همه وضعیت‌ها",
      options: [
        {
          value: TransactionStatus.PENDING,
          label: TRANSACTION_STATUS_BADGE[TransactionStatus.PENDING].label
        },
        {
          value: TransactionStatus.APPROVED,
          label: TRANSACTION_STATUS_BADGE[TransactionStatus.APPROVED].label
        },
        {
          value: TransactionStatus.REJECTED,
          label: TRANSACTION_STATUS_BADGE[TransactionStatus.REJECTED].label
        },
        {
          value: TransactionStatus.ALLOCATED,
          label: TRANSACTION_STATUS_BADGE[TransactionStatus.ALLOCATED].label
        }
      ]
    },
    {
      type: "radio",
      key: "kind",
      label: "نوع تراکنش",
      icon: <Filter className="size-5" />,
      showAll: true,
      allLabel: "همه انواع",
      options: [
        {
          value: TransactionKind.DEPOSIT,
          label: TRANSACTION_KIND_META[TransactionKind.DEPOSIT].label
        },
        {
          value: TransactionKind.WITHDRAWAL,
          label: TRANSACTION_KIND_META[TransactionKind.WITHDRAWAL].label
        },
        {
          value: TransactionKind.LOAN_DISBURSEMENT,
          label: TRANSACTION_KIND_META[TransactionKind.LOAN_DISBURSEMENT].label
        },
        {
          value: TransactionKind.TRANSFER,
          label: TRANSACTION_KIND_META[TransactionKind.TRANSFER].label
        }
      ]
    },

    // Created at date range
    {
      type: "date-range",
      key: "createdAt",
      label: "تاریخ ایجاد",
      presets: [
        { label: "امروز", range: [new Date(new Date().setHours(0, 0, 0, 0)), new Date()] },
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
        { label: "امروز", range: [new Date(new Date().setHours(0, 0, 0, 0)), new Date()] },
        { label: "هفت روز گذشته", range: [new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), new Date()] },
        { label: "۳۰ روز گذشته", range: [new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), new Date()] },
        { label: "۹۰ روز گذشته", range: [new Date(Date.now() - 1000 * 60 * 60 * 24 * 90), new Date()] }
      ]
    }
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
  if (!dates) return {};
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

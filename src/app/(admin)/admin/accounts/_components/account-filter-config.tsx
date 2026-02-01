"use client";

import { TagsIcon } from "lucide-react";

import { EntityFilterConfig, FilterState } from "@/components/filters";
import { BANK_NAMES } from "@/lib/bank-names";
import { AccountStatus, AccountStatusLabels } from "@/types/entities/account.type";

// Account filter state type
// Note: accountTypeId, userId, and bankName are arrays for multi-select UI,
// but the API currently only supports filtering by a single value.
// The first selected value is sent to the API.
export type AccountFilters = FilterState & {
  search?: string;
  sortBy?: string;
  status?: string;
  accountTypeId?: string[];
  userId?: string[];
  bankName?: string[];
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
export const defaultAccountFilters: AccountFilters = {
  sortBy: "createdAt_desc"
};

// Account filter configuration
export const accountFilterConfig: EntityFilterConfig<AccountFilters> = {
  title: "فیلتر حساب‌ها",
  description: "حساب‌ها را بر اساس معیارهای مختلف فیلتر کنید",

  // Search configuration
  search: {
    placeholder: "جستجوی نام، شماره حساب یا توضیحات...",
    key: "search"
  },

  // Sort options (always shown first in the menu)
  sort: {
    key: "sortBy",
    defaultValue: "createdAt_desc",
    options: [
      { value: "createdAt_desc", label: "جدیدترین" },
      { value: "createdAt_asc", label: "قدیمی‌ترین" },
      { value: "accountNumber_asc", label: "شماره حساب (صعودی)" },
      { value: "accountNumber_desc", label: "شماره حساب (نزولی)" }
    ]
  },

  // Default filter values
  defaultFilters: defaultAccountFilters,

  // Filter fields
  filters: [
    {
      type: "radio",
      key: "status",
      label: "وضعیت",
      icon: <TagsIcon className="size-5" />,
      showAll: true,
      allLabel: "همه حساب‌ها",
      options: [
        { value: AccountStatus.ACTIVE, label: AccountStatusLabels[AccountStatus.ACTIVE].label },
        { value: AccountStatus.INACTIVE, label: AccountStatusLabels[AccountStatus.INACTIVE].label },
        { value: AccountStatus.BUSY, label: AccountStatusLabels[AccountStatus.BUSY].label }
      ]
    },

    // Account type (dynamic in UI; options can be populated from server)
    {
      type: "multi-select",
      key: "accountTypeId",
      label: "نوع حساب",
      searchable: true,
      searchPlaceholder: "جستجوی نوع حساب...",
      asPills: true,
      options: []
    },

    // Bank name (common banks shown as pills)
    {
      type: "multi-select",
      key: "bankName",
      label: "بانک",
      asPills: true,
      options: BANK_NAMES.map((name) => ({ value: name, label: name }))
    },

    // User - combobox/multi-select (populate options dynamically)
    {
      type: "multi-select",
      key: "userId",
      label: "کاربر",
      searchable: true,
      searchPlaceholder: "جستجوی کاربر...",
      asPills: true,
      options: []
    },

    // Numeric range for account code
    {
      type: "range",
      key: "code",
      label: "کد حساب",
      min: 0,
      max: 9999999,
      step: 1
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

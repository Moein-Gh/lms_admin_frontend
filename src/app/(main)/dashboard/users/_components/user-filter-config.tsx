"use client";

import { TagsIcon } from "lucide-react";

import { EntityFilterConfig, FilterState } from "@/components/filters";
import { UserStatus, UserStatusLabels } from "@/types/entities/user.type";

// User filter state type
export type UserFilters = FilterState & {
  search?: string;
  sortBy?: string;
  status?: string;
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
export const defaultUserFilters: UserFilters = {
  sortBy: "createdAt_desc"
};

// User filter configuration
export const userFilterConfig: EntityFilterConfig<UserFilters> = {
  title: "فیلتر کاربران",
  description: "کاربران را بر اساس معیارهای مختلف فیلتر کنید",

  // Search configuration
  search: {
    placeholder: "جستجوی نام، ایمیل یا شماره تلفن...",
    key: "search"
  },

  // Sort options (always shown first in the menu)
  sort: {
    key: "sortBy",
    defaultValue: "createdAt_desc",
    options: [
      { value: "createdAt_desc", label: "جدیدترین" },
      { value: "createdAt_asc", label: "قدیمی‌ترین" },
      { value: "name_asc", label: "نام (الف تا ی)" },
      { value: "name_desc", label: "نام (ی تا الف)" },
      { value: "code_asc", label: "کد (صعودی)" },
      { value: "code_desc", label: "کد (نزولی)" }
    ]
  },

  // Default filter values
  defaultFilters: defaultUserFilters,

  // Filter fields
  filters: [
    {
      type: "radio",
      key: "status",
      label: "وضعیت",
      icon: <TagsIcon className="size-5" />,
      showAll: true,
      allLabel: "همه کاربران",
      options: [
        { value: UserStatus.ACTIVE, label: UserStatusLabels[UserStatus.ACTIVE].label },
        { value: UserStatus.INACTIVE, label: UserStatusLabels[UserStatus.INACTIVE].label }
      ]
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

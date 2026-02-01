import { EntityFilterConfig } from "@/components/filters";
import { OrderDirection } from "@/types/api";
import { LoanRequestStatusLabels } from "@/types/entities/loan-request.type";

export type LoanRequestFilters = {
  search?: string;
  sortBy?: string;
  status?: string;
  accountId?: string;
  userId?: string | string[];
  loanTypeId?: string;
  createdAt?: [Date, Date] | undefined;
  updatedAt?: [Date, Date] | undefined;
  minCreatedAt?: string;
  maxCreatedAt?: string;
  minUpdatedAt?: string;
  maxUpdatedAt?: string;
};

export const defaultLoanRequestFilters: LoanRequestFilters = {
  search: undefined,
  sortBy: "createdAt-DESC",
  status: undefined,
  accountId: undefined,
  userId: undefined,
  loanTypeId: undefined,
  createdAt: undefined,
  updatedAt: undefined
};

export const loanRequestFilterConfig: EntityFilterConfig<LoanRequestFilters> = {
  title: "فیلترهای درخواست‌های وام",
  search: {
    key: "search",
    placeholder: "جستجوی درخواست‌ها..."
  },
  sort: {
    key: "sortBy",
    options: [
      { value: "createdAt-DESC", label: "جدیدترین" },
      { value: "createdAt-ASC", label: "قدیمی‌ترین" },
      { value: "amount-DESC", label: "مبلغ (زیاد به کم)" },
      { value: "amount-ASC", label: "مبلغ (کم به زیاد)" },
      { value: "code-DESC", label: "کد (نزولی)" },
      { value: "code-ASC", label: "کد (صعودی)" }
    ]
  },
  defaultFilters: defaultLoanRequestFilters,
  filters: [
    {
      key: "status",
      label: "وضعیت",
      type: "multi-select",
      options: Object.entries(LoanRequestStatusLabels).map(([value, label]) => ({ value, label }))
    },
    {
      key: "userId",
      label: "کاربر",
      type: "multi-select",
      options: [] // Populated dynamically
    },
    {
      key: "createdAt",
      label: "تاریخ ایجاد",
      type: "date-range"
    },
    {
      key: "updatedAt",
      label: "تاریخ بروزرسانی",
      type: "date-range"
    }
  ]
};

export function parseSortValue(sortValue?: string): { orderBy?: string; orderDir?: OrderDirection } {
  if (!sortValue) return {};
  const [orderBy, orderDir] = sortValue.split("-");
  return { orderBy, orderDir: orderDir as OrderDirection };
}

export function createSortValue(orderBy?: string, orderDir?: OrderDirection): string | undefined {
  if (!orderBy || !orderDir) return undefined;
  return `${orderBy}-${orderDir}`;
}

export function dateRangeToISO(range: [Date, Date] | undefined): { min?: string; max?: string } {
  if (!range) return {};
  return {
    min: range[0].toISOString(),
    max: range[1].toISOString()
  };
}

export function isoToDateRange(min?: string, max?: string): [Date, Date] | undefined {
  if (!min || !max) return undefined;
  return [new Date(min), new Date(max)];
}

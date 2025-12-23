"use client";

import {
  AdvancedFilter,
  BaseFilters,
  QuickFilter,
  FilterTab,
  ActiveFilter
} from "@/components/filters/advanced-filter";
import { ComboboxFilter } from "@/components/filters/combobox-filter";
import { RadioFilter } from "@/components/filters/radio-filter";
import { useUsers } from "@/hooks/use-user";
import { TransactionKind, TransactionStatus } from "@/types/entities/transaction.type";

// Define your filter interface
export interface TransactionFilters extends BaseFilters {
  kind?: TransactionKind;
  userId?: string;
  status?: TransactionStatus;
}

interface TransactionFiltersProps {
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
  onReset: () => void;
}

export function TransactionFilters({ filters, onFiltersChange, onReset }: TransactionFiltersProps) {
  const { data: usersData } = useUsers({ pageSize: 100 });

  // Quick filter presets
  const quickFilters: QuickFilter<TransactionFilters>[] = [
    {
      label: "واریزهای تأیید شده",
      filters: { kind: TransactionKind.DEPOSIT, status: TransactionStatus.APPROVED }
    },
    {
      label: "برداشت‌های در انتظار",
      filters: { kind: TransactionKind.WITHDRAWAL, status: TransactionStatus.PENDING }
    },
    {
      label: "وام‌های پرداخت شده",
      filters: { kind: TransactionKind.LOAN_DISBURSEMENT, status: TransactionStatus.APPROVED }
    },
    {
      label: "رد شده",
      filters: { status: TransactionStatus.REJECTED }
    }
  ];

  // Define tabs
  const tabs: FilterTab[] = [
    {
      id: "type",
      label: "نوع",
      content: <TypeFilter />
    },
    {
      id: "status",
      label: "وضعیت",
      content: <StatusFilter />
    },
    {
      id: "user",
      label: "کاربر",
      content: <UserFilter users={usersData?.data ?? []} />
    }
  ];

  // Define how to display active filters
  const getActiveFilters = (currentFilters: TransactionFilters): ActiveFilter[] => {
    const active: ActiveFilter[] = [];

    if (currentFilters.search) {
      active.push({ key: "search", label: `جستجو: ${currentFilters.search}` });
    }
    if (currentFilters.kind) {
      active.push({ key: "kind", label: getKindLabel(currentFilters.kind) });
    }
    if (currentFilters.status) {
      active.push({ key: "status", label: getStatusLabel(currentFilters.status) });
    }
    if (currentFilters.userId) {
      const user = usersData?.data.find((u) => u.id === currentFilters.userId);
      active.push({ key: "userId", label: `کاربر: ${user?.identity.name ?? "انتخاب شده"}` });
    }

    return active;
  };

  return (
    <AdvancedFilter
      filters={filters}
      onFiltersChange={onFiltersChange}
      onReset={onReset}
      quickFilters={quickFilters}
      tabs={tabs}
      getActiveFilters={getActiveFilters}
      searchPlaceholder="جستجو با کد، شماره کارت، نام کاربر..."
      title="جستجو و فیلتر پیشرفته"
      description="جستجو کنید یا از فیلترها استفاده کنید"
    />
  );
}

// Tab content components
interface FilterContentProps {
  filters?: TransactionFilters;
  onChange?: (filters: TransactionFilters) => void;
}

function TypeFilter({ filters, onChange }: FilterContentProps) {
  if (!filters || !onChange) return null;

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">انتخاب نوع تراکنش</h3>
      <RadioFilter
        value={filters.kind}
        onChange={(kind) => onChange({ ...filters, kind: kind as TransactionKind | undefined })}
        options={TRANSACTION_KINDS}
        allLabel="همه انواع"
      />
    </div>
  );
}

function StatusFilter({ filters, onChange }: FilterContentProps) {
  if (!filters || !onChange) return null;

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">وضعیت تراکنش</h3>
      <RadioFilter
        value={filters.status}
        onChange={(status) => onChange({ ...filters, status: status as TransactionStatus | undefined })}
        options={TRANSACTION_STATUSES}
        allLabel="همه وضعیت‌ها"
      />
    </div>
  );
}

interface UserFilterProps extends FilterContentProps {
  users: Array<{ id: string; identity: Partial<{ name: string | null }> }>;
}

function UserFilter({ filters, onChange, users }: UserFilterProps) {
  if (!filters || !onChange) return null;

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">انتخاب کاربر</h3>
      <ComboboxFilter
        items={users}
        selectedValue={filters.userId}
        onSelect={(userId) => onChange({ ...filters, userId })}
        getItemId={(user) => user.id}
        getItemLabel={(user) => user.identity.name ?? `کاربر ${user.id.slice(0, 8)}`}
        placeholder="انتخاب کاربر..."
        searchPlaceholder="جستجوی کاربر..."
        emptyMessage="کاربری یافت نشد"
        allLabel="همه کاربران"
      />
    </div>
  );
}

// Helper data and functions
const TRANSACTION_KINDS: { value: TransactionKind; label: string }[] = [
  { value: TransactionKind.DEPOSIT, label: "واریز" },
  { value: TransactionKind.WITHDRAWAL, label: "برداشت" },
  { value: TransactionKind.LOAN_DISBURSEMENT, label: "پرداخت وام" },
  { value: TransactionKind.TRANSFER, label: "انتقال وجه" }
];

const TRANSACTION_STATUSES = [
  { value: TransactionStatus.PENDING, label: "در انتظار" },
  { value: TransactionStatus.APPROVED, label: "تأیید شده" },
  { value: TransactionStatus.REJECTED, label: "رد شده" },
  { value: TransactionStatus.ALLOCATED, label: "تخصیص داده شده" }
];

function getKindLabel(kind: TransactionKind): string {
  return TRANSACTION_KINDS.find((k) => k.value === kind)?.label ?? kind;
}

function getStatusLabel(status: TransactionStatus): string {
  return TRANSACTION_STATUSES.find((s) => s.value === status)?.label ?? status;
}

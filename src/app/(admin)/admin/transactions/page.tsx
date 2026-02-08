"use client";
import * as React from "react";
import { useSearchParams } from "next/navigation";

import { EntityFilter } from "@/components/filters";
import { PaginationControls } from "@/components/pagination-controls";
import { useTransactions } from "@/hooks/admin/use-transaction";
import { useUsers } from "@/hooks/admin/use-user";
import { usePagination } from "@/hooks/general/use-pagination";
import { TransactionKind, TransactionStatus } from "@/types/entities/transaction.type";
import {
  dateRangeToISO,
  isoToDateRange,
  transactionFilterConfig,
  type TransactionFilters
} from "./_components/transaction-filter-config";
import { TransactionsTable } from "./_components/transaction-table";
import { TransactionsCardList } from "./_components/transactions-card-list";
import { TransactionsHeader } from "./_components/transactions-header";

export default function TransactionsPage() {
  const searchParams = useSearchParams();
  const pagination = usePagination({ initialPage: 1, initialPageSize: 10 });

  // Parse filters from URL
  const search = searchParams.get("search") ?? undefined;
  const status = (searchParams.get("status") as TransactionStatus | null) ?? undefined;
  const kind = (searchParams.get("kind") as TransactionKind | null) ?? undefined;
  const userIdParam = searchParams.get("userId")?.split(",").filter(Boolean) ?? undefined;
  const sortBy = searchParams.get("sortBy") ?? transactionFilterConfig.defaultFilters.sortBy;

  // Parse date range filters
  const minCreatedAt = searchParams.get("minCreatedAt") ?? undefined;
  const maxCreatedAt = searchParams.get("maxCreatedAt") ?? undefined;
  const minUpdatedAt = searchParams.get("minUpdatedAt") ?? undefined;
  const maxUpdatedAt = searchParams.get("maxUpdatedAt") ?? undefined;

  const { data, isLoading, error } = useTransactions({
    page: pagination.page,
    pageSize: pagination.pageSize,
    search,
    status,
    kind,
    userId: userIdParam?.[0],
    minCreatedAt,
    maxCreatedAt,
    minUpdatedAt,
    maxUpdatedAt
  });

  // Load users for user filter options
  const { data: usersData } = useUsers({ page: 1, pageSize: 100 });

  // Inject dynamic options into the filter config
  const mergedConfig = React.useMemo(() => {
    const cfg = { ...transactionFilterConfig };
    cfg.filters = cfg.filters.map((f) => {
      if (f.key === "userId") {
        return {
          ...f,
          options: (usersData?.data ?? []).map((u) => ({ value: u.id, label: u.identity.name ?? String(u.code) }))
        };
      }

      return f;
    });

    return cfg;
  }, [usersData]);

  const handleFiltersChange = (newFilters: TransactionFilters) => {
    const params = new URLSearchParams();
    if (newFilters.search) params.set("search", newFilters.search);
    if (newFilters.status) params.set("status", newFilters.status);
    if (newFilters.kind) params.set("kind", newFilters.kind);
    if (newFilters.userId && Array.isArray(newFilters.userId) && newFilters.userId.length > 0)
      params.set("userId", newFilters.userId.join(","));
    if (newFilters.sortBy) params.set("sortBy", newFilters.sortBy);

    // Date range filters - convert from Date tuples to ISO strings
    const createdRange = dateRangeToISO(newFilters.createdAt);
    if (createdRange.min) params.set("minCreatedAt", createdRange.min);
    if (createdRange.max) params.set("maxCreatedAt", createdRange.max);

    const updatedRange = dateRangeToISO(newFilters.updatedAt);
    if (updatedRange.min) params.set("minUpdatedAt", updatedRange.min);
    if (updatedRange.max) params.set("maxUpdatedAt", updatedRange.max);

    window.history.replaceState({}, "", `?${params.toString()}`);
    pagination.goToFirstPage();
  };

  const handleReset = () => {
    window.history.replaceState({}, "", window.location.pathname);
    pagination.goToFirstPage();
  };

  const currentFilters: TransactionFilters = {
    search,
    status,
    kind,
    userId: userIdParam,
    sortBy,
    // Store ISO strings for API
    minCreatedAt,
    maxCreatedAt,
    minUpdatedAt,
    maxUpdatedAt,
    // Convert ISO strings to Date tuples for UI
    createdAt: isoToDateRange(minCreatedAt, maxCreatedAt),
    updatedAt: isoToDateRange(minUpdatedAt, maxUpdatedAt)
  };

  const filterTrigger = (
    <EntityFilter
      config={mergedConfig}
      filters={currentFilters}
      onFiltersChange={handleFiltersChange}
      onReset={handleReset}
    />
  );

  return (
    <div className="space-y-6 w-full min-w-0">
      <TransactionsHeader filterTrigger={filterTrigger} total={data?.meta.totalItems} />

      {/* Desktop: Table view */}
      <div className="hidden sm:block">
        <TransactionsTable
          data={data ?? null}
          isLoading={isLoading}
          error={error}
          filterConfig={mergedConfig}
          filters={currentFilters}
          onFiltersChange={handleFiltersChange}
          onReset={handleReset}
        />
      </div>

      {/* Mobile: Card view */}
      <div className="block sm:hidden">
        <TransactionsCardList data={data ?? null} isLoading={isLoading} error={error} />
      </div>

      {/* Pagination */}
      {data && (
        <div className="border-t p-4">
          <PaginationControls
            meta={data.meta}
            page={pagination.page}
            pageSize={pagination.pageSize}
            onPageChange={pagination.setPage}
            onPageSizeChange={pagination.setPageSize}
          />
        </div>
      )}
    </div>
  );
}

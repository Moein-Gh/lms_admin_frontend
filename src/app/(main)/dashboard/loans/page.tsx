"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { EntityFilterTrigger } from "@/components/filters";
import { PaginationControls } from "@/components/pagination-controls";
import { useLoans } from "@/hooks/use-loan";
import { usePagination } from "@/hooks/use-pagination";
import { OrderDirection } from "@/types/api";
import { LoanStatus } from "@/types/entities/loan.type";

import {
  createSortValue,
  dateRangeToISO,
  defaultLoanFilters,
  isoToDateRange,
  loanFilterConfig,
  parseSortValue,
  type LoanFilters
} from "./_components/loan-filter-config";
import { LoansTable } from "./_components/loan-table";
import { LoansCardList } from "./_components/loans-card-list";
import { LoansHeader } from "./_components/loans-header";

export default function LoansPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageParam = Number(searchParams.get("page") ?? 1);
  const pageSizeParam = Number(searchParams.get("per_page") ?? 10);
  const search = searchParams.get("search") ?? undefined;
  const statusParam = searchParams.get("status");
  const loanTypeIdParam = searchParams.get("loanTypeId") ?? undefined;
  const userIdParam = searchParams.get("userId") ?? undefined;

  // Parse date range filters
  const minCreatedAt = searchParams.get("minCreatedAt") ?? undefined;
  const maxCreatedAt = searchParams.get("maxCreatedAt") ?? undefined;
  const minUpdatedAt = searchParams.get("minUpdatedAt") ?? undefined;
  const maxUpdatedAt = searchParams.get("maxUpdatedAt") ?? undefined;

  const orderBy = searchParams.get("orderBy") ?? undefined;
  const orderDir = searchParams.get("orderDir") as OrderDirection | undefined;

  const pagination = usePagination({ initialPage: pageParam, initialPageSize: pageSizeParam });

  const { data, isLoading, error } = useLoans({
    page: pagination.page,
    pageSize: pagination.pageSize,
    search,
    loanTypeId: loanTypeIdParam,
    status: statusParam ? (statusParam as LoanStatus) : undefined,
    orderBy,
    orderDir,
    minCreatedAt,
    maxCreatedAt,
    minUpdatedAt,
    maxUpdatedAt
  });

  // Convert URL params to filter state
  const filters: LoanFilters = React.useMemo(
    () => ({
      search: search ?? undefined,
      sortBy: createSortValue(orderBy, orderDir) ?? defaultLoanFilters.sortBy,
      status: statusParam ?? undefined,
      loanTypeId: loanTypeIdParam,
      userId: userIdParam,
      // Store ISO strings for API
      minCreatedAt,
      maxCreatedAt,
      minUpdatedAt,
      maxUpdatedAt,
      // Convert ISO strings to Date tuples for UI
      createdAt: isoToDateRange(minCreatedAt, maxCreatedAt),
      updatedAt: isoToDateRange(minUpdatedAt, maxUpdatedAt)
    }),
    [
      search,
      orderBy,
      orderDir,
      statusParam,
      loanTypeIdParam,
      userIdParam,
      minCreatedAt,
      maxCreatedAt,
      minUpdatedAt,
      maxUpdatedAt
    ]
  );

  // Handle filter changes - sync to URL
  const handleFiltersChange = React.useCallback(
    (newFilters: LoanFilters) => {
      const params = new URLSearchParams();

      // Search
      if (newFilters.search) {
        params.set("search", newFilters.search);
      }

      // Status
      if (newFilters.status) {
        params.set("status", newFilters.status);
      }

      // Loan Type ID
      if (newFilters.loanTypeId) {
        params.set("loanTypeId", newFilters.loanTypeId);
      }

      // User ID
      if (newFilters.userId) {
        params.set("userId", newFilters.userId);
      }

      // Date range filters - convert from Date tuples to ISO strings
      const createdRange = dateRangeToISO(newFilters.createdAt);
      if (createdRange.min) params.set("minCreatedAt", createdRange.min);
      if (createdRange.max) params.set("maxCreatedAt", createdRange.max);

      const updatedRange = dateRangeToISO(newFilters.updatedAt);
      if (updatedRange.min) params.set("minUpdatedAt", updatedRange.min);
      if (updatedRange.max) params.set("maxUpdatedAt", updatedRange.max);

      // Sort
      if (newFilters.sortBy && newFilters.sortBy !== defaultLoanFilters.sortBy) {
        const { orderBy: newOrderBy, orderDir: newOrderDir } = parseSortValue(newFilters.sortBy);
        if (newOrderBy) params.set("orderBy", newOrderBy);
        if (newOrderDir) params.set("orderDir", newOrderDir);
      }

      // Reset to page 1 when filters change
      params.set("page", "1");
      params.set("per_page", String(pagination.pageSize));

      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, pagination.pageSize]
  );

  // Handle filter reset
  const handleReset = React.useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  return (
    <div className="space-y-6 w-full min-w-0">
      <LoansHeader
        total={data?.meta.totalItems}
        filterTrigger={
          <EntityFilterTrigger
            config={loanFilterConfig}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onReset={handleReset}
          />
        }
      />

      {/* Desktop: Table view */}
      <div className="hidden sm:block">
        <LoansTable
          data={data ?? null}
          isLoading={isLoading}
          error={error}
          filterConfig={loanFilterConfig}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={handleReset}
        />
      </div>

      {/* Mobile: Card view */}
      <div className="block sm:hidden">
        <LoansCardList data={data ?? null} isLoading={isLoading} error={error} />
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

"use client";
import { useState } from "react";

import { PaginationControls } from "@/components/pagination-controls";
import { useLoans } from "@/hooks/use-loan";
import { usePagination } from "@/hooks/use-pagination";

import { ActiveFilters } from "./_components/active-filters";
import { LoanFilters } from "./_components/loan-filters-dialog";
import { LoansTable } from "./_components/loan-table";
import { LoansCardList } from "./_components/loans-card-list";
import { LoansHeader } from "./_components/loans-header";

export default function LoansPage() {
  const pagination = usePagination({ initialPage: 1, initialPageSize: 10 });
  const [filters, setFilters] = useState<LoanFilters>({
    search: "",
    loanTypeId: undefined,
    userId: undefined,
    status: undefined
  });

  const { data, isLoading, error } = useLoans({
    page: pagination.page,
    pageSize: pagination.pageSize,
    search: filters.search,
    loanTypeId: filters.loanTypeId,
    status: filters.status
  });

  const handleFiltersChange = (newFilters: LoanFilters) => {
    setFilters(newFilters);
    pagination.goToFirstPage();
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      loanTypeId: undefined,
      userId: undefined,
      status: undefined
    });
    pagination.goToFirstPage();
  };

  return (
    <div className="space-y-6 w-full min-w-0">
      <LoansHeader filters={filters} onFiltersChange={handleFiltersChange} onReset={handleResetFilters} />

      <ActiveFilters filters={filters} onReset={handleResetFilters} />

      {/* Desktop: Table view */}
      <div className="hidden sm:block">
        <LoansTable
          data={data ? { data: data.data } : undefined}
          isLoading={isLoading}
          error={error}
          pagination={{ page: pagination.page, pageSize: pagination.pageSize }}
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

"use client";
import { useState } from "react";

import { PaginationControls } from "@/components/pagination-controls";
import { usePagination } from "@/hooks/use-pagination";
import { useTransactions } from "@/hooks/use-transaction";
import { ActiveFilters } from "./_components/active-filters";

import { TransactionFilters } from "./_components/transaction-filters";
import { TransactionsTable } from "./_components/transaction-table";
import { TransactionsCardList } from "./_components/transactions-card-list";
import { TransactionsHeader } from "./_components/transactions-header";

export default function TransactionsPage() {
  const pagination = usePagination({ initialPage: 1, initialPageSize: 10 });
  const [filters, setFilters] = useState<TransactionFilters>({
    search: "",
    transactionTypeId: undefined,
    userId: undefined,
    status: undefined
  });

  const { data, isLoading, error } = useTransactions({
    page: pagination.page,
    pageSize: pagination.pageSize,
    search: filters.search,
    status: filters.status
  });

  const handleFiltersChange = (newFilters: TransactionFilters) => {
    setFilters(newFilters);
    pagination.goToFirstPage();
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      transactionTypeId: undefined,
      userId: undefined,
      status: undefined
    });
    pagination.goToFirstPage();
  };

  return (
    <div className="space-y-6 w-full min-w-0">
      <TransactionsHeader
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleResetFilters}
        total={data?.meta.totalItems}
      />

      <ActiveFilters filters={filters} onReset={handleResetFilters} />

      {/* Desktop: Table view */}
      <div className="hidden sm:block">
        <TransactionsTable
          data={data ? { data: data.data } : undefined}
          isLoading={isLoading}
          error={error}
          pagination={{ page: pagination.page, pageSize: pagination.pageSize }}
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

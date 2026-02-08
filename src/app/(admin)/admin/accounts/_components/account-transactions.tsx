"use client";

import { PaginationControls } from "@/components/pagination-controls";
import { useTransactions } from "@/hooks/admin/use-transaction";
import { usePagination } from "@/hooks/general/use-pagination";

import { transactionFilterConfig, TransactionFilters } from "../../transactions/_components/transaction-filter-config";
import { TransactionsTable } from "../../transactions/_components/transaction-table";
import { TransactionsCardList } from "../../transactions/_components/transactions-card-list";

type Props = {
  accountId: string;
};

const AccountTransactions = ({ accountId }: Props) => {
  const pagination = usePagination({ initialPage: 1, initialPageSize: 10 });

  const { data, isLoading, error } = useTransactions({
    page: pagination.page,
    pageSize: pagination.pageSize,
    accountId
  });

  // Empty filter handlers since account transactions don't need filters
  const handleFiltersChange = () => {};
  const handleReset = () => {};
  const currentFilters: TransactionFilters = transactionFilterConfig.defaultFilters;

  return (
    <div className="space-y-4">
      {/* Desktop: Table view */}
      <div className="hidden sm:block">
        <TransactionsTable
          data={data ?? null}
          isLoading={isLoading}
          error={error}
          filterConfig={transactionFilterConfig}
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
};

export default AccountTransactions;

"use client";

import { TransactionsTable } from "@/app/(main)/dashboard/transactions/_components/transaction-table";
import { TransactionsCardList } from "@/app/(main)/dashboard/transactions/_components/transactions-card-list";
import { PaginationControls } from "@/components/pagination-controls";
import { usePagination } from "@/hooks/use-pagination";
import { useTransactions } from "@/hooks/use-transaction";

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

  return (
    <div className="space-y-4">
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
};

export default AccountTransactions;

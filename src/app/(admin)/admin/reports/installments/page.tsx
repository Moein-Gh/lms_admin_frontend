"use client";

import { useInstallmentProjection } from "@/hooks/admin/use-report";
import { usePagination } from "@/hooks/general/use-pagination";

import { InstallmentDetailsTabs } from "./_components/installment-details-tabs";
import { InstallmentProjectionHeader } from "./_components/installment-projection-header";

export default function InstallmentProjectionPage() {
  const pagination = usePagination({ initialPage: 1, initialPageSize: 10 });

  const { data, isLoading, error } = useInstallmentProjection({ page: pagination.page, pageSize: pagination.pageSize });

  const SKELETON_CARDS = 5;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <InstallmentProjectionHeader />
        <div className="space-y-4">
          {/* Summary cards skeleton */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {Array.from({ length: SKELETON_CARDS }, (_, idx) => (
              <div key={`card-skeleton-${idx}`} className="h-35 rounded-xl border bg-card animate-pulse" />
            ))}
          </div>
          <div className="sm:hidden">
            <div className="h-35 rounded-xl border bg-card animate-pulse" />
          </div>
          {/* Table skeleton */}
          <div className="h-100 rounded-xl border bg-card animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <InstallmentProjectionHeader />
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-600">خطا در دریافت اطلاعات. لطفا دوباره تلاش کنید.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <InstallmentProjectionHeader />
      <InstallmentDetailsTabs
        data={data ?? null}
        page={pagination.page}
        pageSize={pagination.pageSize}
        onPageChange={pagination.setPage}
        onPageSizeChange={pagination.setPageSize}
      />
    </div>
  );
}

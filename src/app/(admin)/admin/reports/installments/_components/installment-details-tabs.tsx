"use client";

import { CalendarCheck, CalendarDays } from "lucide-react";

import { InstallmentMetricCard } from "@/components/financial/installment-metric-card";
import { PaginationControls } from "@/components/pagination-controls";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { PageMetaDto } from "@/types/api";
import type { InstallmentProjection } from "@/types/entities/installment-projection.type";
import { InstallmentSummaryCards } from "./installment-summary-cards";
import { InstallmentsTable } from "./installments-table";

interface InstallmentDetailsTabsProps {
  readonly data: InstallmentProjection | null;
  readonly page: number;
  readonly pageSize: number;
  readonly onPageChange: (page: number) => void;
  readonly onPageSizeChange: (pageSize: number) => void;
}

function buildMeta(totalItems: number, itemCount: number, page: number, pageSize: number): PageMetaDto {
  const totalPages = pageSize > 0 ? Math.max(1, Math.ceil(totalItems / pageSize)) : 1;
  return {
    totalItems,
    itemCount,
    page,
    pageSize,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
}

export function InstallmentDetailsTabs({
  data,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange
}: InstallmentDetailsTabsProps) {
  if (!data) {
    return null;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">جزئیات اقساط</h2>

      <Tabs defaultValue="current-month" dir="rtl" className="w-full" onValueChange={() => onPageChange(1)}>
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="current-month" className="flex-1 sm:flex-initial">
            ماه جاری
          </TabsTrigger>
          <TabsTrigger value="next-month" className="flex-1 sm:flex-initial">
            ماه آینده
          </TabsTrigger>
          <TabsTrigger value="next-3-months" className="flex-1 sm:flex-initial">
            ۳ ماه آینده
          </TabsTrigger>
        </TabsList>

        {/* Current Month Tab */}
        <TabsContent value="current-month" className="mt-4 space-y-6">
          {/* Summary Cards */}
          <InstallmentSummaryCards data={data.currentMonth} />

          {/* All Current Month Installments Table */}
          <InstallmentsTable
            installments={data.currentMonth.expected.installments}
            title="اقساط پیش‌بینی شده ماه جاری"
            pageCount={
              buildMeta(
                data.currentMonth.expected.count,
                data.currentMonth.expected.installments.length,
                page,
                pageSize
              ).totalPages
            }
          />
          <PaginationControls
            meta={buildMeta(
              data.currentMonth.expected.count,
              data.currentMonth.expected.installments.length,
              page,
              pageSize
            )}
            page={page}
            pageSize={pageSize}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </TabsContent>

        {/* Next Month Tab */}
        <TabsContent value="next-month" className="mt-4 space-y-6">
          <div className="grid gap-4 md:max-w-xs">
            <InstallmentMetricCard
              title="ماه آینده"
              count={data.nextMonth.count}
              totalAmount={data.nextMonth.totalAmount}
              icon={<CalendarCheck className="size-4" />}
            />
          </div>
          <InstallmentsTable
            installments={data.nextMonth.installments}
            title="اقساط پیش‌بینی شده ماه آینده"
            pageCount={buildMeta(data.nextMonth.count, data.nextMonth.installments.length, page, pageSize).totalPages}
          />
          <div className="mt-4">
            <PaginationControls
              meta={buildMeta(data.nextMonth.count, data.nextMonth.installments.length, page, pageSize)}
              page={page}
              pageSize={pageSize}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
            />
          </div>
        </TabsContent>

        {/* Next 3 Months Tab */}
        <TabsContent value="next-3-months" className="mt-4 space-y-6">
          <div className="grid gap-4 md:max-w-xs">
            <InstallmentMetricCard
              title="۳ ماه آینده"
              count={data.next3Months.count}
              totalAmount={data.next3Months.totalAmount}
              icon={<CalendarDays className="size-4" />}
            />
          </div>
          <InstallmentsTable
            installments={data.next3Months.installments}
            title="اقساط پیش‌بینی شده ۳ ماه آینده"
            pageCount={
              buildMeta(data.next3Months.count, data.next3Months.installments.length, page, pageSize).totalPages
            }
          />
          <div className="mt-4">
            <PaginationControls
              meta={buildMeta(data.next3Months.count, data.next3Months.installments.length, page, pageSize)}
              page={page}
              pageSize={pageSize}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
            />
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}

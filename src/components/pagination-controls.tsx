import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { PageMetaDto } from "@/types/api";

export interface PaginationControlsProps {
  meta?: PageMetaDto;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
  showPageSizeSelector?: boolean;
}

export function PaginationControls({
  meta,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  className,
  showPageSizeSelector = true
}: PaginationControlsProps) {
  if (!meta) {
    return null;
  }

  const { totalItems, itemCount, totalPages, hasNextPage, hasPrevPage } = meta;

  const startItem = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = (page - 1) * pageSize + itemCount;

  return (
    <div className={cn("flex w-full items-center justify-between gap-2", className)}>
      {/* Right Side: Page Size & Info */}
      <div className="flex items-center gap-2 sm:gap-4">
        {showPageSizeSelector && (
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-muted-foreground sm:inline">تعداد:</span>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => {
                onPageSizeChange(Number(value));
                onPageChange(1);
              }}
            >
              <SelectTrigger className="h-8 w-[65px] sm:w-[70px]">
                <SelectValue placeholder={String(pageSize)} />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="text-sm text-muted-foreground whitespace-nowrap">
          <span className="hidden sm:inline">
            نمایش {startItem} تا {endItem} از {totalItems} مورد
          </span>
          <span className="sm:hidden">{totalItems} مورد</span>
        </div>
      </div>

      {/* Left Side: Navigation */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="hidden size-8 sm:flex"
          onClick={() => onPageChange(1)}
          disabled={!hasPrevPage}
          title="صفحه اول"
        >
          <ChevronsRightIcon className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
          title="صفحه قبل"
        >
          <ChevronRightIcon className="size-4" />
        </Button>

        <span className="mx-1 min-w-12 text-center text-sm text-muted-foreground">
          <span className="hidden sm:inline">
            صفحه {page} از {totalPages}
          </span>
          <span className="sm:hidden">
            {page} / {totalPages}
          </span>
        </span>

        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          title="صفحه بعد"
        >
          <ChevronLeftIcon className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="hidden size-8 sm:flex"
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNextPage}
          title="صفحه آخر"
        >
          <ChevronsLeftIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}

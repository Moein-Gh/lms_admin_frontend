import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type EntitySummarySkeletonProps = {
  readonly className?: string;
};

export function EntitySummarySkeleton({ className }: EntitySummarySkeletonProps) {
  return (
    <div className={cn("flex items-center gap-3 rounded-lg border bg-card p-2.5", className)}>
      {/* Icon skeleton */}
      <Skeleton className="size-9 shrink-0 rounded-md" />

      {/* Content skeleton */}
      <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
        <div className="space-y-1">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="hidden items-center gap-1.5 sm:flex">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>

      {/* Arrow skeleton */}
      <Skeleton className="size-4 shrink-0" />
    </div>
  );
}

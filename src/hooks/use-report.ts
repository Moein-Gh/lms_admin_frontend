import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { FinancialSummaryParams, getFinancialSummary } from "@/lib/report-api";

// Query keys for report-related queries
export const reportKeys = {
  financialSummary: (params?: FinancialSummaryParams) => ["reports", "financial-summary", params] as const
};

/**
 * Hook to fetch financial summary
 */
export function useFinancialSummary(
  params?: FinancialSummaryParams,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof getFinancialSummary>>,
      Error,
      Awaited<ReturnType<typeof getFinancialSummary>>,
      ReturnType<typeof reportKeys.financialSummary>
    >,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: reportKeys.financialSummary(params),
    queryFn: () => getFinancialSummary(params ?? {}),
    ...options
  });
}

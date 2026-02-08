import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import {
  FinancialSummaryParams,
  getEntitiesSummary,
  getFinancialSummary,
  getInstallmentProjection,
  InstallmentProjectionParams
} from "@/lib/admin-APIs/report-api";

// Query keys for report-related queries
export const reportKeys = {
  financialSummary: (params?: FinancialSummaryParams) => ["reports", "financial-summary", params] as const,
  entitiesSummary: () => ["reports", "entities"] as const,
  installmentProjection: (params?: InstallmentProjectionParams) =>
    ["reports", "installment-projection", params] as const
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

export function useEntitiesSummary(
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof getEntitiesSummary>>,
      Error,
      Awaited<ReturnType<typeof getEntitiesSummary>>,
      ReturnType<typeof reportKeys.entitiesSummary>
    >,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: reportKeys.entitiesSummary(),
    queryFn: () => getEntitiesSummary(),
    ...options
  });
}

/**
 * Hook to fetch installment projection
 */
export function useInstallmentProjection(
  params?: InstallmentProjectionParams,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof getInstallmentProjection>>,
      Error,
      Awaited<ReturnType<typeof getInstallmentProjection>>,
      ReturnType<typeof reportKeys.installmentProjection>
    >,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: reportKeys.installmentProjection(params),
    queryFn: () => getInstallmentProjection(params ?? {}),
    ...options
  });
}

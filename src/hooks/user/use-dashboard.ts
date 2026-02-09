import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { getPaymentSummary, getUserOverview } from "@/lib/user-APIs/dashboard-api";
import type { PaymentSummaryDto } from "@/types/entities/payment.type";
import type { UserOverviewDto } from "@/types/entities/user-overview.type";

export const dashboardKeys = {
  paymentSummary: ["dashboard", "payment-summary"] as const,
  overview: ["dashboard", "overview"] as const
};

export function useUserPaymentSummary(
  options?: Omit<
    UseQueryOptions<PaymentSummaryDto, Error, PaymentSummaryDto, typeof dashboardKeys.paymentSummary>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: dashboardKeys.paymentSummary,
    queryFn: getPaymentSummary,
    staleTime: 0,
    ...options
  });
}

export function useUserOverview(
  options?: Omit<
    UseQueryOptions<UserOverviewDto, Error, UserOverviewDto, typeof dashboardKeys.overview>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: dashboardKeys.overview,
    queryFn: getUserOverview,
    staleTime: 0,
    ...options
  });
}

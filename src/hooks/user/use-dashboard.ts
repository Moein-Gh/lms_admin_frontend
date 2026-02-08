import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { getPaymentSummary } from "@/lib/user-APIs/dashboard-api";
import type { PaymentSummaryDto } from "@/types/entities/payment.type";

export const dashboardKeys = {
  paymentSummary: ["dashboard", "payment-summary"] as const
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

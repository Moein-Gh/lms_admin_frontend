import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";

import { getPaymentSummary } from "@/lib/user-APIs/dashboard-api";
import type { PaymentSummaryDto } from "@/types/entities/payment.type";

export const dashboardKeys = {
  paymentSummary: ["dashboard", "payment-summary"] as const
};

export function usePaymentSummary(
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

export function useRefreshPaymentSummary() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      // no-op mutation; use this hook to trigger a refresh from UI
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.paymentSummary as unknown as string[] });
    }
  });
}

import { useQuery } from "@tanstack/react-query";
import { listSubscriptionFees, ListSubscriptionFeesParams } from "@/lib/subscription-fee-api";

export function useSubscriptionFees(params?: ListSubscriptionFeesParams) {
  return useQuery({
    queryKey: ["subscriptionFees", params],
    queryFn: () => listSubscriptionFees(params)
  });
}

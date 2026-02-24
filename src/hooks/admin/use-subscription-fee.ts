import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createNextSubscriptionFees,
  CreateNextSubscriptionFeesRequest,
  listSubscriptionFees,
  ListSubscriptionFeesParams
} from "@/lib/admin-APIs/subscription-fee-api";

export function useSubscriptionFees(params?: ListSubscriptionFeesParams) {
  return useQuery({
    queryKey: ["subscriptionFees", params],
    queryFn: () => listSubscriptionFees(params)
  });
}

export function useCreateNextSubscriptionFees(accountId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data?: CreateNextSubscriptionFeesRequest) => createNextSubscriptionFees(accountId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["subscriptionFees"] });
    }
  });
}

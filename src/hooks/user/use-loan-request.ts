import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import { type CreateLoanRequestDto, type ListLoanRequestsParams } from "@/lib/admin-APIs/loan-request-api";
import { createUserLoanRequest, getUserLoanRequestById, listUserLoanRequests } from "@/lib/user-APIs/loan-request-api";
import { LoanRequest } from "@/types/entities/loan-request.type";

export const loanRequestKeys = {
  all: ["loan-requests"] as const,
  lists: () => [...loanRequestKeys.all, "list"] as const,
  list: (params?: ListLoanRequestsParams) => [...loanRequestKeys.lists(), params] as const,
  details: () => [...loanRequestKeys.all, "detail"] as const,
  detail: (id: string) => [...loanRequestKeys.details(), id] as const
};

export function useUserLoanRequests(
  params?: ListLoanRequestsParams,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof listUserLoanRequests>>,
      Error,
      Awaited<ReturnType<typeof listUserLoanRequests>>,
      ReturnType<typeof loanRequestKeys.list>
    >,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: loanRequestKeys.list(params),
    queryFn: () => listUserLoanRequests(params),
    ...options
  });
}

export function useUserLoanRequest(
  loanRequestId: string,
  options?: Omit<
    UseQueryOptions<LoanRequest, Error, LoanRequest, ReturnType<typeof loanRequestKeys.detail>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: loanRequestKeys.detail(loanRequestId),
    queryFn: () => getUserLoanRequestById(loanRequestId),
    enabled: !!loanRequestId,
    ...options
  });
}

export function useUserCreateLoanRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLoanRequestDto) => createUserLoanRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: loanRequestKeys.lists() });
    }
  });
}

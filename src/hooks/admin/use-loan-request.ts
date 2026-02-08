import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import {
  approveLoanRequest,
  createLoanRequest,
  deleteLoanRequest,
  getLoanRequestById,
  listLoanRequests,
  rejectLoanRequest,
  updateLoanRequest,
  type CreateLoanRequestDto,
  type ListLoanRequestsParams,
  type UpdateLoanRequestDto
} from "@/lib/admin-APIs/loan-request-api";
import { PaginatedResponseDto } from "@/types/api";
import { LoanRequest } from "@/types/entities/loan-request.type";

export const loanRequestKeys = {
  all: ["loan-requests"] as const,
  lists: () => [...loanRequestKeys.all, "list"] as const,
  list: (params?: ListLoanRequestsParams) => [...loanRequestKeys.lists(), params] as const,
  details: () => [...loanRequestKeys.all, "detail"] as const,
  detail: (id: string) => [...loanRequestKeys.details(), id] as const
};

export function useLoanRequests(
  params?: ListLoanRequestsParams,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof listLoanRequests>>,
      Error,
      Awaited<ReturnType<typeof listLoanRequests>>,
      ReturnType<typeof loanRequestKeys.list>
    >,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: loanRequestKeys.list(params),
    queryFn: () => listLoanRequests(params),
    ...options
  });
}

export function useLoanRequest(
  loanRequestId: string,
  options?: Omit<
    UseQueryOptions<LoanRequest, Error, LoanRequest, ReturnType<typeof loanRequestKeys.detail>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: loanRequestKeys.detail(loanRequestId),
    queryFn: () => getLoanRequestById(loanRequestId),
    enabled: !!loanRequestId,
    ...options
  });
}

export function useCreateLoanRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLoanRequestDto) => createLoanRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: loanRequestKeys.lists() });
    }
  });
}

export function useUpdateLoanRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ loanRequestId, data }: { loanRequestId: string; data: UpdateLoanRequestDto }) =>
      updateLoanRequest(loanRequestId, data),
    onSuccess: (updatedLoanRequest) => {
      queryClient.invalidateQueries({ queryKey: loanRequestKeys.detail(updatedLoanRequest.id) });
      queryClient.invalidateQueries({ queryKey: loanRequestKeys.lists() });
    }
  });
}

export function useApproveLoanRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (loanRequestId: string) => approveLoanRequest(loanRequestId),
    onSuccess: (approvedLoanRequest) => {
      queryClient.invalidateQueries({ queryKey: loanRequestKeys.detail(approvedLoanRequest.id) });
      queryClient.invalidateQueries({ queryKey: loanRequestKeys.lists() });
    }
  });
}

export function useRejectLoanRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (loanRequestId: string) => rejectLoanRequest(loanRequestId),
    onSuccess: (rejectedLoanRequest) => {
      queryClient.invalidateQueries({ queryKey: loanRequestKeys.detail(rejectedLoanRequest.id) });
      queryClient.invalidateQueries({ queryKey: loanRequestKeys.lists() });
    }
  });
}

export function useDeleteLoanRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (loanRequestId: string) => deleteLoanRequest(loanRequestId),
    onSuccess: (_data, loanRequestId) => {
      queryClient.removeQueries({ queryKey: loanRequestKeys.detail(loanRequestId) });
      queryClient.invalidateQueries({ queryKey: loanRequestKeys.lists() });
    }
  });
}

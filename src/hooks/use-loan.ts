import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import {
  createLoan,
  deleteLoan,
  getLoanById,
  listLoans,
  updateLoan,
  approveLoan,
  type CreateLoanRequest,
  type ListLoansParams,
  type UpdateLoanRequest
} from "@/lib/loan-api";
import { Loan, LoanStatus } from "@/types/entities/loan.type";

export const loanKeys = {
  all: ["loans"] as const,
  lists: () => [...loanKeys.all, "list"] as const,
  list: (params?: ListLoansParams) => [...loanKeys.lists(), params] as const,
  details: () => [...loanKeys.all, "detail"] as const,
  detail: (id: string) => [...loanKeys.details(), id] as const
};

export function useLoans(
  params?: ListLoansParams,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof listLoans>>,
      Error,
      Awaited<ReturnType<typeof listLoans>>,
      ReturnType<typeof loanKeys.list>
    >,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: loanKeys.list(params),
    queryFn: () => listLoans(params),
    ...options
  });
}

export function useLoan(
  loanId: string,
  options?: Omit<UseQueryOptions<Loan, Error, Loan, ReturnType<typeof loanKeys.detail>>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: loanKeys.detail(loanId),
    queryFn: () => getLoanById(loanId),
    enabled: !!loanId,
    ...options
  });
}

export function useCreateLoan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLoanRequest) => createLoan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: loanKeys.lists() });
    }
  });
}

export function useUpdateLoan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ loanId, data }: { loanId: string; data: UpdateLoanRequest }) => updateLoan(loanId, data),
    onSuccess: (updatedLoan) => {
      queryClient.invalidateQueries({ queryKey: loanKeys.detail(updatedLoan.id) });
      queryClient.invalidateQueries({ queryKey: loanKeys.lists() });
    }
  });
}

export function useApproveLoan(loanId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => approveLoan(loanId),
    onSuccess: (approvedLoan) => {
      queryClient.invalidateQueries({ queryKey: loanKeys.detail(approvedLoan.id) });
      queryClient.invalidateQueries({ queryKey: loanKeys.lists() });
    }
  });
}

export function useDeleteLoan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (loanId: string) => deleteLoan(loanId),
    onSuccess: (_data, loanId) => {
      queryClient.removeQueries({ queryKey: loanKeys.detail(loanId) });
      queryClient.invalidateQueries({ queryKey: loanKeys.lists() });
    }
  });
}

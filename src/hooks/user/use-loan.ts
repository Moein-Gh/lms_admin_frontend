import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { type ListLoansParams } from "@/lib/admin-APIs/loan-api";
import { getUserLoanById, listUserLoans } from "@/lib/user-APIs/loan-api";
import { Loan } from "@/types/entities/loan.type";

export const loanKeys = {
  all: ["loans"] as const,
  lists: () => [...loanKeys.all, "list"] as const,
  list: (params?: ListLoansParams) => [...loanKeys.lists(), params] as const,
  details: () => [...loanKeys.all, "detail"] as const,
  detail: (id: string) => [...loanKeys.details(), id] as const
};

export function useUserLoans(
  params?: ListLoansParams,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof listUserLoans>>,
      Error,
      Awaited<ReturnType<typeof listUserLoans>>,
      ReturnType<typeof loanKeys.list>
    >,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: loanKeys.list(params),
    queryFn: () => listUserLoans(params),
    ...options
  });
}

export function useUserLoan(
  loanId: string,
  options?: Omit<UseQueryOptions<Loan, Error, Loan, ReturnType<typeof loanKeys.detail>>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: loanKeys.detail(loanId),
    queryFn: () => getUserLoanById(loanId),
    enabled: !!loanId,
    ...options
  });
}

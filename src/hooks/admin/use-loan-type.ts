import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import {
  createLoanType,
  deleteLoanType,
  getLoanTypeById,
  listLoanTypes,
  updateLoanType,
  type CreateLoanTypeRequest,
  type ListLoanTypesParams,
  type UpdateLoanTypeRequest
} from "@/lib/admin-APIs/loan-type-api";
import { LoanType } from "@/types/entities/loan-type.type";

export const loanTypeKeys = {
  all: ["loanTypes"] as const,
  lists: () => [...loanTypeKeys.all, "list"] as const,
  list: (params?: ListLoanTypesParams) => [...loanTypeKeys.lists(), params] as const,
  details: () => [...loanTypeKeys.all, "detail"] as const,
  detail: (id: string) => [...loanTypeKeys.details(), id] as const
};

export function useLoanTypes(
  params?: ListLoanTypesParams,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof listLoanTypes>>,
      Error,
      Awaited<ReturnType<typeof listLoanTypes>>,
      ReturnType<typeof loanTypeKeys.list>
    >,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: loanTypeKeys.list(params),
    queryFn: () => listLoanTypes(params),
    ...options
  });
}

export function useLoanType(
  loanTypeId: string,
  options?: Omit<
    UseQueryOptions<LoanType, Error, LoanType, ReturnType<typeof loanTypeKeys.detail>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: loanTypeKeys.detail(loanTypeId),
    queryFn: () => getLoanTypeById(loanTypeId),
    enabled: !!loanTypeId,
    ...options
  });
}

export function useCreateLoanType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLoanTypeRequest) => createLoanType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: loanTypeKeys.lists() });
    }
  });
}

export function useUpdateLoanType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ loanTypeId, data }: { loanTypeId: string; data: UpdateLoanTypeRequest }) =>
      updateLoanType(loanTypeId, data),
    onSuccess: (updatedLoanType) => {
      queryClient.invalidateQueries({ queryKey: loanTypeKeys.detail(updatedLoanType.id) });
      queryClient.invalidateQueries({ queryKey: loanTypeKeys.lists() });
    }
  });
}

export function useDeleteLoanType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (loanTypeId: string) => deleteLoanType(loanTypeId),
    onSuccess: (_data, loanTypeId) => {
      queryClient.removeQueries({ queryKey: loanTypeKeys.detail(loanTypeId) });
      queryClient.invalidateQueries({ queryKey: loanTypeKeys.lists() });
    }
  });
}

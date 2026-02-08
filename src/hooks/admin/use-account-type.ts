import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";

import {
  listAccountTypes,
  getAccountTypeById,
  createAccountType,
  updateAccountType,
  type CreateAccountTypeRequest,
  type ListAccountTypesParams,
  type UpdateAccountTypeRequest
} from "@/lib/admin-APIs/account-type-api";
import { AccountType } from "@/types/entities/account-type.type";

export const accountTypeKeys = {
  all: ["account-types"] as const,
  lists: () => [...accountTypeKeys.all, "list"] as const,
  list: (params?: ListAccountTypesParams) => [...accountTypeKeys.lists(), params] as const,
  details: () => [...accountTypeKeys.all, "detail"] as const,
  detail: (id: string) => [...accountTypeKeys.details(), id] as const
};

export function useAccountTypes(
  params?: ListAccountTypesParams,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof listAccountTypes>>,
      Error,
      Awaited<ReturnType<typeof listAccountTypes>>,
      ReturnType<typeof accountTypeKeys.list>
    >,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: accountTypeKeys.list(params),
    queryFn: () => listAccountTypes(params),
    ...options
  });
}

export function useAccountType(
  accountTypeId: string,
  options?: Omit<
    UseQueryOptions<AccountType, Error, AccountType, ReturnType<typeof accountTypeKeys.detail>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: accountTypeKeys.detail(accountTypeId),
    queryFn: () => getAccountTypeById(accountTypeId),
    enabled: !!accountTypeId,
    ...options
  });
}

export function useCreateAccountType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAccountTypeRequest) => createAccountType(data),
    onSuccess: () => {
      // Invalidate and refetch account type lists
      queryClient.invalidateQueries({ queryKey: accountTypeKeys.lists() });
    }
  });
}

export function useUpdateAccountType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ accountTypeId, data }: { accountTypeId: string; data: UpdateAccountTypeRequest }) =>
      updateAccountType(accountTypeId, data),
    onSuccess: (updated) => {
      // Invalidate the specific account type detail query
      queryClient.invalidateQueries({
        queryKey: accountTypeKeys.detail(updated.id)
      });
      // Invalidate account type lists to reflect changes
      queryClient.invalidateQueries({ queryKey: accountTypeKeys.lists() });
    }
  });
}

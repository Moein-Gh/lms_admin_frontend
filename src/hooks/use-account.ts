import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";

import {
  activateAccount,
  buyOutAccount,
  createAccount,
  deleteAccount,
  getAccountById,
  listAccounts,
  updateAccount,
  type CreateAccountRequest,
  type ListAccountsParams,
  type UpdateAccountRequest
} from "@/lib/account-api";
import { Account } from "@/types/entities/account.type";

export const accountKeys = {
  all: ["accounts"] as const,
  lists: () => [...accountKeys.all, "list"] as const,
  list: (params?: ListAccountsParams) => [...accountKeys.lists(), params] as const,
  details: () => [...accountKeys.all, "detail"] as const,
  detail: (id: string) => [...accountKeys.details(), id] as const
};

export function useAccounts(
  params?: ListAccountsParams,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof listAccounts>>,
      Error,
      Awaited<ReturnType<typeof listAccounts>>,
      ReturnType<typeof accountKeys.list>
    >,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: accountKeys.list(params),
    queryFn: () => listAccounts(params),
    ...options
  });
}

export function useAccount(
  accountId: string,
  options?: Omit<
    UseQueryOptions<Account, Error, Account, ReturnType<typeof accountKeys.detail>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: accountKeys.detail(accountId),
    queryFn: () => getAccountById(accountId),
    enabled: !!accountId,
    ...options
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAccountRequest) => createAccount(data),
    onSuccess: () => {
      // Invalidate and refetch account lists
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
    }
  });
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ accountId, data }: { accountId: string; data: UpdateAccountRequest }) =>
      updateAccount(accountId, data),
    onSuccess: (updatedAccount) => {
      // Invalidate the specific account detail query
      queryClient.invalidateQueries({
        queryKey: accountKeys.detail(updatedAccount.id)
      });
      // Invalidate account lists to reflect changes
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
    }
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accountId: string) => deleteAccount(accountId),
    onSuccess: (_data, accountId) => {
      // Remove the deleted account from cache
      queryClient.removeQueries({ queryKey: accountKeys.detail(accountId) });
      // Invalidate account lists
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
    }
  });
}

export function useBuyOutAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: buyOutAccount,
    onSuccess: (newAccount) => {
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
      queryClient.invalidateQueries({ queryKey: accountKeys.detail(newAccount.id) });
      queryClient.invalidateQueries({ queryKey: ["subscription-fees", newAccount.id] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    }
  });
}

export function useActivateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accountId: string) => activateAccount(accountId),
    onSuccess: (activatedAccount) => {
      // Invalidate the specific account detail query
      queryClient.invalidateQueries({
        queryKey: accountKeys.detail(activatedAccount.id)
      });
      // Invalidate account lists to reflect changes
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
    }
  });
}

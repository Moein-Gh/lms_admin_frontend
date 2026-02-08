import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { type ListAccountsParams } from "@/lib/admin-APIs/account-api";
import { getUserAccountById, listUserAccounts } from "@/lib/user-APIs/account-api";
import { Account } from "@/types/entities/account.type";

export const accountKeys = {
  all: ["accounts"] as const,
  lists: () => [...accountKeys.all, "list"] as const,
  list: (params?: ListAccountsParams) => [...accountKeys.lists(), params] as const,
  details: () => [...accountKeys.all, "detail"] as const,
  detail: (id: string) => [...accountKeys.details(), id] as const
};

export function useUserAccounts(
  params?: ListAccountsParams,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof listUserAccounts>>,
      Error,
      Awaited<ReturnType<typeof listUserAccounts>>,
      ReturnType<typeof accountKeys.list>
    >,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: accountKeys.list(params),
    queryFn: () => listUserAccounts(params),
    ...options
  });
}

export function useUserAccount(
  accountId: string,
  options?: Omit<
    UseQueryOptions<Account, Error, Account, ReturnType<typeof accountKeys.detail>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: accountKeys.detail(accountId),
    queryFn: () => getUserAccountById(accountId),
    enabled: !!accountId,
    ...options
  });
}

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { type ListTransactionsParams } from "@/lib/admin-APIs/transaction-api";
import { getUserTransactionById, listUserTransactions } from "@/lib/user-APIs/transaction-api";
import { Transaction } from "@/types/entities/transaction.type";

export const transactionKeys = {
  all: ["transactions"] as const,
  lists: () => [...transactionKeys.all, "list"] as const,
  list: (params?: ListTransactionsParams) => [...transactionKeys.lists(), params] as const,
  details: () => [...transactionKeys.all, "detail"] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const
};

export function useUserTransactions(
  params?: ListTransactionsParams,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof listUserTransactions>>,
      Error,
      Awaited<ReturnType<typeof listUserTransactions>>,
      ReturnType<typeof transactionKeys.list>
    >,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: transactionKeys.list(params),
    queryFn: () => listUserTransactions(params),
    ...options
  });
}

export function useUserTransaction(
  transactionId: string,
  options?: Omit<
    UseQueryOptions<Transaction, Error, Transaction, ReturnType<typeof transactionKeys.detail>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: transactionKeys.detail(transactionId),
    queryFn: () => getUserTransactionById(transactionId),
    enabled: !!transactionId,
    ...options
  });
}

import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import {
  createTransaction,
  deleteTransaction,
  getTransactionById,
  listTransactions,
  updateTransaction,
  approveTransaction,
  type ListTransactionsParams,
  type UpdateTransactionRequest,
  type CreateTransactionRequest
} from "@/lib/transaction-api";
import { Transaction } from "@/types/entities/transaction.type";

export const transactionKeys = {
  all: ["transactions"] as const,
  lists: () => [...transactionKeys.all, "list"] as const,
  list: (params?: ListTransactionsParams) => [...transactionKeys.lists(), params] as const,
  details: () => [...transactionKeys.all, "detail"] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const
};

export function useTransactions(
  params?: ListTransactionsParams,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof listTransactions>>,
      Error,
      Awaited<ReturnType<typeof listTransactions>>,
      ReturnType<typeof transactionKeys.list>
    >,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: transactionKeys.list(params),
    queryFn: () => listTransactions(params),
    ...options
  });
}

export function useTransaction(
  transactionId: string,
  options?: Omit<
    UseQueryOptions<Transaction, Error, Transaction, ReturnType<typeof transactionKeys.detail>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: transactionKeys.detail(transactionId),
    queryFn: () => getTransactionById(transactionId),
    enabled: !!transactionId,
    ...options
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation<Transaction, unknown, CreateTransactionRequest | FormData, unknown>({
    mutationFn: (data: CreateTransactionRequest | FormData) => createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
    }
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ transactionId, data }: { transactionId: string; data: UpdateTransactionRequest }) =>
      updateTransaction(transactionId, data),
    onSuccess: (updatedTransaction) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.detail(updatedTransaction.id) });
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
    }
  });
}

export function useApproveTransaction(transactionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => approveTransaction(transactionId),
    onSuccess: (approvedTransaction) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.detail(approvedTransaction.id) });
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      // Invalidate journals list for this transaction
      queryClient.invalidateQueries({ queryKey: ["journals", { transactionId }] });
    }
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (transactionId: string) => deleteTransaction(transactionId),
    onSuccess: (_data, transactionId) => {
      queryClient.removeQueries({ queryKey: transactionKeys.detail(transactionId) });
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
    }
  });
}

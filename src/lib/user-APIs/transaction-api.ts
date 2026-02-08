import { PaginatedResponseDto } from "@/types/api";
import { Transaction } from "@/types/entities/transaction.type";
import { ListTransactionsParams } from "../admin-APIs/transaction-api";
import api from "../api";

export async function listUserTransactions(
  params?: ListTransactionsParams
): Promise<PaginatedResponseDto<Transaction>> {
  const response = await api.get<PaginatedResponseDto<Transaction>>(`/user/transactions/`, {
    params
  });
  return response.data;
}

export async function getUserTransactionById(transactionId: string): Promise<Transaction> {
  const response = await api.get<Transaction>(`/user/transactions/${transactionId}`);
  return response.data;
}

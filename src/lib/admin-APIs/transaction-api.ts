import { PaginatedResponseDto, PaginationParams } from "@/types/api";
import { Transaction, TransactionKind, TransactionStatus } from "@/types/entities/transaction.type";
import api from "../api";

export interface CreateTransactionRequest {
  kind: TransactionKind;
  amount: string;
  userId: string;
  externalRef?: string | null;
  note?: string | null;
}

export interface UpdateTransactionRequest {
  note?: string;
  externalRef?: string | null;
}

export interface ListTransactionsParams extends PaginationParams {
  search?: string;
  userId?: string;
  kind?: TransactionKind;
  status?: TransactionStatus;
  accountId?: string;
  targetType?: string;
  targetId?: string;
}

/**
 * List all transactions with optional filtering and pagination
 */
export async function listTransactions(params?: ListTransactionsParams): Promise<PaginatedResponseDto<Transaction>> {
  const response = await api.get<PaginatedResponseDto<Transaction>>(`/admin/transactions/`, {
    params
  });
  return response.data;
}

/**
 * Get a single transaction by ID
 */
export async function getTransactionById(transactionId: string): Promise<Transaction> {
  const response = await api.get<Transaction>(`/admin/transactions/${transactionId}`);
  return response.data;
}

/**
 * Create a new transaction
 */
export async function createTransaction(data: CreateTransactionRequest | FormData): Promise<Transaction> {
  if (data instanceof FormData) {
    const response = await api.post<Transaction>(`/admin/transactions/`, data, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  }

  const response = await api.post<Transaction>(`/admin/transactions/`, data);
  return response.data;
}

export interface CreateTransferRequest {
  sourceAccountId: string;
  destinationAccountId: string;
  amount: string;
  description?: string | null;
}

/**
 * Create a transfer between accounts
 */
export async function createTransfer(data: CreateTransferRequest): Promise<Transaction> {
  const response = await api.post<Transaction>(`/admin/transactions/transfer`, data);
  return response.data;
}

/**
 * Approve a pending transaction
 */
export async function approveTransaction(transactionId: string): Promise<Transaction> {
  const response = await api.post<Transaction>(`/admin/transactions/approve/${transactionId}`);
  return response.data;
}

/**
 * Update an existing transaction
 */
export async function updateTransaction(transactionId: string, data: UpdateTransactionRequest): Promise<Transaction> {
  const response = await api.patch<Transaction>(`/admin/transactions/${transactionId}`, data);
  return response.data;
}

/**
 * Delete a transaction
 */
export async function deleteTransaction(transactionId: string): Promise<void> {
  await api.delete(`/admin/transactions/${transactionId}`);
}

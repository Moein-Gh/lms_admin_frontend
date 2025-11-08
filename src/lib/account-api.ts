import { PaginatedResponseDto, PaginationParams } from "@/types/api";
import { Account, AccountStatus } from "@/types/entities/account.type";

import api from "./api";

export interface CreateAccountRequest {
  accountTypeId: string;
  userId: string;
  cardNumber: string;
  bankName: string;
}

export interface RegisterAccountInput {
  phone: string;
  email?: string | null;
  name: string;
  countryCode: string;
  nationalCode: string;
}

export interface UpdateAccountRequest {
  accountTypeId?: string;
  name?: string;
  userId?: string;
  cardNumber?: string;
  bankName?: string;
  status?: AccountStatus;
}

export interface ListAccountsParams extends PaginationParams {
  search?: string;
  userId?: string;
  accountTypeId?: string;
  status?: AccountStatus;
}

export async function listAccounts(params?: ListAccountsParams): Promise<PaginatedResponseDto<Account>> {
  const response = await api.get<PaginatedResponseDto<Account>>("/accounts/", {
    params
  });
  return response.data;
}

export async function getAccountById(accountId: string): Promise<Account> {
  const response = await api.get<Account>(`/accounts/${accountId}`);
  return response.data;
}

export async function createAccount(data: CreateAccountRequest): Promise<Account> {
  const response = await api.post<Account>("/accounts/", data);
  return response.data;
}

export async function updateAccount(accountId: string, data: UpdateAccountRequest): Promise<Account> {
  const response = await api.patch<Account>(`/accounts/${accountId}`, data);
  return response.data;
}

export async function deleteAccount(accountId: string): Promise<void> {
  await api.delete(`/accounts/${accountId}`);
}

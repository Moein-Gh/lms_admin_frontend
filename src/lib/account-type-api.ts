import { PaginatedResponseDto, PaginationParams } from "@/types/api";
import { AccountType } from "@/types/entities/account-type.type";

import api from "./api";

export interface CreateAccountTypeRequest {
  name: string;
  maxAccounts: number | null;
}

export interface UpdateAccountTypeRequest {
  name?: string;
  maxAccounts?: number | null;
}

export interface ListAccountTypesParams extends PaginationParams {
  search?: string;
}

/**
 * List all account types with optional filtering and pagination
 */
export async function listAccountTypes(params?: ListAccountTypesParams): Promise<PaginatedResponseDto<AccountType>> {
  const response = await api.get<PaginatedResponseDto<AccountType>>("/account-types/", {
    params
  });
  return response.data;
}

/**
 * Get a single account type by ID
 */
export async function getAccountTypeById(accountTypeId: string): Promise<AccountType> {
  const response = await api.get<AccountType>(`/account-types/${accountTypeId}`);
  return response.data;
}

/**
 * Create a new account type
 */
export async function createAccountType(data: CreateAccountTypeRequest): Promise<AccountType> {
  const response = await api.post<AccountType>("/account-types/", data);
  return response.data;
}

/**
 * Update an existing account type
 */
export async function updateAccountType(accountTypeId: string, data: UpdateAccountTypeRequest): Promise<AccountType> {
  const response = await api.patch<AccountType>(`/account-types/${accountTypeId}`, data);
  return response.data;
}

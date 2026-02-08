import { PaginatedResponseDto } from "@/types/api";
import { Account } from "@/types/entities/account.type";
import { ListAccountsParams } from "../admin-APIs/account-api";
import api from "../api";

export async function listUserAccounts(params?: ListAccountsParams): Promise<PaginatedResponseDto<Account>> {
  const response = await api.get<PaginatedResponseDto<Account>>(`/user/accounts/`, {
    params
  });
  return response.data;
}

export async function getUserAccountById(accountId: string): Promise<Account> {
  const response = await api.get<Account>(`/user/accounts/${accountId}`);
  return response.data;
}

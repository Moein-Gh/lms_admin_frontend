import { PaginatedResponseDto, PaginationParams } from "@/types/api";
import { LoanRequest, LoanRequestStatus } from "@/types/entities/loan-request.type";
import api from "../api";

export interface CreateLoanRequestDto {
  accountId: string;
  amount: string;
  startDate: string; // ISO 8601 string
  paymentMonths: number;
  note?: string;
}

export interface UpdateLoanRequestDto {
  note?: string;
}

export interface ListLoanRequestsParams extends PaginationParams {
  search?: string;
  accountId?: string;
  userId?: string;
  loanTypeId?: string;
  status?: LoanRequestStatus;
}

export async function listUserLoanRequests(
  params?: ListLoanRequestsParams
): Promise<PaginatedResponseDto<LoanRequest>> {
  const response = await api.get<PaginatedResponseDto<LoanRequest>>(`/user/loan-requests/`, {
    params
  });
  return response.data;
}

export async function getUserLoanRequestById(loanRequestId: string): Promise<LoanRequest> {
  const response = await api.get<LoanRequest>(`/user/loan-requests/${loanRequestId}`);
  return response.data;
}

export async function createUserLoanRequest(data: CreateLoanRequestDto): Promise<LoanRequest> {
  const response = await api.post<LoanRequest>(`/user/loan-requests/`, data);
  return response.data;
}

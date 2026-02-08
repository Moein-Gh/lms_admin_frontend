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

/**
 * List all loan requests with optional filtering and pagination
 */
export async function listLoanRequests(params?: ListLoanRequestsParams): Promise<PaginatedResponseDto<LoanRequest>> {
  const response = await api.get<PaginatedResponseDto<LoanRequest>>(`/admin/loan-requests/`, {
    params
  });
  return response.data;
}

/**
 * Get a single loan request by ID
 */
export async function getLoanRequestById(loanRequestId: string): Promise<LoanRequest> {
  const response = await api.get<LoanRequest>(`/admin/loan-requests/${loanRequestId}`);
  return response.data;
}

/**
 * Create a new loan request
 * Note: Do NOT include userId or loanTypeId - backend derives these
 */
export async function createLoanRequest(data: CreateLoanRequestDto): Promise<LoanRequest> {
  const response = await api.post<LoanRequest>(`/admin/loan-requests/`, data);
  return response.data;
}

/**
 * Update an existing loan request
 */
export async function updateLoanRequest(loanRequestId: string, data: UpdateLoanRequestDto): Promise<LoanRequest> {
  const response = await api.patch<LoanRequest>(`/admin/loan-requests/${loanRequestId}`, data);
  return response.data;
}

/**
 * Approve a loan request
 */
export async function approveLoanRequest(loanRequestId: string): Promise<LoanRequest> {
  const response = await api.post<LoanRequest>(`/admin/loan-requests/${loanRequestId}/approve`);
  return response.data;
}

/**
 * Reject a loan request
 */
export async function rejectLoanRequest(loanRequestId: string): Promise<LoanRequest> {
  const response = await api.post<LoanRequest>(`/admin/loan-requests/${loanRequestId}/reject`);
  return response.data;
}

/**
 * Delete a loan request
 */
export async function deleteLoanRequest(loanRequestId: string): Promise<void> {
  await api.delete(`/admin/loan-requests/${loanRequestId}`);
}

import { PaginatedResponseDto, PaginationParams } from "@/types/api";
import { Loan, LoanStatus } from "@/types/entities/loan.type";
import api from "../api";

export interface CreateLoanRequest {
  accountId: string;
  loanTypeId: string;
  amount: string;
  startDate: Date;
  paymentMonths: number;
  name: string;
}

export interface UpdateLoanRequest {
  name?: string;
}

export interface ListLoansParams extends PaginationParams {
  search?: string;
  accountId?: string;
  userId?: string;
  loanTypeId?: string;
  status?: LoanStatus;
}

/**
 * List all loans with optional filtering and pagination
 */
export async function listLoans(params?: ListLoansParams): Promise<PaginatedResponseDto<Loan>> {
  const response = await api.get<PaginatedResponseDto<Loan>>(`/admin/loans/`, { params });
  return response.data;
}

/**
 * Get a single loan by ID
 */
export async function getLoanById(loanId: string): Promise<Loan> {
  const response = await api.get<Loan>(`/admin/loans/${loanId}`);
  return response.data;
}

/**
 * Create a new loan
 */
export async function createLoan(data: CreateLoanRequest): Promise<Loan> {
  const response = await api.post<Loan>(`/admin/loans/`, data);
  return response.data;
}

/**
 * Approve a pending loan
 */
export async function approveLoan(loanId: string): Promise<Loan> {
  const response = await api.post<Loan>(`/admin/loans/approve/${loanId}`);
  return response.data;
}

/**
 * Update an existing loan
 */
export async function updateLoan(loanId: string, data: UpdateLoanRequest): Promise<Loan> {
  const response = await api.patch<Loan>(`/admin/loans/${loanId}`, data);
  return response.data;
}

/**
 * Delete a loan
 */
export async function deleteLoan(loanId: string): Promise<void> {
  await api.delete(`/admin/loans/${loanId}`);
}

import { PaginatedResponseDto, PaginationParams } from "@/types/api";
import { Loan, LoanStatus } from "@/types/entities/loan.type";
import api from "./api";

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
  loanTypeId?: string;
  status?: LoanStatus;
}

/**
 * List all loans with optional filtering and pagination
 */
export async function listLoans(params?: ListLoansParams): Promise<PaginatedResponseDto<Loan>> {
  const response = await api.get<PaginatedResponseDto<Loan>>("/loans/", { params });
  return response.data;
}

/**
 * Get a single loan by ID
 */
export async function getLoanById(loanId: string): Promise<Loan> {
  const response = await api.get<Loan>(`/loans/${loanId}`);
  return response.data;
}

/**
 * Create a new loan
 */
export async function createLoan(data: CreateLoanRequest): Promise<Loan> {
  const response = await api.post<Loan>("/loans/", data);
  return response.data;
}

/**
 * Approve a pending loan
 */
export async function approveLoan(loanId: string): Promise<Loan> {
  const response = await api.post<Loan>(`/loans/approve/${loanId}`);
  return response.data;
}

/**
 * Update an existing loan
 */
export async function updateLoan(loanId: string, data: UpdateLoanRequest): Promise<Loan> {
  const response = await api.patch<Loan>(`/loans/${loanId}`, data);
  return response.data;
}

/**
 * Delete a loan
 */
export async function deleteLoan(loanId: string): Promise<void> {
  await api.delete(`/loans/${loanId}`);
}

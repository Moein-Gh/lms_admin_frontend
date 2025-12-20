import { PaginatedResponseDto, PaginationParams } from "@/types/api";
import { LoanType } from "@/types/entities/loan-type.type";
import api from "./api";

export interface CreateLoanTypeRequest {
  name: string;
  commissionPercentage: number;
  defaultInstallments: number;
  maxInstallments: number;
  minInstallments: number;
  creditRequirementPct: number;
  description?: string | null;
}

export interface UpdateLoanTypeRequest {
  name?: string;
  commissionPercentage?: number;
  defaultInstallments?: number;
  maxInstallments?: number;
  minInstallments?: number;
  creditRequirementPct?: number;
  description?: string | null;
}

export interface ListLoanTypesParams extends PaginationParams {
  search?: string;
}

/**
 * List all loan types with optional filtering and pagination
 */
export async function listLoanTypes(params?: ListLoanTypesParams): Promise<PaginatedResponseDto<LoanType>> {
  const response = await api.get<PaginatedResponseDto<LoanType>>("/loan-types/", { params });
  return response.data;
}

/**
 * Get a single loan type by ID
 */
export async function getLoanTypeById(loanTypeId: string): Promise<LoanType> {
  const response = await api.get<LoanType>(`/loan-types/${loanTypeId}`);
  return response.data;
}

/**
 * Create a new loan type
 */
export async function createLoanType(data: CreateLoanTypeRequest): Promise<LoanType> {
  const response = await api.post<LoanType>("/loan-types/", data);
  return response.data;
}

/**
 * Update an existing loan type
 */
export async function updateLoanType(loanTypeId: string, data: UpdateLoanTypeRequest): Promise<LoanType> {
  const response = await api.patch<LoanType>(`/loan-types/${loanTypeId}`, data);
  return response.data;
}

/**
 * Delete a loan type
 */
export async function deleteLoanType(loanTypeId: string): Promise<void> {
  await api.delete(`/loan-types/${loanTypeId}`);
}

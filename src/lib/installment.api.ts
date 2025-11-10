import { PaginatedResponseDto, PaginationParams } from "@/types/api";
import { Installment, InstallmentStatus } from "@/types/entities/installment.type";
import api from "./api";

export interface CreateInstallmentRequest {
  loanId: string;
  amount: string;
  dueDate: Date;
  installmentNumber: number;
}

export interface UpdateInstallmentRequest {
  amount?: string;
  dueDate?: Date;
  installmentNumber?: number;
  status?: InstallmentStatus;
  paymentDate?: Date;
}

export interface ListInstallmentsParams extends PaginationParams {
  loanId?: string;
  status?: InstallmentStatus;
  orderBy?: "dueDate" | "createdAt" | "amount" | "installmentNumber";
}

/**
 * List all installments with optional filtering and pagination
 */
export async function listInstallments(params?: ListInstallmentsParams): Promise<PaginatedResponseDto<Installment>> {
  const response = await api.get<PaginatedResponseDto<Installment>>("/installments/", { params });
  return response.data;
}

/**
 * Get a single installment by ID
 */
export async function getInstallmentById(installmentId: string): Promise<Installment> {
  const response = await api.get<Installment>(`/installment/${installmentId}`);
  return response.data;
}

/**
 * Create a new installment
 */
export async function createInstallment(data: CreateInstallmentRequest): Promise<Installment> {
  const response = await api.post<Installment>("/installments/", data);
  return response.data;
}

/**
 * Update an existing installment
 */
export async function updateInstallment(installmentId: string, data: UpdateInstallmentRequest): Promise<Installment> {
  const response = await api.patch<Installment>(`/Installments/${installmentId}`, data);
  return response.data;
}

/**
 * Delete an installment
 */
export async function deleteInstallment(installmentId: string): Promise<void> {
  await api.delete(`/installments/${installmentId}`);
}

import { PaginatedResponseDto } from "@/types/api";
import { Installment, InstallmentStatus } from "@/types/entities/installment.type";
import { ListInstallmentsParams } from "../admin-APIs/installment.api";
import api from "../api";

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

export async function listUserInstallments(
  params?: ListInstallmentsParams
): Promise<PaginatedResponseDto<Installment>> {
  const response = await api.get<PaginatedResponseDto<Installment>>(`/user/installments/`, {
    params
  });
  return response.data;
}

import { PaginatedResponseDto } from "@/types/api";
import { Loan } from "@/types/entities/loan.type";
import { ListLoansParams } from "../admin-APIs/loan-api";
import api from "../api";

export async function listUserLoans(params?: ListLoansParams): Promise<PaginatedResponseDto<Loan>> {
  const response = await api.get<PaginatedResponseDto<Loan>>(`/user/loans/`, { params });
  return response.data;
}

export async function getUserLoanById(loanId: string): Promise<Loan> {
  const response = await api.get<Loan>(`/user/loans/${loanId}`);
  return response.data;
}

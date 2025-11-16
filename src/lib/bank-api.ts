import api from "./api";

export interface BankMonthlySummary {
  month: string;
  income: number;
  expenses: number;
  scheduled?: number;
}

export interface BankFinancialSummaryDto {
  totalIncome: number;
  totalExpenses: number;
  totalScheduled?: number;
  net?: number;
  byMonth?: BankMonthlySummary[];
}

export interface BankFinancialsParams {
  period?: "last-year" | "last-month" | "ytd" | string;
}

/**
 * Get aggregated financial summary for the bank
 * Endpoint: GET /bank/financials/summary
 */
export async function getBankFinancialSummary(params?: BankFinancialsParams): Promise<BankFinancialSummaryDto> {
  const response = await api.get<BankFinancialSummaryDto>("/bank/financials/summary", { params });
  return response.data;
}

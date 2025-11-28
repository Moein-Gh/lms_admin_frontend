import api from "./api";

export interface FinancialMetric {
  lastMonth: string;
  monthlyAverage: string;
  today: string;
}

export interface FinancialSummary {
  cashOnHand: FinancialMetric;
  customerDeposits: FinancialMetric;
  loansReceivable: FinancialMetric;
  totalIncomeEarned: FinancialMetric;
  asOfDate: Date;
}

export interface FinancialSummaryParams {
  startDate?: Date;
  endDate?: Date;
}

export async function getFinancialSummary(params: FinancialSummaryParams): Promise<FinancialSummary> {
  const response = await api.post<FinancialSummary>("/report/dashboard/summary", params);
  return response.data;
}

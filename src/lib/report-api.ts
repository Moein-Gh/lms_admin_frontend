import { type InstallmentProjection } from "@/types/entities/installment-projection.type";

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

export interface EntitiesSummary {
  readonly users: number;
  readonly accounts: {
    readonly total: number;
    readonly active: number;
    readonly restricted: number;
  };
  readonly loans: {
    readonly total: number;
    readonly active: number;
    readonly pending: number;
  };
  readonly transactions: {
    readonly total: number;
    readonly pending: number;
    readonly allocated: number;
  };
}

export async function getFinancialSummary(params: FinancialSummaryParams): Promise<FinancialSummary> {
  const response = await api.get<FinancialSummary>("/report/dashboard/summary", { params });
  return response.data;
}
export async function getEntitiesSummary(): Promise<EntitiesSummary> {
  const response = await api.get<EntitiesSummary>("/report/dashboard/entities");
  return response.data;
}

export interface InstallmentProjectionParams {
  page?: number;
  pageSize?: number;
}

export async function getInstallmentProjection(
  params: InstallmentProjectionParams = {}
): Promise<InstallmentProjection> {
  const response = await api.get<InstallmentProjection>("/report/projections/installments", { params });
  return response.data;
}

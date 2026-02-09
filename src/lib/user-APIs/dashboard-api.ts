import { PaymentSummaryDto } from "@/types/entities/payment.type";
import type { UserOverviewDto } from "@/types/entities/user-overview.type";

import api from "../api";

export async function getPaymentSummary(): Promise<PaymentSummaryDto> {
  const response = await api.get<PaymentSummaryDto>(`user/dashboard/payment-summary`);
  return response.data;
}

export async function getUserOverview(): Promise<UserOverviewDto> {
  const response = await api.get<UserOverviewDto>(`user/dashboard/overview`);
  return response.data;
}

import { PaymentSummaryDto } from "@/types/entities/payment.type";

import api from "../api";

export async function getPaymentSummary(): Promise<PaymentSummaryDto> {
  const response = await api.get<PaymentSummaryDto>(`user/dashboard/payment-summary`);
  return response.data;
}

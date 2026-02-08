import { GetUpcomingPaymentsQueryDto, UpcomingPaymentsResponseDto } from "@/types/entities/payment.type";
import api from "../api";

export async function getUserUpcomingPayments(
  userId: string,
  params?: GetUpcomingPaymentsQueryDto
): Promise<UpcomingPaymentsResponseDto> {
  const response = await api.get<UpcomingPaymentsResponseDto>(`/user/users/upcoming-payments`, {
    params
  });
  return response.data;
}

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getUserUpcomingPayments } from "@/lib/user-APIs/user-api";
import { GetUpcomingPaymentsQueryDto } from "@/types/entities/payment.type";
import { userKeys } from "../admin/use-user";

export function useUserUpcomingPayments(
  userId: string,
  params?: GetUpcomingPaymentsQueryDto,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof getUserUpcomingPayments>>,
      Error,
      Awaited<ReturnType<typeof getUserUpcomingPayments>>,
      ReturnType<typeof userKeys.upcomingPayments>
    >,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: userKeys.upcomingPayments(userId, params),
    queryFn: () => getUserUpcomingPayments(userId, params),
    enabled: !!userId,
    ...options
  });
}

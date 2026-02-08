import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { type ListInstallmentsParams } from "@/lib/admin-APIs/installment.api";
import { listUserInstallments } from "@/lib/user-APIs/installment.api";

export const installmentKeys = {
  all: ["installments"] as const,
  lists: () => [...installmentKeys.all, "list"] as const,
  list: (params?: ListInstallmentsParams) => [...installmentKeys.lists(), params] as const,
  details: () => [...installmentKeys.all, "detail"] as const,
  detail: (id: string) => [...installmentKeys.details(), id] as const
};

export function useUserInstallments(
  params?: ListInstallmentsParams,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof listUserInstallments>>,
      Error,
      Awaited<ReturnType<typeof listUserInstallments>>,
      ReturnType<typeof installmentKeys.list>
    >,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: installmentKeys.list(params),
    queryFn: () => listUserInstallments(params),
    ...options
  });
}

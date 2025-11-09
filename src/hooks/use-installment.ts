import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import {
  createInstallment,
  deleteInstallment,
  getInstallmentById,
  listInstallments,
  updateInstallment,
  type CreateInstallmentRequest,
  type ListInstallmentsParams,
  type UpdateInstallmentRequest
} from "@/lib/installment.api";
import { Installment } from "@/types/entities/installment.type";

export const installmentKeys = {
  all: ["installments"] as const,
  lists: () => [...installmentKeys.all, "list"] as const,
  list: (params?: ListInstallmentsParams) => [...installmentKeys.lists(), params] as const,
  details: () => [...installmentKeys.all, "detail"] as const,
  detail: (id: string) => [...installmentKeys.details(), id] as const
};

export function useInstallments(
  params?: ListInstallmentsParams,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof listInstallments>>,
      Error,
      Awaited<ReturnType<typeof listInstallments>>,
      ReturnType<typeof installmentKeys.list>
    >,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: installmentKeys.list(params),
    queryFn: () => listInstallments(params),
    ...options
  });
}

export function useInstallment(
  installmentId: string,
  options?: Omit<
    UseQueryOptions<Installment, Error, Installment, ReturnType<typeof installmentKeys.detail>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: installmentKeys.detail(installmentId),
    queryFn: () => getInstallmentById(installmentId),
    enabled: !!installmentId,
    ...options
  });
}

export function useCreateInstallment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInstallmentRequest) => createInstallment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: installmentKeys.lists() });
    }
  });
}

export function useUpdateInstallment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ installmentId, data }: { installmentId: string; data: UpdateInstallmentRequest }) =>
      updateInstallment(installmentId, data),
    onSuccess: (updatedInstallment) => {
      queryClient.invalidateQueries({ queryKey: installmentKeys.detail(updatedInstallment.id) });
      queryClient.invalidateQueries({ queryKey: installmentKeys.lists() });
    }
  });
}

export function useDeleteInstallment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (installmentId: string) => deleteInstallment(installmentId),
    onSuccess: (_data, installmentId) => {
      queryClient.removeQueries({ queryKey: installmentKeys.detail(installmentId) });
      queryClient.invalidateQueries({ queryKey: installmentKeys.lists() });
    }
  });
}

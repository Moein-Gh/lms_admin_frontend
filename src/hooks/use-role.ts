import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";

import {
  createRole,
  deleteRole,
  getRoleById,
  listRoles,
  updateRole,
  type CreateRoleRequest,
  type ListRolesParams,
  type UpdateRoleRequest
} from "@/lib/role-api";
import { Role } from "@/types/entities/role.type";

export const roleKeys = {
  all: ["roles"] as const,
  lists: () => [...roleKeys.all, "list"] as const,
  list: (params?: ListRolesParams) => [...roleKeys.lists(), params] as const,
  details: () => [...roleKeys.all, "detail"] as const,
  detail: (id: string) => [...roleKeys.details(), id] as const
};

export function useRoles(
  params?: ListRolesParams,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof listRoles>>,
      Error,
      Awaited<ReturnType<typeof listRoles>>,
      ReturnType<typeof roleKeys.list>
    >,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({ queryKey: roleKeys.list(params), queryFn: () => listRoles(params), ...options });
}

export function useRole(
  roleId: string,
  options?: Omit<UseQueryOptions<Role, Error, Role, ReturnType<typeof roleKeys.detail>>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: roleKeys.detail(roleId),
    queryFn: () => getRoleById(roleId),
    enabled: !!roleId,
    ...options
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleRequest) => createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
    }
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, data }: { roleId: string; data: UpdateRoleRequest }) => updateRole(roleId, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.detail(updated.id) });
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
    }
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roleId: string) => deleteRole(roleId),
    onSuccess: (_data, roleId) => {
      queryClient.removeQueries({ queryKey: roleKeys.detail(roleId) });
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
    }
  });
}

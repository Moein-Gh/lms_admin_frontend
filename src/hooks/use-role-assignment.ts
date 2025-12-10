import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import {
  createRoleAssignment,
  CreateRoleAssignmentRequest,
  deleteRoleAssignment,
  getRoleAssignmentById,
  listRoleAssignments,
  ListRoleAssignmentsParams,
  updateRoleAssignment,
  UpdateRoleAssignmentRequest
} from "@/lib/role-assignment-api";
import { RoleAssignment } from "@/types/entities/role-assignment.type";

export const roleAssignmentKeys = {
  all: ["roleAssignments"] as const,
  lists: () => [...roleAssignmentKeys.all, "list"] as const,
  // Use primitive values in the query key so keys are stable across renders
  list: (params?: ListRoleAssignmentsParams) =>
    [
      ...roleAssignmentKeys.lists(),
      params?.userId ?? null,
      params?.roleId ?? null,
      params?.page ?? null,
      params?.pageSize ?? null
    ] as const,
  details: () => [...roleAssignmentKeys.all, "detail"] as const,
  detail: (id: string) => [...roleAssignmentKeys.details(), id] as const
};

export function useRoleAssignments(
  params?: ListRoleAssignmentsParams,
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof listRoleAssignments>>,
      Error,
      Awaited<ReturnType<typeof listRoleAssignments>>,
      ReturnType<typeof roleAssignmentKeys.list>
    >,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: roleAssignmentKeys.list(params),
    queryFn: () => listRoleAssignments(params),
    // Only enable list queries when a userId is provided (avoid global list cache collisions)
    enabled: !!params?.userId,
    ...options
  });
}

export function useRoleAssignment(
  roleAssignmentId: string,
  options?: Omit<
    UseQueryOptions<RoleAssignment, Error, RoleAssignment, ReturnType<typeof roleAssignmentKeys.detail>>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: roleAssignmentKeys.detail(roleAssignmentId),
    queryFn: () => getRoleAssignmentById(roleAssignmentId),
    enabled: !!roleAssignmentId,
    ...options
  });
}

export function useCreateRoleAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleAssignmentRequest) => createRoleAssignment(data),
    // access the mutation variables (data) so we can invalidate the specific user's list
    onSuccess: (_created, variables) => {
      // Invalidate the specific user's list to ensure only that cache is refreshed
      if (variables?.userId) {
        queryClient.invalidateQueries({ queryKey: roleAssignmentKeys.list({ userId: variables.userId } as any) });
      }
      // As a fallback, invalidate the general lists prefix
      queryClient.invalidateQueries({ queryKey: roleAssignmentKeys.lists() });
    }
  });
}

export function useUpdateRoleAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleAssignmentId, data }: { roleAssignmentId: string; data: UpdateRoleAssignmentRequest }) =>
      updateRoleAssignment(roleAssignmentId, data),
    onSuccess: (updatedRoleAssignment) => {
      // Invalidate the specific roleAssignment detail query
      queryClient.invalidateQueries({
        queryKey: roleAssignmentKeys.detail(updatedRoleAssignment.id)
      });
      // Invalidate roleAssignment lists to reflect changes
      queryClient.invalidateQueries({ queryKey: roleAssignmentKeys.lists() });
    }
  });
}

export function useDeleteRoleAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roleAssignmentId: string) => deleteRoleAssignment(roleAssignmentId),
    onSuccess: (_data, roleAssignmentId) => {
      // Remove the deleted roleAssignment from cache
      queryClient.removeQueries({ queryKey: roleAssignmentKeys.detail(roleAssignmentId) });
      // Invalidate roleAssignment lists
      queryClient.invalidateQueries({ queryKey: roleAssignmentKeys.lists() });
    }
  });
}

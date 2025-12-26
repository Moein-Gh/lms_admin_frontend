import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import { userKeys } from "@/hooks/use-user";
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

    onSuccess: (_created, variables) => {
      if (variables?.userId) {
        queryClient.invalidateQueries({ queryKey: roleAssignmentKeys.list({ userId: variables.userId }) });
        try {
          const me = queryClient.getQueryData(userKeys.me());
          if (me && typeof me === "object" && "id" in me) {
            const id = (me as { id?: unknown }).id;
            if (typeof id === "string" && id === variables.userId) {
              queryClient.invalidateQueries({ queryKey: userKeys.me() });
            }
          }
        } catch {
          // ignore
        }
      }
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
      queryClient.invalidateQueries({
        queryKey: roleAssignmentKeys.detail(updatedRoleAssignment.id)
      });

      queryClient.invalidateQueries({ queryKey: roleAssignmentKeys.lists() });

      try {
        const me = queryClient.getQueryData(userKeys.me());
        if (me && typeof me === "object" && "id" in me) {
          const id = (me as { id?: unknown }).id;
          if (typeof id === "string" && id === updatedRoleAssignment.userId) {
            queryClient.invalidateQueries({ queryKey: userKeys.me() });
          }
        }
      } catch {
        // ignore
      }
    }
  });
}

export function useDeleteRoleAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roleAssignmentId: string) => deleteRoleAssignment(roleAssignmentId),
    onSuccess: (_data, roleAssignmentId) => {
      // Attempt to determine the affected user by searching cached role-assignment lists
      let affectedUserId: string | undefined;
      try {
        const listQueries = queryClient.getQueriesData({ queryKey: roleAssignmentKeys.lists() }) as Array<
          [unknown, unknown]
        >;
        for (const [, data] of listQueries) {
          let items: unknown[] = [];
          if (Array.isArray(data)) {
            items = data as unknown[];
          } else if (data && typeof data === "object" && "data" in data) {
            const d = (data as { data?: unknown }).data;
            if (Array.isArray(d)) items = d;
          }

          // iterate items with early-continues to avoid deep nesting
          for (const item of items) {
            if (!item || typeof item !== "object") continue;
            const itemId = (item as { id?: unknown }).id;
            if (typeof itemId !== "string" || itemId !== roleAssignmentId) continue;
            const uid = (item as { userId?: unknown }).userId;
            if (typeof uid === "string") {
              affectedUserId = uid;
              break;
            }
          }
          if (affectedUserId) break;
        }
      } catch (e) {
        // ignore
      }

      // Remove any cached detail for the deleted roleAssignment
      queryClient.removeQueries({ queryKey: roleAssignmentKeys.detail(roleAssignmentId) });

      // Invalidate roleAssignment lists so UI updates
      queryClient.invalidateQueries({ queryKey: roleAssignmentKeys.lists() });

      // If we detected an affected user and it's the current logged-in user, invalidate `me`
      try {
        const me = queryClient.getQueryData(userKeys.me());
        if (affectedUserId && me && typeof me === "object" && "id" in me) {
          const id = (me as { id?: unknown }).id;
          if (typeof id === "string" && id === affectedUserId) {
            queryClient.invalidateQueries({ queryKey: userKeys.me() });
          }
        }
      } catch (e) {
        // ignore
      }
    }
  });
}

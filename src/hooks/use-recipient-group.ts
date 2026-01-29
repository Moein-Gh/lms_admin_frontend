import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRecipientGroup,
  deleteRecipientGroup,
  getRecipientGroupById,
  getRecipientGroups,
  restoreRecipientGroup,
  updateRecipientGroup
} from "@/lib/recipient-group-api";
import type {
  CreateRecipientGroupDto,
  RecipientGroupQueryParams,
  UpdateRecipientGroupDto
} from "@/types/entities/message.type";

// Query keys
export const recipientGroupKeys = {
  all: ["recipient-groups"] as const,
  lists: () => [...recipientGroupKeys.all, "list"] as const,
  list: (params?: RecipientGroupQueryParams) => [...recipientGroupKeys.lists(), params] as const,
  details: () => [...recipientGroupKeys.all, "detail"] as const,
  detail: (id: string) => [...recipientGroupKeys.details(), id] as const
};

/**
 * Hook to fetch paginated recipient groups
 */
export function useRecipientGroups(params?: RecipientGroupQueryParams) {
  return useQuery({
    queryKey: recipientGroupKeys.list(params),
    queryFn: () => getRecipientGroups(params)
  });
}

/**
 * Hook to fetch a single recipient group by ID
 */
export function useRecipientGroup(id: string) {
  return useQuery({
    queryKey: recipientGroupKeys.detail(id),
    queryFn: () => getRecipientGroupById(id),
    enabled: !!id
  });
}

/**
 * Hook to create a recipient group
 */
export function useCreateRecipientGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRecipientGroupDto) => createRecipientGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipientGroupKeys.lists() });
    }
  });
}

/**
 * Hook to update a recipient group
 */
export function useUpdateRecipientGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRecipientGroupDto }) => updateRecipientGroup(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: recipientGroupKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: recipientGroupKeys.detail(variables.id)
      });
    }
  });
}

/**
 * Hook to delete a recipient group
 */
export function useDeleteRecipientGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRecipientGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipientGroupKeys.lists() });
    }
  });
}

/**
 * Hook to restore a deleted recipient group
 */
export function useRestoreRecipientGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => restoreRecipientGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipientGroupKeys.lists() });
    }
  });
}

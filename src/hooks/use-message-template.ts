import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMessageTemplate,
  deleteMessageTemplate,
  getMessageTemplateById,
  getMessageTemplates,
  restoreMessageTemplate,
  updateMessageTemplate
} from "@/lib/message-template-api";
import type {
  CreateMessageTemplateDto,
  MessageTemplateQueryParams,
  UpdateMessageTemplateDto
} from "@/types/entities/message.type";

// Query keys
export const messageTemplateKeys = {
  all: ["message-templates"] as const,
  lists: () => [...messageTemplateKeys.all, "list"] as const,
  list: (params?: MessageTemplateQueryParams) => [...messageTemplateKeys.lists(), params] as const,
  details: () => [...messageTemplateKeys.all, "detail"] as const,
  detail: (id: string) => [...messageTemplateKeys.details(), id] as const
};

/**
 * Hook to fetch paginated message templates
 */
export function useMessageTemplates(params?: MessageTemplateQueryParams) {
  return useQuery({
    queryKey: messageTemplateKeys.list(params),
    queryFn: () => getMessageTemplates(params)
  });
}

/**
 * Hook to fetch a single message template by ID
 */
export function useMessageTemplate(id: string) {
  return useQuery({
    queryKey: messageTemplateKeys.detail(id),
    queryFn: () => getMessageTemplateById(id),
    enabled: !!id
  });
}

/**
 * Hook to create a message template
 */
export function useCreateMessageTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMessageTemplateDto) => createMessageTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageTemplateKeys.lists() });
    }
  });
}

/**
 * Hook to update a message template
 */
export function useUpdateMessageTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMessageTemplateDto }) => updateMessageTemplate(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: messageTemplateKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: messageTemplateKeys.detail(variables.id)
      });
    }
  });
}

/**
 * Hook to delete a message template
 */
export function useDeleteMessageTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMessageTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageTemplateKeys.lists() });
    }
  });
}

/**
 * Hook to restore a deleted message template
 */
export function useRestoreMessageTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => restoreMessageTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageTemplateKeys.lists() });
    }
  });
}

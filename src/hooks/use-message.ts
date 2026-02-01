import { useMutation, useQuery, useQueryClient, useInfiniteQuery, type UseQueryOptions } from "@tanstack/react-query";
import {
  deleteMessage,
  getMessageById,
  getMessages,
  restoreMessage,
  sendMessage,
  updateMessage,
  updateRecipientStatus
} from "@/lib/message-api";
import type { PaginatedResponseDto } from "@/types/api";
import type {
  Message,
  MessageQueryParams,
  SendMessageDto,
  UpdateMessageDto,
  UpdateRecipientStatusDto
} from "@/types/entities/message.type";

// Query keys
export const messageKeys = {
  all: ["messages"] as const,
  lists: () => [...messageKeys.all, "list"] as const,
  list: (params?: MessageQueryParams) => [...messageKeys.lists(), params] as const,
  details: () => [...messageKeys.all, "detail"] as const,
  detail: (id: string) => [...messageKeys.details(), id] as const
};

/**
 * Hook to fetch paginated messages
 */
export function useMessages(
  params?: MessageQueryParams,
  options?: Omit<
    UseQueryOptions<
      PaginatedResponseDto<Message>,
      Error,
      PaginatedResponseDto<Message>,
      ReturnType<typeof messageKeys.list>
    >,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: messageKeys.list(params),
    queryFn: () => getMessages(params),
    ...options
  });
}

/**
 * Hook to fetch messages with infinite scroll
 */
export function useInfiniteMessages(
  params?: Omit<MessageQueryParams, "page">,
  options?: Omit<any, "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">
) {
  return useInfiniteQuery({
    queryKey: messageKeys.list(params),
    queryFn: ({ pageParam = 1 }) => getMessages({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const hasNextPage = lastPage.meta.hasNextPage;
      return hasNextPage ? lastPage.meta.page + 1 : undefined;
    },
    ...options
  });
}

/**
 * Hook to fetch a single message by ID
 */
export function useMessage(id: string, includeRecipients = true) {
  return useQuery({
    queryKey: messageKeys.detail(id),
    queryFn: () => getMessageById(id, includeRecipients),
    enabled: !!id
  });
}

/**
 * Hook to send a message
 */
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendMessageDto) => sendMessage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageKeys.lists() });
    }
  });
}

/**
 * Hook to update a message
 */
export function useUpdateMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMessageDto }) => updateMessage(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: messageKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: messageKeys.detail(variables.id)
      });
    }
  });
}

/**
 * Hook to delete a message
 */
export function useDeleteMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageKeys.lists() });
    }
  });
}

/**
 * Hook to restore a deleted message
 */
export function useRestoreMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => restoreMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageKeys.lists() });
    }
  });
}

/**
 * Hook to update recipient status
 */
export function useUpdateRecipientStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ recipientId, data }: { recipientId: string; data: UpdateRecipientStatusDto }) =>
      updateRecipientStatus(recipientId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageKeys.all });
    }
  });
}

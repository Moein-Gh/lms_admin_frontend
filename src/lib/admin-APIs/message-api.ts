import { PaginatedResponseDto } from "@/types/api";
import type {
  Message,
  MessageQueryParams,
  MessageRecipient,
  SendMessageDto,
  UpdateMessageDto,
  UpdateRecipientStatusDto
} from "@/types/entities/message.type";
import api from "../api";

/**
 * Send a new message
 */
export async function sendMessage(data: SendMessageDto): Promise<Message> {
  const response = await api.post<Message>(`/admin/messages`, data);
  return response.data;
}

/**
 * Get all messages with pagination and filtering
 */
export async function getMessages(params?: MessageQueryParams): Promise<PaginatedResponseDto<Message>> {
  const response = await api.get<PaginatedResponseDto<Message>>(`/admin/messages`, {
    params
  });
  return response.data;
}

/**
 * Get message by ID
 */
export async function getMessageById(id: string, includeRecipients = true): Promise<Message> {
  const response = await api.get<Message>(`/admin/messages/${id}`, {
    params: { includeRecipients }
  });
  return response.data;
}

/**
 * Update message (only if not sent)
 */
export async function updateMessage(id: string, data: UpdateMessageDto): Promise<Message> {
  const response = await api.patch<Message>(`/admin/messages/${id}`, data);
  return response.data;
}

/**
 * Soft delete message
 */
export async function deleteMessage(id: string): Promise<void> {
  await api.delete(`/admin/messages/${id}`);
}

/**
 * Restore deleted message
 */
export async function restoreMessage(id: string): Promise<Message> {
  const response = await api.post<Message>(`/admin/messages/${id}/restore`);
  return response.data;
}

/**
 * Update recipient delivery status
 */
export async function updateRecipientStatus(
  recipientId: string,
  data: UpdateRecipientStatusDto
): Promise<MessageRecipient> {
  const response = await api.patch<MessageRecipient>(`/admin/messages/recipients/${recipientId}/status`, data);
  return response.data;
}

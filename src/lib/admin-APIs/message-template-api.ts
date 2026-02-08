import { PaginatedResponseDto } from "@/types/api";
import type {
  CreateMessageTemplateDto,
  MessageTemplate,
  MessageTemplateQueryParams,
  UpdateMessageTemplateDto
} from "@/types/entities/message.type";
import api from "../api";

/**
 * Create a new message template
 */
export async function createMessageTemplate(data: CreateMessageTemplateDto): Promise<MessageTemplate> {
  const response = await api.post<MessageTemplate>(`/admin/message-templates`, data);
  return response.data;
}

/**
 * Get all message templates
 */
export async function getMessageTemplates(
  params?: MessageTemplateQueryParams
): Promise<PaginatedResponseDto<MessageTemplate>> {
  const response = await api.get<PaginatedResponseDto<MessageTemplate>>(`/admin/message-templates`, { params });
  return response.data;
}

/**
 * Get template by ID
 */
export async function getMessageTemplateById(id: string): Promise<MessageTemplate> {
  const response = await api.get<MessageTemplate>(`/admin/message-templates/${id}`);
  return response.data;
}

/**
 * Update template
 */
export async function updateMessageTemplate(id: string, data: UpdateMessageTemplateDto): Promise<MessageTemplate> {
  const response = await api.patch<MessageTemplate>(`/admin/message-templates/${id}`, data);
  return response.data;
}

/**
 * Soft delete template
 */
export async function deleteMessageTemplate(id: string): Promise<void> {
  await api.delete(`/admin/message-templates/${id}`);
}

/**
 * Restore deleted template
 */
export async function restoreMessageTemplate(id: string): Promise<MessageTemplate> {
  const response = await api.post<MessageTemplate>(`/admin/message-templates/${id}/restore`);
  return response.data;
}

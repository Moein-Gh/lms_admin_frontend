import { PaginatedResponseDto } from "@/types/api";
import type {
  CreateRecipientGroupDto,
  RecipientGroup,
  RecipientGroupQueryParams,
  UpdateRecipientGroupDto
} from "@/types/entities/message.type";
import api from "../api";

/**
 * Create a new recipient group
 */
export async function createRecipientGroup(data: CreateRecipientGroupDto): Promise<RecipientGroup> {
  const response = await api.post<RecipientGroup>(`/admin/recipient-groups`, data);
  return response.data;
}

/**
 * Get all recipient groups
 */
export async function getRecipientGroups(
  params?: RecipientGroupQueryParams
): Promise<PaginatedResponseDto<RecipientGroup>> {
  const response = await api.get<PaginatedResponseDto<RecipientGroup>>(`/admin/recipient-groups`, {
    params
  });
  return response.data;
}

/**
 * Get group by ID
 */
export async function getRecipientGroupById(id: string): Promise<RecipientGroup> {
  const response = await api.get<RecipientGroup>(`/admin/recipient-groups/${id}`);
  return response.data;
}

/**
 * Update group
 */
export async function updateRecipientGroup(id: string, data: UpdateRecipientGroupDto): Promise<RecipientGroup> {
  const response = await api.patch<RecipientGroup>(`/admin/recipient-groups/${id}`, data);
  return response.data;
}

/**
 * Soft delete group
 */
export async function deleteRecipientGroup(id: string): Promise<void> {
  await api.delete(`/admin/recipient-groups/${id}`);
}

/**
 * Restore deleted group
 */
export async function restoreRecipientGroup(id: string): Promise<RecipientGroup> {
  const response = await api.post<RecipientGroup>(`/admin/recipient-groups/${id}/restore`);
  return response.data;
}

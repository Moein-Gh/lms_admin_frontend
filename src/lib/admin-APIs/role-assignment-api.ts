import { PaginatedResponseDto, PaginationParams } from "@/types/api";
import { RoleAssignment } from "@/types/entities/role-assignment.type";
import api from "../api";

export interface CreateRoleAssignmentRequest {
  userId: string;
  roleId: string;
  expiresAt?: Date;
}

export interface UpdateRoleAssignmentRequest {
  expiresAt?: Date;
}

export interface ListRoleAssignmentsParams extends PaginationParams {
  userId?: string;
  roleId?: string;
}

export async function listRoleAssignments(
  params?: ListRoleAssignmentsParams
): Promise<PaginatedResponseDto<RoleAssignment>> {
  const response = await api.get<PaginatedResponseDto<RoleAssignment>>(`/admin/role-assignments/`, {
    params
  });
  return response.data;
}

export async function getRoleAssignmentById(roleAssignmentId: string): Promise<RoleAssignment> {
  const response = await api.get<RoleAssignment>(`/admin/role-assignments/${roleAssignmentId}`);
  return response.data;
}

export async function createRoleAssignment(data: CreateRoleAssignmentRequest): Promise<RoleAssignment> {
  const response = await api.post<RoleAssignment>(`/admin/role-assignments/`, data);
  return response.data;
}

export async function updateRoleAssignment(
  roleAssignmentId: string,
  data: UpdateRoleAssignmentRequest
): Promise<RoleAssignment> {
  const response = await api.patch<RoleAssignment>(`/admin/role-assignments/${roleAssignmentId}`, data);
  return response.data;
}

export async function deleteRoleAssignment(roleAssignmentId: string): Promise<void> {
  await api.delete(`/admin/role-assignments/${roleAssignmentId}`);
}

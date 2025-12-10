import { PaginatedResponseDto, PaginationParams } from "@/types/api";
import { Role } from "@/types/entities/role.type";

import api from "./api";

export interface CreateRoleRequest {
  code: number;
  name: string;
  key: string;
  description?: string;
}

export interface UpdateRoleRequest {
  name?: string;
  key?: string;
  description?: string;
}

export interface ListRolesParams extends PaginationParams {
  search?: string;
}

export async function listRoles(params?: ListRolesParams): Promise<PaginatedResponseDto<Role>> {
  const response = await api.get<PaginatedResponseDto<Role>>("/roles/", { params });
  return response.data;
}

export async function getRoleById(roleId: string): Promise<Role> {
  const response = await api.get<Role>(`/roles/${roleId}`);
  return response.data;
}

export async function createRole(data: CreateRoleRequest): Promise<Role> {
  const response = await api.post<Role>("/roles/", data);
  return response.data;
}

export async function updateRole(roleId: string, data: UpdateRoleRequest): Promise<Role> {
  const response = await api.patch<Role>(`/roles/${roleId}`, data);
  return response.data;
}

export async function deleteRole(roleId: string): Promise<void> {
  await api.delete(`/roles/${roleId}`);
}

export type { Role };

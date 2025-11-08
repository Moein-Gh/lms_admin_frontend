import { PaginatedResponseDto, PaginationParams } from "@/types/api";
import { Identity } from "@/types/entities/identity.type";
import { User } from "@/types/entities/user.type";

import api from "./api";

export interface CreateUserRequest {
  phone: string;
  name: string;
  countryCode: string;
  nationalCode?: string;
}

export interface RegisterUserInput {
  phone: string;
  email?: string | null;
  name: string;
  countryCode: string;
  nationalCode: string;
}

export type RegisterUserResult = {
  user: User & { identity: Identity };
};

export interface UpdateUserRequest {
  isActive?: boolean;
  name?: string;
  phone?: string;
  nationalCode?: string;
  countryCode?: string;
  email?: string;
}

export interface ListUsersParams extends PaginationParams {
  search?: string;
  isActive?: boolean;
}

/**
 * List all users with optional filtering and pagination
 */
export async function listUsers(params?: ListUsersParams): Promise<PaginatedResponseDto<User>> {
  const response = await api.get<PaginatedResponseDto<User>>("/users/", {
    params
  });
  return response.data;
}

/**
 * Get a single user by ID
 */
export async function getUserById(userId: string): Promise<User> {
  const response = await api.get<User>(`/users/${userId}`);
  return response.data;
}

/**
 * Create a new user
 */
export async function createUser(data: CreateUserRequest): Promise<User> {
  const response = await api.post<User>("/users/", data);
  return response.data;
}

/**
 * Register a new user (with full identity)
 */
export async function registerUser(data: RegisterUserInput): Promise<RegisterUserResult> {
  const response = await api.post<RegisterUserResult>("/users/register", data);
  return response.data;
}

/**
 * Update an existing user
 */
export async function updateUser(userId: string, data: UpdateUserRequest): Promise<User> {
  const response = await api.patch<User>(`/users/${userId}`, data);
  return response.data;
}

export async function updateIdentity(identityId: string, data: Partial<Identity>): Promise<Identity> {
  const response = await api.patch<Identity>(`/identities/${identityId}`, data);
  return response.data;
}

/**
 * Delete a user (if API supports it)
 */
export async function deleteUser(userId: string): Promise<void> {
  await api.delete(`/users/${userId}`);
}

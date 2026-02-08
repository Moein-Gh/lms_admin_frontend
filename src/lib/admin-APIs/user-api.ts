import { PaginatedResponseDto, PaginationParams } from "@/types/api";
import { Identity } from "@/types/entities/identity.type";
import { GetUpcomingPaymentsQueryDto, UpcomingPaymentsResponseDto } from "@/types/entities/payment.type";
import { User, UserStatus } from "@/types/entities/user.type";

import api from "../api";

export interface CreateUserRequest {
  phone: string;
  name: string;
  countryCode: string;
  roles: string[];
}

export interface RegisterUserInput {
  phone: string;
  email?: string | null;
  name: string;
  countryCode: string;
}

export type RegisterUserResult = {
  user: User & { identity: Identity };
};

export interface UpdateUserRequest {
  status?: UserStatus;
  name?: string;
  phone?: string;
  countryCode?: string;
  email?: string;
}

export interface ListUsersParams extends PaginationParams {
  search?: string;
  status?: UserStatus;
}

/**
 * List all users with optional filtering and pagination
 */
export async function listUsers(params?: ListUsersParams): Promise<PaginatedResponseDto<User>> {
  const response = await api.get<PaginatedResponseDto<User>>(`/admin/users/`, {
    params
  });
  return response.data;
}

/**
 * Get the current logged in user
 */
export async function getMe(): Promise<User> {
  const response = await api.get<User>(`/admin/auth/me`);
  return response.data;
}

/**
 * Get a single user by ID
 */
export async function getUserById(userId: string): Promise<User> {
  const response = await api.get<User>(`/admin/users/${userId}`);
  return response.data;
}

/**
 * Create a new user
 */
export async function createUser(data: CreateUserRequest): Promise<User> {
  const response = await api.post<User>(`/admin/users/`, data);
  return response.data;
}

/**
 * Register a new user (with full identity)
 */
export async function registerUser(data: RegisterUserInput): Promise<RegisterUserResult> {
  const response = await api.post<RegisterUserResult>(`/admin/users/register`, data);
  return response.data;
}

/**
 * Update an existing user
 */
export async function updateUser(userId: string, data: UpdateUserRequest): Promise<User> {
  const response = await api.patch<User>(`/admin/users/${userId}`, data);
  return response.data;
}

export async function updateIdentity(identityId: string, data: Partial<Identity>): Promise<Identity> {
  const response = await api.patch<Identity>(`/admin/identities/${identityId}`, data);
  return response.data;
}

/**
 * Delete a user (if API supports it)
 */
export async function deleteUser(userId: string): Promise<void> {
  await api.delete(`/admin/users/${userId}`);
}

export async function getUpcomingPayments(
  userId: string,
  params?: GetUpcomingPaymentsQueryDto
): Promise<UpcomingPaymentsResponseDto> {
  const response = await api.get<UpcomingPaymentsResponseDto>(`/admin/users/${userId}/upcoming-payments`, {
    params
  });
  return response.data;
}

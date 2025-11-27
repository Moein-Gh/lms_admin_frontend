import { PaginatedResponseDto, PaginationParams } from "@/types/api";

import { SubscriptionFee, SubscriptionFeeStatus } from "@/types/entities/subscription-fee.type";
import api from "./api";

export interface CreateSubscriptionFeeRequest {
  accountId: string;
  periodStart: Date;
  amount: string;
  dueDate?: Date;
  status?: SubscriptionFeeStatus;
  journalEntryId?: string;
}

export interface UpdateSubscriptionFeeRequest {
  amount?: string;
  dueDate?: Date;
  paidAt?: Date;
  status?: SubscriptionFeeStatus;
  journalEntryId?: string | null;
}

export interface ListSubscriptionFeesParams extends PaginationParams {
  search?: string;
  accountId?: string;
  userId?: string;
  status?: SubscriptionFeeStatus;
  periodStartFrom?: Date;
  periodStartTo?: Date;
}

/**
 * List subscription fees with optional filtering and pagination
 */
export async function listSubscriptionFees(
  params?: ListSubscriptionFeesParams
): Promise<PaginatedResponseDto<SubscriptionFee>> {
  const response = await api.get<PaginatedResponseDto<SubscriptionFee>>("/subscription-fees", { params });
  return response.data;
}

/**
 * Get a single subscription fee by ID
 */
export async function getSubscriptionFeeById(id: string): Promise<SubscriptionFee> {
  const response = await api.get<SubscriptionFee>(`/subscription-fees/${id}`);
  return response.data;
}

/**
 * Create a new subscription fee
 */
export async function createSubscriptionFee(data: CreateSubscriptionFeeRequest): Promise<SubscriptionFee> {
  const response = await api.post<SubscriptionFee>("/subscription-fees", data);
  return response.data;
}

/**
 * Update an existing subscription fee
 */
export async function updateSubscriptionFee(id: string, data: UpdateSubscriptionFeeRequest): Promise<SubscriptionFee> {
  const response = await api.patch<SubscriptionFee>(`/subscription-fees/${id}`, data);
  return response.data;
}

/**
 * Delete a subscription fee
 */
export async function deleteSubscriptionFee(id: string): Promise<void> {
  await api.delete(`/subscription-fees/${id}`);
}

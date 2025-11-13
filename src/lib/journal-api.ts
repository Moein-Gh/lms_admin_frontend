import { PaginatedResponseDto, PaginationParams } from "@/types/api";
import { Journal, JournalStatus } from "@/types/entities/journal.type";
import api from "./api";

export interface CreateJournalRequest {
  transactionId?: string;
  postedAt?: Date;
  note?: string;
  status?: JournalStatus;
}

export interface UpdateJournalRequest {
  note?: string;
  status?: JournalStatus;
}

export interface ListJournalsParams extends PaginationParams {
  search?: string;
  transactionId?: string;
  status?: JournalStatus;
  includeEntries?: boolean;
}

/**
 * List all journals with optional filtering and pagination
 */
export async function listJournals(params?: ListJournalsParams): Promise<PaginatedResponseDto<Journal>> {
  const response = await api.get<PaginatedResponseDto<Journal>>("/journals", { params });
  return response.data;
}

/**
 * Get a single journal by ID
 */
export async function getJournalById(journalId: string): Promise<Journal> {
  const response = await api.get<Journal>(`/journals/${journalId}`);
  return response.data;
}

/**
 * Create a new journal
 */
export async function createJournal(data: CreateJournalRequest): Promise<Journal> {
  const response = await api.post<Journal>("/journals", data);
  return response.data;
}

/**
 * Update an existing journal
 */
export async function updateJournal(journalId: string, data: UpdateJournalRequest): Promise<Journal> {
  const response = await api.patch<Journal>(`/journals/${journalId}`, data);
  return response.data;
}

/**
 * Delete a journal
 */
export async function deleteJournal(journalId: string): Promise<void> {
  await api.delete(`/journals/${journalId}`);
}

export interface AddJournalEntryRequest {
  ledgerAccountCode: number;
  dc: "DEBIT" | "CREDIT";
  amount: string;
  targetType?: "ACCOUNT" | "SUBSCRIPTION_FEE" | "INSTALLMENT";
  targetId?: string;
  note?: string;
  targetLedgerAccountCode?: number;
}

/**
 * Add a single entry to an existing journal
 */
export async function addJournalEntry(journalId: string, data: AddJournalEntryRequest): Promise<Journal> {
  const response = await api.post<Journal>(`/journals/${journalId}/entries`, data);
  return response.data;
}

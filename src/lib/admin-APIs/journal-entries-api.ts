import { PaginatedResponseDto, PaginationParams } from "@/types/api";
import { AllocationType, JournalEntry, JournalEntryTarget } from "@/types/entities/journal-entry.type";

import api from "../api";

export interface CreateJournalEntriesRequest {
  journalId: string;
  amount: number;
  targetType?: JournalEntryTarget;
  targetId?: string;
  allocationType: AllocationType;
}

export interface CreateMultipleJournalEntriesRequest {
  journalId: string;
  allocationType: AllocationType;
  targetType: JournalEntryTarget;
  items: Array<{
    targetId: string;
    amount: number;
  }>;
}

export interface ListJournalEntriesParams extends PaginationParams {
  search?: string;
  journalId?: string;
}

export async function listJournalEntries(
  params?: ListJournalEntriesParams
): Promise<PaginatedResponseDto<JournalEntry>> {
  const response = await api.get<PaginatedResponseDto<JournalEntry>>(`/admin/journal-entries`, {
    params
  });
  return response.data;
}

/**
 * Create a new journal entry
 */
export async function createJournalEntry(data: CreateJournalEntriesRequest): Promise<JournalEntry> {
  const response = await api.post<JournalEntry>(`/admin/journal-entries`, data);
  return response.data;
}

/**
 * Create multiple journal entries at once
 */
export async function createMultipleJournalEntries(data: CreateMultipleJournalEntriesRequest): Promise<JournalEntry[]> {
  const response = await api.post<JournalEntry[]>(`/admin/journal-entries/multiple`, data);
  return response.data;
}

/**
 * Delete a journal entry
 */
export async function deleteJournalEntry(entryId: string): Promise<void> {
  await api.delete(`/admin/journal-entries/${entryId}`);
}

import { PaginatedResponseDto, PaginationParams } from "@/types/api";
import { AllocationType, JournalEntry, JournalEntryTarget } from "@/types/entities/journal-entry.type";

import api from "./api";

export interface CreateJournalEntriesRequest {
  journalId: string;
  amount: number;
  targetType?: JournalEntryTarget;
  targetId?: string;
  allocationType: AllocationType;
}

export interface ListJournalEntriesParams extends PaginationParams {
  search?: string;
  journalId?: string;
}

export async function listJournalEntries(
  params?: ListJournalEntriesParams
): Promise<PaginatedResponseDto<JournalEntry>> {
  const response = await api.get<PaginatedResponseDto<JournalEntry>>("/journal-entries", { params });
  return response.data;
}

/**
 * Create a new journal entry
 */
export async function createJournalEntry(data: CreateJournalEntriesRequest): Promise<JournalEntry> {
  const response = await api.post<JournalEntry>("/journal-entries", data);
  return response.data;
}

/**
 * Delete a journal entry
 */
export async function deleteJournalEntry(entryId: string): Promise<void> {
  await api.delete(`/journal-entries/${entryId}`);
}

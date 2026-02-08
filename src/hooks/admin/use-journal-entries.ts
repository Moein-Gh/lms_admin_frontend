import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listJournalEntries,
  ListJournalEntriesParams,
  createJournalEntry,
  CreateJournalEntriesRequest,
  createMultipleJournalEntries,
  CreateMultipleJournalEntriesRequest,
  deleteJournalEntry
} from "@/lib/admin-APIs/journal-entries-api";

export function useJournalEntries(params?: ListJournalEntriesParams) {
  return useQuery({
    queryKey: ["journalEntries", params],
    queryFn: () => listJournalEntries(params)
  });
}

export function useCreateJournalEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateJournalEntriesRequest) => createJournalEntry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journalEntries"] });
      queryClient.invalidateQueries({ queryKey: ["journals"] });
      queryClient.invalidateQueries({ queryKey: ["installments"] });
    }
  });
}

export function useCreateMultipleJournalEntries() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMultipleJournalEntriesRequest) => createMultipleJournalEntries(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journalEntries"] });
      queryClient.invalidateQueries({ queryKey: ["journals"] });
      queryClient.invalidateQueries({ queryKey: ["installments"] });
    }
  });
}

export function useDeleteJournalEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (entryId: string) => deleteJournalEntry(entryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journalEntries"] });
      queryClient.invalidateQueries({ queryKey: ["journals"] });
    }
  });
}

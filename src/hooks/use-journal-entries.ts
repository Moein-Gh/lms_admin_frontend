import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listJournalEntries,
  ListJournalEntriesParams,
  createJournalEntry,
  CreateJournalEntriesRequest,
  deleteJournalEntry
} from "@/lib/journal-entries-api";

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

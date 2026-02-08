import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listJournals,
  getJournalById,
  createJournal,
  updateJournal,
  deleteJournal,
  CreateJournalRequest,
  UpdateJournalRequest,
  ListJournalsParams
} from "@/lib/admin-APIs/journal-api";

export function useJournals(params?: ListJournalsParams) {
  return useQuery({
    queryKey: ["journals", params],
    queryFn: () => listJournals(params)
  });
}

export function useJournal(journalId: string) {
  return useQuery({
    queryKey: ["journals", journalId],
    queryFn: () => getJournalById(journalId),
    enabled: !!journalId
  });
}

export function useCreateJournal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateJournalRequest) => createJournal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journals"] });
    }
  });
}

export function useUpdateJournal(journalId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateJournalRequest) => updateJournal(journalId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journals"] });
      queryClient.invalidateQueries({ queryKey: ["journals", journalId] });
    }
  });
}

export function useDeleteJournal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (journalId: string) => deleteJournal(journalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journals"] });
    }
  });
}

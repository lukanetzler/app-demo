import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { MoodEntry, InsertMoodEntry } from "@shared/schema";

export function useMoodEntries() {
  const { user } = useAuth();

  const { data: entries = [], isLoading } = useQuery<MoodEntry[]>({
    queryKey: ["/api/mood-entries", user?.uid],
    enabled: !!user,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,
  });

  console.log("useMoodEntries - user.uid:", user?.uid);
  console.log("useMoodEntries - entries:", entries);

  const createEntry = useMutation({
    mutationFn: async (data: InsertMoodEntry) => {
      if (user?.isAnonymous) {
        console.warn("Anonymous users cannot create entries.");
        return;
      }
      console.log('[useMoodEntries] Sending POST /api/mood-entries with:', data);
      const res = await apiRequest("POST", `/api/mood-entries`, data);
      const result = await res.json();
      console.log('[useMoodEntries] Entry created:', result);
      return result;
    },
    onSuccess: (data) => {
      console.log('[useMoodEntries] onSuccess - invalidating queries for userId:', user?.uid);
      console.log('[useMoodEntries] onSuccess - created entry:', data);
      queryClient.invalidateQueries({ queryKey: ["/api/mood-entries", user?.uid] });
      queryClient.invalidateQueries({ queryKey: ["/api/user-streaks", user?.uid] });
    },
  });

  const updateEntry = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<MoodEntry> }) => {
      if (user?.isAnonymous) {
        console.warn("Anonymous users cannot update entries.");
        return;
      }
      const res = await apiRequest("PATCH", `/api/mood-entries/${id}`, updates);
      return await res.json();
    },
    onMutate: async ({ id, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["/api/mood-entries", user?.uid] });

      // Snapshot the previous value
      const previousEntries = queryClient.getQueryData<MoodEntry[]>(["/api/mood-entries", user?.uid]);

      // Optimistically update to the new value
      if (previousEntries) {
        queryClient.setQueryData<MoodEntry[]>(
          ["/api/mood-entries", user?.uid],
          previousEntries.map(entry =>
            entry.id === id ? { ...entry, ...updates } : entry
          )
        );
      }

      return { previousEntries };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousEntries) {
        queryClient.setQueryData(["/api/mood-entries", user?.uid], context.previousEntries);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mood-entries", user?.uid] });
    },
  });

  const deleteEntry = useMutation({
    mutationFn: async (id: string) => {
      if (user?.isAnonymous) {
        console.warn("Anonymous users cannot delete entries.");
        return;
      }
      await apiRequest("DELETE", `/api/mood-entries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mood-entries", user?.uid] });
      queryClient.invalidateQueries({ queryKey: ["/api/user-streaks", user?.uid] });
    },
  });

  return {
    entries,
    isLoading,
    createEntry,
    updateEntry,
    deleteEntry,
  };
}

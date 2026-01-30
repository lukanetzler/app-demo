import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import type { UserStreak } from "@shared/schema";

export function useUserStreak() {
  const { user } = useAuth();

  const { data: streak, isLoading } = useQuery<UserStreak | null>({
    queryKey: ["/api/user-streaks", user?.uid],
    queryFn: async () => {
      if (!user?.uid) return null;
      try {
        const res = await fetch(`/api/user-streaks/${user.uid}`, {
          credentials: "include",
        });
        if (res.status === 404) {
          return null;
        }
        if (!res.ok) {
          throw new Error(`${res.status}: ${res.statusText}`);
        }
        return await res.json();
      } catch (error) {
        throw error;
      }
    },
    enabled: !!user && !user.isAnonymous,
    retry: false,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,
  });

  return {
    streak,
    isLoading,
  };
}

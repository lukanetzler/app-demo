import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { UserProfile, InsertUserProfile } from "@shared/schema";

export function useUserProfile() {
  const { user } = useAuth();

  const { data: profile, isLoading } = useQuery<UserProfile | null>({
    queryKey: ["/api/user-profiles", user?.uid],
    queryFn: async () => {
      if (!user?.uid) return null;
      try {
        const res = await fetch(`/api/user-profiles/${user.uid}`, {
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

  const createProfile = useMutation({
    mutationFn: async (data: InsertUserProfile) => {
      if (user?.isAnonymous) {
        console.warn("Anonymous users cannot create a profile.");
        return;
      }
      const res = await apiRequest("POST", `/api/user-profiles`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-profiles", user?.uid] });
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      if (user?.isAnonymous) {
        console.warn("Anonymous users cannot update a profile.");
        return;
      }
      if (!user) throw new Error("No user");
      const res = await apiRequest("PATCH", `/api/user-profiles/${user.uid}`, updates);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-profiles", user?.uid] });
    },
  });

  return {
    profile,
    isLoading,
    createProfile,
    updateProfile,
  };
}

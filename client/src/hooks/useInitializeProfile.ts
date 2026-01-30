import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "./useUserProfile";

export function useInitializeProfile() {
  const { user } = useAuth();
  const { profile, isLoading, createProfile } = useUserProfile();

  useEffect(() => {
    if (user && !user.isAnonymous && !isLoading && !profile) {
      createProfile.mutate({
        userId: user.uid,
        email: user.email || "",
        displayName: user.displayName || null,
        isPremium: false,
        currentStreak: 0,
        longestStreak: 0,
        lastCheckInDate: null,
      });
    }
  }, [user, profile, isLoading]);

  return { profile };
}

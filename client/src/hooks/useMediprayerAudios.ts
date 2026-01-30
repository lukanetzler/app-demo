import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import type { AudioContent } from "@shared/schema";

async function getAudioUrl(audioPath: string | null, isAnonymous: boolean): Promise<string | null> {
  if (!audioPath) {
    return null;
  }

  if (isAnonymous) {
    // For anonymous users, you might have a limited set of public audio files
    // Or return null to indicate that audio is not available for anonymous users
    return null;
  }

  try {
    const audioRef = ref(storage, audioPath);
    const url = await getDownloadURL(audioRef);
    return url;
  } catch (error) {
    console.error("Error getting audio URL:", error);
    // Handle specific errors, e.g., object-not-found
    return null;
  }
}

export function useMediprayerAudios(mediprayers: AudioContent[]) {
  const { user } = useAuth();
  const isAnonymous = !user || user.isAnonymous;

  const { data: audioUrls, isLoading } = useQuery({
    queryKey: ['mediprayerAudios', mediprayers.map(m => m.id), isAnonymous],
    queryFn: async () => {
      const urls = new Map<string, string | null>();
      for (const mediprayer of mediprayers) {
        const url = await getAudioUrl(mediprayer.audioUrl, isAnonymous);
        urls.set(mediprayer.id, url);
      }
      return urls;
    },
    enabled: !!mediprayers.length, // Only run the query if there are mediprayers
  });

  return {
    audioUrls,
    isLoading,
  };
}

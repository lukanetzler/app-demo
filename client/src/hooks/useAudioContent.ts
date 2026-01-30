import { useQuery } from "@tanstack/react-query";
import type { AudioContent } from "@shared/schema";

export function useAudioContent(type?: string) {
  const { data: content = [], isLoading } = useQuery<AudioContent[]>({
    queryKey: type ? ["/api/audio-content", { type }] : ["/api/audio-content"],
  });

  return {
    content,
    isLoading,
  };
}

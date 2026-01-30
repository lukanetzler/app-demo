import { useLocation } from "wouter";
import AudioPlayer from "@/components/AudioPlayer";
import { getStreamingUrl } from "@/lib/storageService";
import { useEffect, useState } from "react";

export default function AudioPlayerPage() {
  const [, setLocation] = useLocation();

  // Parse query parameters from the full URL including search params
  const queryString = typeof window !== 'undefined' ? window.location.search : '';
  const params = new URLSearchParams(queryString);
  const gsUrl = params.get("url");
  const title = params.get("title");
  const source = params.get("source"); // 'library' or 'tracking'
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (gsUrl) {
      setIsLoading(true);
      setError(null);
      getStreamingUrl(gsUrl)
        .then(url => {
          if (url) {
            setAudioUrl(url);
          } else {
            setError("Failed to get audio URL from Firebase Storage");
          }
        })
        .catch(err => {
          console.error("Error getting streaming URL:", err);
          setError(err instanceof Error ? err.message : "Unknown error");
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [gsUrl]);

  if (!gsUrl || !title) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">
          <p>Audio not found.</p>
          <p className="text-sm mt-2">URL: {gsUrl || "missing"}</p>
          <p className="text-sm">Title: {title || "missing"}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading audio...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">
          <p>Error loading audio</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  // Determine navigation behavior based on source
  const handleComplete = () => {
    setLocation("/library");
  };

  const handleSkip = () => {
    setLocation("/library");
  };

  const skipButtonText = source === "library" ? "Done" : "Close";

  return (
    <div className="min-h-screen bg-background pb-24 flex items-center justify-center">
      <AudioPlayer
        title={title}
        audioUrl={audioUrl ?? undefined}
        onComplete={handleComplete}
        onSkip={handleSkip}
        skipButtonText={skipButtonText}
      />
    </div>
  );
}

import { useMemo } from "react";
import { useLocation, useRoute } from "wouter";
import MediprayerCard from "@/components/MediprayerCard";
import { getMediprayersForEmotion } from "@/lib/mediprayerService";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function EmotionMediprayersPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/library/:emotion");

  const emotion = params?.emotion ? decodeURIComponent(params.emotion) : null;

  const mediprayers = useMemo(() => {
    if (!emotion) return [];
    return getMediprayersForEmotion(emotion);
  }, [emotion]);

  const handlePlay = (file: { title: string; url: string }) => {
    setLocation(`/player?url=${encodeURIComponent(file.url)}&title=${encodeURIComponent(file.title)}&source=library`);
  };

  const handleBackToLibrary = () => {
    setLocation("/library");
  };

  if (!emotion) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No emotion selected</p>
          <Button onClick={handleBackToLibrary}>Back to Library</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-lg mx-auto p-4 pt-20">
        {/* Header with back button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleBackToLibrary}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Library
          </Button>

          <h1 className="text-3xl font-bold text-muted-foreground mb-2 capitalize">
            {emotion}
          </h1>
          <p className="text-sm text-muted-foreground">
            {mediprayers.length} mediprayer{mediprayers.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {/* Mediprayer Cards */}
        <div className="grid grid-cols-1 gap-4">
          {mediprayers.length > 0 ? (
            mediprayers.map((mediprayer, index) => (
              <MediprayerCard
                key={`${mediprayer.url}-${index}`}
                title={mediprayer.title}
                description={mediprayer.description}
                onPlay={() => handlePlay(mediprayer)}
              />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No mediprayers found for this emotion.</p>
              <Button onClick={handleBackToLibrary} className="mt-4">
                Back to Library
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

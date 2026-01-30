import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AudioPlayer from "@/components/AudioPlayer";

interface CompletionScreenProps {
  emotion?: string;
  audio?: { name: string; url: string; } | null;
  loading?: boolean;
  error?: Error | null;
  onComplete?: () => void;
}

export default function CompletionScreen({
  emotion,
  audio,
  loading,
  error,
  onComplete
}: CompletionScreenProps) {
  return (
    <div className="w-full max-w-md mx-auto text-center flex flex-col items-center" data-testid="screen-completion">
      <div className="mb-6">
        <CheckCircle className="w-20 h-20 text-streak mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-2">Well Done!</h2>
        <p className="text-muted-foreground">
          Your mood has been tracked and saved to your journal.
        </p>
      </div>

      {emotion && (
        <div className="bg-card rounded-2xl p-6 mb-8 w-full">
          <p className="text-sm text-muted-foreground mb-2">A Mediprayer for your feeling of "{emotion}"</p>
          {loading && <p>Finding a mediprayer for you...</p>}
          {error && <p>Error finding a mediprayer: {error.message}</p>}
          {audio && (
            <div>
              <h3 className="text-lg font-semibold mb-2">{audio.name.replace('.mp3', '').replace(/_/g, ' ')}</h3>
              <AudioPlayer src={audio.url} />
            </div>
          )}
          {!audio && !loading && !error && (
              <p>We couldn't find a mediprayer for "{emotion}" at the moment.</p>
          )}
        </div>
      )}

      <Button
        onClick={() => {
          onComplete?.();
          console.log('Continue to journal');
        }}
        size="lg"
        className="w-full max-w-xs"
        data-testid="button-view-journal"
      >
        View Journal
      </Button>
    </div>
  );
}

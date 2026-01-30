import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipForward, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useMediprayerAudios } from "@/hooks/useMediprayerAudios";
import type { AudioContent } from "@shared/schema";

interface AudioPlayerProps {
  title: string;
  subtitle?: string;
  mediprayer?: AudioContent;
  audioUrl?: string;
  imageUrl?: string;
  onComplete?: () => void;
  onSkip?: () => void;
  skipButtonText?: string;
  circular?: boolean;
}

export default function AudioPlayer({
  title,
  subtitle,
  mediprayer,
  audioUrl: initialAudioUrl,
  imageUrl,
  onComplete,
  onSkip,
  skipButtonText = "Skip",
  circular = false
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { audioUrls, isLoading } = useMediprayerAudios(mediprayer ? [mediprayer] : []);
  const audioUrl = initialAudioUrl || (mediprayer ? audioUrls?.get(mediprayer.id) : undefined);

  useEffect(() => {
    if (audioUrl) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });
      audioRef.current.addEventListener('loadedmetadata', () => {
        setAudioDuration(audioRef.current?.duration || 0);
      });
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        onComplete?.();
      });
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioUrl, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (!audioRef.current) {
      console.warn('No audio loaded');
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSkip = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    onSkip?.();
  };

  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const isAudioAvailable = !!audioUrl;
  const progress = audioDuration > 0 ? currentTime / audioDuration : 0;

  // Circular progress ring dimensions
  const ringSize = 220;
  const strokeWidth = 6;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  if (circular) {
    return (
      <div className="w-full max-w-md mx-auto flex flex-col items-center" data-testid="player-audio">
        <h2 className="text-2xl font-bold mb-1 text-center" data-testid="text-audio-title">{title}</h2>
        {subtitle && (
          <p className="text-muted-foreground text-center mb-6" data-testid="text-audio-subtitle">{subtitle}</p>
        )}

        {isLoading && (
          <div className="flex items-center justify-center my-8">
            <Loader2 className="w-6 h-6 animate-spin" />
            <p className="ml-2">Loading audio...</p>
          </div>
        )}
        {!isLoading && !audioUrl && (
          <p className="text-sm text-muted-foreground mt-2 mb-6 bg-muted/50 p-3 rounded-lg text-center" data-testid="text-audio-unavailable">
            Audio content is currently unavailable. Please skip to continue.
          </p>
        )}

        {/* Circular progress ring with play/pause button */}
        <div className="relative my-6" style={{ width: ringSize, height: ringSize }}>
          <svg width={ringSize} height={ringSize} className="transform -rotate-90">
            {/* Background ring */}
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={radius}
              fill="none"
              stroke="currentColor"
              className="text-muted/30"
              strokeWidth={strokeWidth}
            />
            {/* Progress ring */}
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={radius}
              fill="none"
              stroke="currentColor"
              className="text-primary transition-all duration-300"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          {/* Play/pause button in center */}
          <button
            onClick={togglePlay}
            disabled={!isAudioAvailable || isLoading}
            className="absolute inset-0 flex items-center justify-center"
            data-testid="button-play-pause"
          >
              {isPlaying
                ? <Pause className="w-10 h-10 text-primary" />
                : <Play className="w-10 h-10 text-primary ml-1" />
              }
          </button>
        </div>

        {/* Time display */}
        <div className="flex items-center gap-3 text-sm mb-8">
          <span className="text-foreground font-medium">{formatTime(currentTime)}</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">{formatTime(audioDuration)}</span>
        </div>

        {/* Complete / skip button */}
        <Button
          variant={!audioUrl ? "default" : "outline"}
          onClick={handleSkip}
          className="rounded-full px-8"
          data-testid="button-skip-audio"
        >
          <SkipForward className="w-4 h-4 mr-2" />
          {!audioUrl ? "Continue" : skipButtonText}
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto" data-testid="player-audio">
      <div className="relative mb-8">
        <div
          className="aspect-video rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden"
          style={imageUrl ? { backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover' } : {}}
        >
          {!imageUrl && (
            <div className="text-6xl">🎵</div>
          )}
        </div>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-1" data-testid="text-audio-title">{title}</h2>
        {subtitle && (
          <p className="text-muted-foreground" data-testid="text-audio-subtitle">{subtitle}</p>
        )}
        {isLoading && (
          <div className="flex items-center justify-center mt-4">
            <Loader2 className="w-6 h-6 animate-spin" />
            <p className="ml-2">Loading audio...</p>
          </div>
        )}
        {!isLoading && !audioUrl && (
          <p className="text-sm text-muted-foreground mt-2 bg-muted/50 p-3 rounded-lg" data-testid="text-audio-unavailable">
            Audio content is currently unavailable. Please skip to continue.
          </p>
        )}
      </div>

      <div className="mb-6">
        <Slider
          value={[currentTime]}
          max={audioDuration}
          step={1}
          onValueChange={handleSeek}
          className="mb-2"
          data-testid="slider-audio-progress"
          disabled={!isAudioAvailable || isLoading}
        />
        <div className="flex justify-between text-sm">
          <span className="text-duration font-medium" data-testid="text-audio-elapsed">
            {formatTime(currentTime)}
          </span>
          <span className="text-muted-foreground" data-testid="text-audio-remaining">
            {formatTime(audioDuration - currentTime)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button
          size="icon"
          onClick={togglePlay}
          className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90"
          data-testid="button-play-pause"
          disabled={!isAudioAvailable || isLoading}
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
        </Button>

        <Button
          variant={!audioUrl ? "default" : "outline"}
          onClick={handleSkip}
          data-testid="button-skip-audio"
        >
          <SkipForward className="w-4 h-4 mr-2" />
          {!audioUrl ? "Continue" : skipButtonText}
        </Button>
      </div>
    </div>
  );
}

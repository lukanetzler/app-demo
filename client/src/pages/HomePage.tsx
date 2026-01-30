import { useState, useRef, useEffect } from "react";
import MoodSelector from "@/components/MoodSelector";
import AudioPlayer from "@/components/AudioPlayer";
import { getStreamingUrl } from "@/lib/storageService";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useMoodEntries } from "@/hooks/useMoodEntries";
import { useToast } from "@/hooks/use-toast";

const MEDITATION_GS_URL = "gs://daily-breaditation.firebasestorage.app/Mindfulness Meditations/Elijah, Debut.mp3";

export default function HomePage() {
  const [showJournalEntry, setShowJournalEntry] = useState(false);
  const [showMeditationPlayer, setShowMeditationPlayer] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [, setLocation] = useLocation();
  const { createEntry } = useMoodEntries();
  const { user } = useAuth();
  const { toast } = useToast();

  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const playerRef = useRef<HTMLDivElement>(null);
  const journalRef = useRef<HTMLDivElement>(null);

  const [meditationAudioUrl, setMeditationAudioUrl] = useState<string | null>(null);

  const [moodData, setMoodData] = useState({
    moodValue: 0,
    moodLabel: "",
    journalText: "",
  });

  // Resolve the meditation audio URL from Firebase Storage
  useEffect(() => {
    getStreamingUrl(MEDITATION_GS_URL).then((url) => {
      if (url) setMeditationAudioUrl(url);
    });
  }, []);

  const handleMoodSelect = (value: number) => {
    const moodLabels = ["Terrible", "Bad", "Okay", "Good", "Great"];
    setMoodData((prev) => ({
      ...prev,
      moodValue: value,
      moodLabel: moodLabels[value - 1]
    }));

    // Automatically swipe up to journal entry after selection
    setTimeout(() => {
      setShowJournalEntry(true);
    }, 300);
  };

  const handleJournalContinue = () => {
    setShowJournalEntry(false);
    setTimeout(() => {
      setShowMeditationPlayer(true);
    }, 100);
  };

  const handleMeditationComplete = async () => {
    // Show completion screen with swipe-up animation
    setShowMeditationPlayer(false);
    setTimeout(() => setShowCompletion(true), 100);

    // Trigger header streak animation
    window.dispatchEvent(new Event("streak-celebrate"));

    if (!user) {
      // Wait for animation, then redirect
      setTimeout(() => {
        toast({
          title: "Login required",
          description: "Please login to save your meditation session.",
        });
        setLocation("/auth");
      }, 2000);
      return;
    }

    try {
      const now = new Date();
      const entryData = {
        userId: user.uid,
        date: now,
        moodValue: moodData.moodValue,
        emotion: moodData.moodLabel,
        reflection: moodData.journalText || null,
        bibleVerseReference: null,
        bibleVerseText: null,
      };
      console.log('[HomePage] Creating entry with data:', entryData);
      console.log('[HomePage] User UID:', user.uid);
      const result = await createEntry.mutateAsync(entryData);
      console.log('[HomePage] Entry created successfully:', result);

      // Navigate after a moment so the user sees the completion screen
      setTimeout(() => setLocation("/journal"), 2000);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save session. Please try again.",
      });
    }
  };

  // Touch event handlers for swipe gestures (journal entry)
  const handleJournalTouchStart = (e: React.TouchEvent) => {
    if (!showJournalEntry) return;
    setDragStart(e.touches[0].clientY);
  };

  const handleJournalTouchMove = (e: React.TouchEvent) => {
    if (!showJournalEntry || dragStart === null) return;
    const currentY = e.touches[0].clientY;
    const offset = currentY - dragStart;

    if (offset > 0) {
      setDragOffset(offset);
    }
  };

  const handleJournalTouchEnd = () => {
    if (!showJournalEntry || dragStart === null) return;

    if (dragOffset > 100) {
      setShowJournalEntry(false);
    }

    setDragStart(null);
    setDragOffset(0);
  };

  // Touch event handlers for swipe gestures (meditation player)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!showMeditationPlayer) return;
    setDragStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!showMeditationPlayer || dragStart === null) return;
    const currentY = e.touches[0].clientY;
    const offset = currentY - dragStart;

    if (offset > 0) {
      setDragOffset(offset);
    }
  };

  const handleTouchEnd = () => {
    if (!showMeditationPlayer || dragStart === null) return;

    if (dragOffset > 100) {
      setShowMeditationPlayer(false);
      setShowJournalEntry(true);
    }

    setDragStart(null);
    setDragOffset(0);
  };

  // Mouse event handlers for desktop swipe gestures
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!showMeditationPlayer) return;
    setDragStart(e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!showMeditationPlayer || dragStart === null) return;
    const currentY = e.clientY;
    const offset = currentY - dragStart;

    if (offset > 0) {
      setDragOffset(offset);
    }
  };

  const handleMouseUp = () => {
    if (!showMeditationPlayer || dragStart === null) return;

    if (dragOffset > 100) {
      setShowMeditationPlayer(false);
      setShowJournalEntry(true);
    }

    setDragStart(null);
    setDragOffset(0);
  };

  return (
    <div className="min-h-screen bg-background pb-24 flex flex-col overflow-hidden">
      <div className="max-w-lg mx-auto w-full p-4 pt-20 flex-1 flex flex-col relative">
        {/* Mood Selector Screen */}
        <div
          className={`absolute inset-0 pt-20 transition-transform duration-500 ease-in-out ${
            showJournalEntry || showMeditationPlayer || showCompletion ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
          }`}
        >
          <div className="flex-1 flex items-center justify-center">
            <MoodSelector onSelect={handleMoodSelect} userName={user?.displayName} />
          </div>
        </div>

        {/* Journal Entry Screen - Swipeable */}
        <div
          ref={journalRef}
          className={`absolute inset-0 pt-20 transition-all ${
            dragStart !== null && showJournalEntry ? 'duration-0' : 'duration-500'
          } ease-in-out ${
            showJournalEntry && !showMeditationPlayer ? 'translate-y-0 opacity-100' : showMeditationPlayer ? '-translate-y-full opacity-0' : 'translate-y-full opacity-0'
          }`}
          style={{
            transform: showJournalEntry && !showMeditationPlayer && dragStart !== null
              ? `translateY(${dragOffset}px)`
              : undefined
          }}
          onTouchStart={handleJournalTouchStart}
          onTouchMove={handleJournalTouchMove}
          onTouchEnd={handleJournalTouchEnd}
        >
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            {/* Swipe indicator */}
            <div className="w-12 h-1 bg-muted-foreground/30 rounded-full mb-4" />

            <div className="w-full max-w-md mx-auto">
              <div className="bg-card rounded-2xl p-6 space-y-4">
                <textarea
                  value={moodData.journalText}
                  onChange={(e) => setMoodData((prev) => ({ ...prev, journalText: e.target.value }))}
                  placeholder="What's on your mind today?"
                  className="w-full h-48 p-4 bg-background border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <button
                  onClick={handleJournalContinue}
                  className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors active:scale-95"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Meditation Player Screen - Swipeable */}
        <div
          ref={playerRef}
          className={`absolute inset-0 pt-20 transition-all ${
            dragStart !== null ? 'duration-0' : 'duration-500'
          } ease-in-out ${
            showMeditationPlayer ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          }`}
          style={{
            transform: showMeditationPlayer && dragStart !== null
              ? `translateY(${dragOffset}px)`
              : undefined
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* Swipe indicator */}
            <div className="w-12 h-1 bg-muted-foreground/30 rounded-full mb-4" />

            <div className="w-full max-w-md mx-auto px-4">
              <AudioPlayer
                title="Calming Meditation"
                audioUrl={meditationAudioUrl ?? undefined}
                onComplete={handleMeditationComplete}
                onSkip={handleMeditationComplete}
                skipButtonText="Complete"
                circular
              />
            </div>
          </div>
        </div>

        {/* Completion Screen - Swipe Up */}
        <div
          className={`absolute inset-0 pt-20 transition-all duration-700 ease-out ${
            showCompletion ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          }`}
        >
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-3xl font-bold mb-2">Session Complete</h2>
            <p className="text-muted-foreground text-lg">Well done. Your entry has been saved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

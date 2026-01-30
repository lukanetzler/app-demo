import { useState, useEffect, useRef } from "react";
import { useLocation, useRoute } from "wouter";
import { useMoodEntries } from "@/hooks/useMoodEntries";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Heart, Smile, Save, Trash2, Pencil } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const moodLabels: Record<number, string> = {
  1: "Terrible",
  2: "Bad",
  3: "Okay",
  4: "Good",
  5: "Great",
};

const moodEmojis: Record<number, string> = {
  1: "\u{1F629}",
  2: "\u{1F614}",
  3: "\u{1F610}",
  4: "\u{1F60A}",
  5: "\u{1F60D}",
};

const moodBgColors: Record<number, string> = {
  1: "bg-mood-terrible/15",
  2: "bg-mood-bad/15",
  3: "bg-mood-okay/15",
  4: "bg-mood-good/15",
  5: "bg-mood-great/15",
};

const moodTextColors: Record<number, string> = {
  1: "text-mood-terrible",
  2: "text-mood-bad",
  3: "text-mood-okay",
  4: "text-mood-good",
  5: "text-mood-great",
};

const EMOJI_OPTIONS = [
  "\u{1F60A}", "\u{1F60D}", "\u{1F64F}", "\u{2764}\u{FE0F}", "\u{1F31F}", "\u{1F4AA}", "\u{1F33F}", "\u{2728}",
  "\u{1F60C}", "\u{1F970}", "\u{1F917}", "\u{1F62D}", "\u{1F614}", "\u{1F615}", "\u{1F622}", "\u{1F62A}",
  "\u{1F4AD}", "\u{1F54A}\u{FE0F}", "\u{1F31E}", "\u{1F319}", "\u{1F338}", "\u{1F343}", "\u{1F30A}", "\u{26A1}",
];

export default function EntryDetailPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/entry/:id");
  const { entries, updateEntry, deleteEntry } = useMoodEntries();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [editedReflection, setEditedReflection] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const entryId = params?.id;
  const entry = entries.find((e) => e.id === entryId);

  useEffect(() => {
    if (entry) {
      setEditedReflection(entry.reflection || "");
    }
  }, [entry]);

  if (!entry) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Entry not found</p>
          <Button variant="outline" onClick={() => setLocation("/journal")}>
            Back to Journal
          </Button>
        </div>
      </div>
    );
  }

  // Handle both ISO strings and Firestore Timestamp objects ({_seconds, _nanoseconds})
  const rawDate = entry.date as any;
  const entryDate = rawDate?._seconds
    ? new Date(rawDate._seconds * 1000)
    : new Date(rawDate);
  const isValidDate = !isNaN(entryDate.getTime());

  const dateStr = isValidDate
    ? entryDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown date";
  const timeStr = isValidDate
    ? entryDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateEntry.mutateAsync({
        id: entry.id,
        updates: { reflection: editedReflection },
      });
      setIsEditing(false);
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save changes",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEntry.mutateAsync(entry.id);
      setLocation("/journal");
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete entry",
      });
    }
  };

  const insertEmoji = (emoji: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newText =
        editedReflection.substring(0, start) +
        emoji +
        editedReflection.substring(end);
      setEditedReflection(newText);
      // Set cursor after emoji
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
        textarea.focus();
      });
    } else {
      setEditedReflection(editedReflection + emoji);
    }
    setShowEmojiPicker(false);
  };

  return (
    <div className="min-h-screen bg-background pb-24 swipe-up">
      <div className="max-w-lg mx-auto p-4 pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/journal")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="w-5 h-5" />
              </Button>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Trash2 className="w-5 h-5 text-muted-foreground" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-3xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your journal entry.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="rounded-full">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Mood Hero */}
        <div
          className={`${moodBgColors[entry.moodValue]} rounded-3xl p-8 mb-6 text-center`}
        >
          <div className="text-5xl mb-3">{moodEmojis[entry.moodValue]}</div>
          <h2
            className={`text-2xl font-bold ${moodTextColors[entry.moodValue]} mb-1`}
          >
            {moodLabels[entry.moodValue]}
          </h2>
          <p className="text-foreground font-medium">Feeling {entry.emotion}</p>
        </div>

        {/* Date & Time */}
        <div className="bg-card rounded-3xl border border-border p-5 mb-4">
          <p className="text-sm text-muted-foreground">{dateStr}</p>
          <p className="text-xs text-muted-foreground/70 mt-1">{timeStr}</p>
        </div>

        {/* Reflection */}
        <div className="bg-card rounded-3xl border border-border p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Reflection
            </h3>
            {isEditing && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 relative"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Smile className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={editedReflection}
                onChange={(e) => setEditedReflection(e.target.value)}
                className="w-full min-h-[150px] bg-muted/50 rounded-2xl p-4 text-sm text-foreground resize-none border border-border/50 focus:border-primary/50 focus:outline-none transition-colors"
                placeholder="Write your reflection..."
              />

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="absolute bottom-full mb-2 left-0 right-0 bg-card border border-border rounded-2xl p-3 shadow-lg z-10">
                  <div className="grid grid-cols-8 gap-2">
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => insertEmoji(emoji)}
                        className="text-xl hover:bg-muted rounded-lg p-1.5 transition-colors text-center"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 mt-3">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  size="sm"
                  className="gap-2 rounded-full"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Saving..." : "Save"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedReflection(entry.reflection || "");
                    setShowEmojiPicker(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">
              {entry.reflection || (
                <span className="text-muted-foreground italic">
                  No reflection added yet. Tap the pencil icon to add one.
                </span>
              )}
            </p>
          )}
        </div>

        {/* Bible Verse */}
        {entry.bibleVerseReference && (
          <div className="bg-card rounded-3xl border border-border p-5">
            <div className="flex items-start gap-3">
              <Heart className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-primary mb-2">
                  {entry.bibleVerseReference}
                </p>
                <p className="text-sm text-foreground/80 italic leading-relaxed">
                  {entry.bibleVerseText}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

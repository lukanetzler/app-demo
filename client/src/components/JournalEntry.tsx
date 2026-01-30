import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Calendar, Heart, Trash2 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface JournalEntryProps {
  date: string;
  time?: string;
  moodValue: number;
  emotion: string;
  reflection?: string;
  bibleVerse?: {
    reference: string;
    text: string;
  };
  onDelete?: () => void;
}

const moodLabels = {
  1: "Terrible",
  2: "Bad",
  3: "Okay",
  4: "Good",
  5: "Great"
};

const moodColors = {
  1: 'text-mood-terrible',
  2: 'text-mood-bad',
  3: 'text-mood-okay',
  4: 'text-mood-good',
  5: 'text-mood-great',
};

export default function JournalEntry({
  date,
  time,
  moodValue,
  emotion,
  reflection,
  bibleVerse,
  onDelete,
}: JournalEntryProps) {
  const [isFullViewOpen, setIsFullViewOpen] = useState(false);

  return (
    <>
    <Card
      className="p-4 hover-elevate active-elevate-2 relative cursor-pointer max-h-[calc(100vh-16rem)] overflow-hidden flex flex-col"
      data-testid="card-journal-entry"
      onClick={(e) => {
        // Don't open full view if clicking on delete button
        if ((e.target as HTMLElement).closest('button')) return;
        setIsFullViewOpen(true);
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground" data-testid="text-entry-date">
              {date}
            </span>
            {time && (
              <span className="text-xs text-muted-foreground/70" data-testid="text-entry-time">
                {time}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`text-sm font-semibold ${moodColors[moodValue as keyof typeof moodColors]}`}>
            {moodLabels[moodValue as keyof typeof moodLabels]} ({moodValue}/5)
          </div>
          {onDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your journal entry.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      <div className="mb-3">
        <span className="text-foreground font-medium" data-testid="text-entry-emotion">
          Feeling {emotion}
        </span>
      </div>

      {reflection && (
        <div className="text-sm text-muted-foreground mb-3 overflow-hidden flex-1">
          <p className="line-clamp-[8]">
            {reflection}
          </p>
        </div>
      )}

      {bibleVerse && (
        <div className="flex items-start gap-2 pt-3 border-t border-border/50">
          <Heart className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-primary font-medium">
              {bibleVerse.reference}
            </p>
          </div>
        </div>
      )}
    </Card>

    {/* Full View Dialog */}
    <Dialog open={isFullViewOpen} onOpenChange={setIsFullViewOpen}>
      <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">Journal Entry</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {/* Date and Time */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">{date}</span>
              {time && <span className="text-xs text-muted-foreground/70">{time}</span>}
            </div>
          </div>

          {/* Mood */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Mood:</span>
            <span className={`text-sm font-semibold ${moodColors[moodValue as keyof typeof moodColors]}`}>
              {moodLabels[moodValue as keyof typeof moodLabels]} ({moodValue}/5)
            </span>
          </div>

          {/* Emotion */}
          <div>
            <span className="text-foreground font-medium">Feeling {emotion}</span>
          </div>

          {/* Reflection */}
          {reflection && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Reflection:</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{reflection}</p>
            </div>
          )}

          {/* Bible Verse */}
          {bibleVerse && (
            <div className="flex items-start gap-2 pt-3 border-t border-border/50">
              <Heart className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-primary font-medium mb-2">{bibleVerse.reference}</p>
                <p className="text-sm text-muted-foreground">{bibleVerse.text}</p>
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setIsFullViewOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}

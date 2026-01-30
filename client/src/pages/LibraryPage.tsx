import { useState } from "react";
import { Sparkles, Zap, Flower2, BookOpen, Heart } from "lucide-react";
import { useLocation } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function LibraryPage() {
  const [wordsDialogOpen, setWordsDialogOpen] = useState(false);
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-4xl mx-auto p-4 pt-20">
        <div className="grid gap-4">
          {/* Words of Power Card */}
          <button
            onClick={() => setWordsDialogOpen(true)}
            className="bg-card rounded-3xl p-8 border border-border hover:border-primary/50 transition-all active:scale-95 group"
          >
            <div className="flex items-center gap-4">
              <div className="p-4 bg-primary/15 rounded-2xl group-hover:bg-primary/20 transition-colors">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-bold text-foreground">Words of Power</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Discover daily wisdom
                </p>
              </div>
            </div>
          </button>

          {/* Support Banner */}
          <button
            onClick={() => setLocation("/support")}
            className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-6 border-2 border-primary/30 hover:border-primary/50 transition-all active:scale-95 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/20 rounded-2xl group-hover:bg-primary/30 transition-colors">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-foreground">Support Our Mission</h3>
                  <p className="text-sm text-muted-foreground">Help us bring faith and mindfulness to more people</p>
                </div>
              </div>
            </div>
          </button>

          {/* Smaller Action Buttons */}
          <div className="grid grid-cols-3 gap-3 mt-2">
            {/* Minis Button */}
            <button
              className="bg-card rounded-2xl p-4 border border-border hover:border-primary/50 transition-all active:scale-95 group"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 bg-primary/15 rounded-xl group-hover:bg-primary/20 transition-colors">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-medium text-foreground">Minis</span>
              </div>
            </button>

            {/* Meditation Button */}
            <button
              className="bg-card rounded-2xl p-4 border border-border hover:border-primary/50 transition-all active:scale-95 group"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 bg-primary/15 rounded-xl group-hover:bg-primary/20 transition-colors">
                  <Flower2 className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-medium text-foreground">Meditation</span>
              </div>
            </button>

            {/* Stories Button */}
            <button
              className="bg-card rounded-2xl p-4 border border-border hover:border-primary/50 transition-all active:scale-95 group"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 bg-primary/15 rounded-xl group-hover:bg-primary/20 transition-colors">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-medium text-foreground">Stories</span>
              </div>
            </button>
          </div>
        </div>

        {/* Words of Power Dialog */}
        <Dialog open={wordsDialogOpen} onOpenChange={setWordsDialogOpen}>
          <DialogContent className="bg-card border-border rounded-3xl p-8 max-w-md">
            <DialogHeader className="space-y-4">
              <DialogTitle className="text-foreground flex items-center justify-center gap-2 text-xl">
                <Sparkles className="w-6 h-6 text-primary" />
                Words of Power
              </DialogTitle>
              <DialogDescription className="text-foreground/80 text-base leading-relaxed space-y-4">
                <p className="text-center italic">
                  "For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope."
                </p>
                <p className="text-center text-sm text-primary font-semibold">
                  Jeremiah 29:11
                </p>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

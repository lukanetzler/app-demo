import { Settings, User, Flame, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useUserStreak } from "@/hooks/useUserStreak";
import { useState, useEffect } from "react";

export default function Header() {
  const { user, signOut } = useAuth();
  const { streak } = useUserStreak();
  const [location, setLocation] = useLocation();
  const [streakDialogOpen, setStreakDialogOpen] = useState(false);

  const isJournalPage = location === "/journal";
  const [isCelebrating, setIsCelebrating] = useState(false);

  // Listen for streak celebration event from HomePage
  useEffect(() => {
    const handler = () => {
      setIsCelebrating(true);
      setTimeout(() => setIsCelebrating(false), 3000);
    };
    window.addEventListener("streak-celebrate", handler);
    return () => window.removeEventListener("streak-celebrate", handler);
  }, []);

  const isExpanded = isJournalPage || isCelebrating;

  const handleExitPreview = async () => {
    if (user?.isAnonymous) {
      await signOut();
    }
    setLocation("/welcome");
  };

  const handleAccountClick = () => {
    setLocation("/account");
  };

  const handleSettingsClick = () => {
    setLocation("/settings");
  };

  // Show exit preview button for anonymous (guest) users
  if (user?.isAnonymous) {
    return (
      <header className="flex items-center justify-end p-4">
        <Button
          onClick={handleExitPreview}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <LogOut className="w-4 h-4" />
          Exit Preview
        </Button>
      </header>
    );
  }

  return (
    <>
      <header className="flex items-center justify-between p-4 relative">
        <Button size="icon" variant="ghost" onClick={handleSettingsClick}>
          <Settings className="w-6 h-6" />
        </Button>

        {/* Streak Display - Clickable - Expands on Journal Page */}
        <button
          onClick={() => setStreakDialogOpen(true)}
          className={`relative flex items-center gap-1.5 bg-primary/15 border border-primary/30 rounded-full hover:bg-primary/20 transition-all duration-500 active:scale-95 ${
            isExpanded
              ? 'px-6 py-4 gap-2'
              : 'px-3 py-1.5'
          }`}
        >
          <Flame
            className={`text-primary transition-all duration-500 ${
              isExpanded ? 'w-8 h-8' : 'w-4 h-4'
            }`}
          />
          <span
            className={`font-semibold text-primary transition-all duration-500 ${
              isExpanded ? 'text-2xl' : 'text-sm'
            }`}
          >
            {streak?.currentStreak || 0}
          </span>
        </button>

        <Button size="icon" variant="ghost" onClick={handleAccountClick}>
          <User className="w-6 h-6" />
        </Button>
      </header>

      {/* Streak Info Dialog */}
      <Dialog open={streakDialogOpen} onOpenChange={setStreakDialogOpen}>
        <DialogContent className="bg-card border-border rounded-3xl p-8 max-w-md">
          <DialogHeader className="space-y-4">
            <DialogTitle className="text-foreground flex items-center justify-center gap-2 text-xl">
              <Flame className="w-6 h-6 text-primary" />
              Your Daily Flame
            </DialogTitle>
            <DialogDescription className="text-foreground/80 text-base leading-relaxed space-y-4">
              <p>The flame represents your commitment to daily practice. Each day you complete a meditation session, your flame grows stronger.</p>

              <p>Keep your daily practice alive, and your flame will continue to burn bright. Miss a day, and the flame will reset.</p>

              <p className="text-center pt-2">
                Current streak: <span className="font-semibold text-primary text-lg">{streak?.currentStreak || 0} {streak?.currentStreak === 1 ? 'day' : 'days'}</span>
              </p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

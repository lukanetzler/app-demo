import { useMemo, useState, useEffect } from "react";
import { useInitializeProfile } from "@/hooks/useInitializeProfile";
import { useMoodEntries } from "@/hooks/useMoodEntries";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const moodEmojis: Record<number, string> = {
  1: "\u{1F629}",
  2: "\u{1F614}",
  3: "\u{1F610}",
  4: "\u{1F60A}",
  5: "\u{1F60D}",
};

const moodLabels: Record<number, string> = {
  1: "Terrible",
  2: "Bad",
  3: "Okay",
  4: "Good",
  5: "Great",
};

const moodTextColors: Record<number, string> = {
  1: "text-mood-terrible",
  2: "text-mood-bad",
  3: "text-mood-okay",
  4: "text-mood-good",
  5: "text-mood-great",
};

export default function JournalPage() {
  useInitializeProfile();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { entries, isLoading } = useMoodEntries();
  const [view, setView] = useState<"journal" | "mood">("journal");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isEntryPickerOpen, setIsEntryPickerOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showSignInDialog, setShowSignInDialog] = useState(false);

  // Check if user is anonymous and show dialog
  useEffect(() => {
    if (user?.isAnonymous) {
      setShowSignInDialog(true);
    }
  }, [user]);

  const processedEntries = useMemo(() => {
    return entries.map(entry => {
      const dateCandidate = new Date(entry.date);
      return {
        ...entry,
        date: isNaN(dateCandidate.getTime()) ? new Date() : dateCandidate
      };
    });
  }, [entries]);

  // Get entries grouped by date
  const entriesByDate = useMemo(() => {
    const grouped = new Map<string, typeof processedEntries>();
    processedEntries.forEach(entry => {
      const dateKey = entry.date.toDateString();
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)!.push(entry);
    });
    return grouped;
  }, [processedEntries]);

  // Get calendar dates for current month
  const calendarDates = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysFromPrevMonth = startingDayOfWeek;
    const dates = [];

    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      dates.push({ date, isCurrentMonth: false });
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      dates.push({ date, isCurrentMonth: true });
    }

    const remainingDays = 7 - (dates.length % 7);
    if (remainingDays < 7) {
      for (let i = 1; i <= remainingDays; i++) {
        const date = new Date(year, month + 1, i);
        dates.push({ date, isCurrentMonth: false });
      }
    }

    return dates;
  }, [currentMonth]);

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const goToCurrentMonth = () => {
    setCurrentMonth(new Date());
  };

  const handleDateClick = (date: Date) => {
    const dateEntries = entriesByDate.get(date.toDateString()) || [];
    if (dateEntries.length === 1) {
      // Go directly to entry detail page
      setLocation(`/entry/${dateEntries[0].id}`);
    } else if (dateEntries.length > 1) {
      // Show picker to choose which entry
      setSelectedDate(date);
      setIsEntryPickerOpen(true);
    }
  };

  const selectedEntries = selectedDate
    ? entriesByDate.get(selectedDate.toDateString()) || []
    : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-24 flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-lg mx-auto p-4 pt-20">
        {/* Toggle Menu */}
        <div className="bg-muted p-1 rounded-xl mb-6 flex gap-1">
          <button
            onClick={() => setView("journal")}
            className={`
              flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all
              ${view === "journal"
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
              }
            `}
          >
            Journal Entries
          </button>
          <button
            onClick={() => setView("mood")}
            className={`
              flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all
              ${view === "mood"
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
              }
            `}
          >
            Mood History
          </button>
        </div>

        {view === "journal" ? (
          <div className="space-y-6">
            {/* Total Entries Circle */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-primary/10 border-4 border-primary flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary">{processedEntries.length}</div>
                    <div className="text-xs text-muted-foreground">Total Entries</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="space-y-4">
              {/* Month Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={goToPreviousMonth}
                  className="p-2 rounded-full border-2 border-muted hover:border-primary hover:bg-muted transition-all active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                </button>

                <button
                  onClick={goToCurrentMonth}
                  className="text-lg font-semibold text-muted-foreground hover:text-primary transition-colors"
                >
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </button>

                <button
                  onClick={goToNextMonth}
                  className="p-2 rounded-full border-2 border-muted hover:border-primary hover:bg-muted transition-all active:scale-95"
                >
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Day Labels */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-xs font-medium text-muted-foreground text-center">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Dates */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDates.map(({ date, isCurrentMonth }, index) => {
                  const hasEntry = entriesByDate.has(date.toDateString());
                  const isToday = date.toDateString() === new Date().toDateString();

                  return (
                    <button
                      key={index}
                      onClick={() => hasEntry && handleDateClick(date)}
                      disabled={!hasEntry}
                      className={`
                        aspect-square rounded-md flex items-center justify-center text-sm font-medium
                        transition-all
                        ${!isCurrentMonth ? 'opacity-30' : ''}
                        ${hasEntry
                          ? 'bg-primary text-primary-foreground hover:scale-110 active:scale-95 cursor-pointer'
                          : 'bg-muted text-muted-foreground cursor-not-allowed'
                        }
                        ${isToday ? 'ring-2 ring-primary ring-offset-2' : ''}
                      `}
                      title={date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Empty State */}
            {processedEntries.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No journal entries yet
                </p>
                <p className="text-sm text-muted-foreground">
                  Start tracking your mood to see your entries here
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {processedEntries.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No mood data yet
                </p>
                <p className="text-sm text-muted-foreground">
                  Start tracking your mood to see your history here
                </p>
              </div>
            ) : (
              <>
                {/* Donut Chart */}
                <div className="flex flex-col items-center">
                  <svg viewBox="0 0 200 200" className="w-64 h-64">
                    {(() => {
                      const moodData = [5, 4, 3, 2, 1].map(mood => ({
                        mood,
                        count: processedEntries.filter(e => e.moodValue === mood).length,
                        percentage: processedEntries.length > 0
                          ? (processedEntries.filter(e => e.moodValue === mood).length / processedEntries.length) * 100
                          : 0
                      })).filter(d => d.count > 0);

                      const moodColorMap: Record<number, string> = {
                        1: '#ef4444',
                        2: '#f97316',
                        3: '#eab308',
                        4: '#84cc16',
                        5: '#22c55e',
                      };

                      let currentAngle = -90;
                      const radius = 80;
                      const innerRadius = 55;
                      const centerX = 100;
                      const centerY = 100;

                      return (
                        <>
                          {moodData.map((data, index) => {
                            const angle = (data.percentage / 100) * 360;
                            const startAngle = currentAngle;
                            const endAngle = currentAngle + angle;

                            const startRad = (startAngle * Math.PI) / 180;
                            const endRad = (endAngle * Math.PI) / 180;

                            const x1 = centerX + radius * Math.cos(startRad);
                            const y1 = centerY + radius * Math.sin(startRad);
                            const x2 = centerX + radius * Math.cos(endRad);
                            const y2 = centerY + radius * Math.sin(endRad);

                            const ix1 = centerX + innerRadius * Math.cos(startRad);
                            const iy1 = centerY + innerRadius * Math.sin(startRad);
                            const ix2 = centerX + innerRadius * Math.cos(endRad);
                            const iy2 = centerY + innerRadius * Math.sin(endRad);

                            const largeArc = angle > 180 ? 1 : 0;

                            const pathData = [
                              `M ${x1} ${y1}`,
                              `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
                              `L ${ix2} ${iy2}`,
                              `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1}`,
                              'Z'
                            ].join(' ');

                            currentAngle = endAngle;

                            return (
                              <path
                                key={index}
                                d={pathData}
                                fill={moodColorMap[data.mood]}
                                className="transition-all hover:opacity-80"
                              />
                            );
                          })}
                          <circle
                            cx={centerX}
                            cy={centerY}
                            r={innerRadius - 5}
                            fill="transparent"
                          />
                          {/* Lotus / calm icon in center */}
                          <g transform={`translate(${centerX}, ${centerY})`} className="fill-primary" opacity="0.7">
                            {/* Center petal (upward) */}
                            <path d="M0,-20 C6,-14 8,-6 0,2 C-8,-6 -6,-14 0,-20Z" />
                            {/* Left petal */}
                            <path d="M0,2 C-6,-4 -16,-6 -18,0 C-16,6 -6,8 0,2Z" />
                            {/* Right petal */}
                            <path d="M0,2 C6,-4 16,-6 18,0 C16,6 6,8 0,2Z" />
                            {/* Base curve */}
                            <path d="M-12,6 Q0,14 12,6" strokeWidth="2" className="stroke-primary" fill="none" />
                          </g>
                        </>
                      );
                    })()}
                  </svg>

                  {/* Legend */}
                  <div className="mt-6 flex flex-wrap justify-center gap-4">
                    {[5, 4, 3, 2, 1].map(mood => {
                      const count = processedEntries.filter(e => e.moodValue === mood).length;
                      if (count === 0) return null;

                      const moodColorMap: Record<number, string> = {
                        1: 'bg-mood-terrible',
                        2: 'bg-mood-bad',
                        3: 'bg-mood-okay',
                        4: 'bg-mood-good',
                        5: 'bg-mood-great',
                      };

                      return (
                        <div key={mood} className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${moodColorMap[mood]}`} />
                          <span className="text-sm text-muted-foreground">{moodLabels[mood]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Emotions */}
                <div className="bg-card rounded-xl p-4 border border-border">
                  <h4 className="text-sm font-medium text-muted-foreground mb-4">Recent Emotions</h4>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(processedEntries.slice(0, 10).map(e => e.emotion))).map(emotion => (
                      <span
                        key={emotion}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {emotion}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Entry Picker Dialog (when multiple entries on same date) */}
        <Dialog open={isEntryPickerOpen} onOpenChange={setIsEntryPickerOpen}>
          <DialogContent className="bg-card border-border rounded-3xl p-6 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-foreground text-lg">
                {selectedDate?.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                You have {selectedEntries.length} entries this day. Select one to view.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              {selectedEntries.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => {
                    setIsEntryPickerOpen(false);
                    setLocation(`/entry/${entry.id}`);
                  }}
                  className="w-full bg-muted/50 rounded-2xl p-4 border border-border hover:border-primary/50 transition-all active:scale-[0.98] text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{moodEmojis[entry.moodValue]}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-semibold ${moodTextColors[entry.moodValue]}`}>
                          {moodLabels[entry.moodValue]}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {entry.date.toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Feeling {entry.emotion}
                      </p>
                      {entry.reflection && (
                        <p className="text-xs text-muted-foreground/70 mt-1 line-clamp-1">
                          {entry.reflection}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Sign-In Required Dialog */}
        <Dialog open={showSignInDialog} onOpenChange={(open) => {
          if (!open) {
            setLocation("/");
          }
        }}>
          <DialogContent className="bg-card border-border rounded-3xl p-8 max-w-md">
            <DialogHeader className="space-y-4">
              <DialogTitle className="text-foreground flex items-center justify-center gap-2 text-xl">
                <Lock className="w-6 h-6 text-primary" />
                Sign In Required
              </DialogTitle>
              <DialogDescription className="text-foreground/80 text-base leading-relaxed space-y-4">
                <p className="text-center">
                  This feature is only available to signed-in users.
                </p>
                <p className="text-center text-sm text-muted-foreground">
                  Create an account or sign in to track your journal entries and keep them saved across all your devices.
                </p>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 mt-6">
              <Button
                onClick={() => setLocation("/welcome")}
                className="w-full"
                size="lg"
              >
                Sign In / Sign Up
              </Button>
              <Button
                onClick={() => setLocation("/")}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Go Back
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

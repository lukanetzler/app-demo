import { Flame } from "lucide-react";

interface StreakCounterProps {
  days: number;
}

export default function StreakCounter({ days }: StreakCounterProps) {
  return (
    <div 
      className="bg-streak text-streak-foreground rounded-xl p-3 flex items-center gap-2"
      data-testid="card-streak"
    >
      <Flame className="w-6 h-6" fill="currentColor" />
      <div>
        <div className="text-3xl font-extrabold leading-none" data-testid="text-streak-days">
          {days}
        </div>
        <div className="text-xs font-semibold mt-0.5">
          Day{days !== 1 ? 's' : ''} Streak
        </div>
      </div>
    </div>
  );
}

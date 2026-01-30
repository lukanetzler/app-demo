import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendarDay {
  date: number;
  moodValue?: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

interface MoodCalendarProps {
  month: string;
  year: number;
  days: CalendarDay[];
  onDayClick?: (day: CalendarDay) => void;
  onPreviousMonth?: () => void;
  onNextMonth?: () => void;
  canGoNext?: boolean;
}

const moodColors = {
  1: 'bg-mood-terrible',
  2: 'bg-mood-bad',
  3: 'bg-mood-okay',
  4: 'bg-mood-good',
  5: 'bg-mood-great',
};

export default function MoodCalendar({ 
  month, 
  year, 
  days, 
  onDayClick, 
  onPreviousMonth, 
  onNextMonth,
  canGoNext = true 
}: MoodCalendarProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const handleDayClick = (day: CalendarDay) => {
    if (day.isCurrentMonth) {
      setSelectedDay(day.date);
      onDayClick?.(day);
      console.log('Day clicked:', day);
    }
  };

  return (
    <div className="w-full" data-testid="calendar-mood">
      <div className="mb-4 flex items-center justify-between">
        <Button
          size="icon"
          variant="ghost"
          onClick={onPreviousMonth}
          data-testid="button-prev-month"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        
        <h3 className="text-lg font-semibold text-foreground">
          {month} {year}
        </h3>
        
        <Button
          size="icon"
          variant="ghost"
          onClick={onNextMonth}
          disabled={!canGoNext}
          data-testid="button-next-month"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map((day, i) => (
          <div key={i} className="w-10 text-center text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, i) => {
          const isSelected = selectedDay === day.date && day.isCurrentMonth;
          const moodColor = day.moodValue ? moodColors[day.moodValue as keyof typeof moodColors] : '';
          
          return (
            <button
              key={i}
              onClick={() => handleDayClick(day)}
              disabled={!day.isCurrentMonth}
              className={`
                relative w-10 h-10 rounded-full flex items-center justify-center
                text-sm font-medium transition-all
                ${day.isCurrentMonth ? 'hover-elevate active-elevate-2 cursor-pointer' : 'opacity-30 cursor-not-allowed'}
                ${isSelected ? 'ring-2 ring-foreground' : ''}
                ${day.isToday && !moodColor ? 'ring-2 ring-primary' : ''}
                ${moodColor || 'text-muted-foreground'}
              `}
              data-testid={`button-calendar-day-${day.date}`}
            >
              {moodColor && (
                <div className={`absolute inset-0 rounded-full ${moodColor}`} />
              )}
              <span className={`relative z-10 ${moodColor ? 'text-background' : ''}`}>
                {day.date}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

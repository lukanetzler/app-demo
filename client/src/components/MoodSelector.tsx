import { useState } from "react";
import { Frown, Meh, Smile, Laugh } from "lucide-react";

interface MoodOption {
  value: number;
  label: string;
  emoji: string;
  icon?: any;
}

const moodOptions: MoodOption[] = [
  { value: 1, label: "Terrible", emoji: "😢", icon: Frown },
  { value: 2, label: "Bad", emoji: "😞", icon: Frown },
  { value: 3, label: "Okay", emoji: "😐", icon: Meh },
  { value: 4, label: "Good", emoji: "😊", icon: Smile },
  { value: 5, label: "Great", emoji: "😄", icon: Laugh },
];

interface MoodSelectorProps {
  onSelect?: (value: number) => void;
  userName?: string | null;
}

export default function MoodSelector({ onSelect, userName }: MoodSelectorProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (value: number) => {
    setSelected(value);
    onSelect?.(value);
    console.log('Mood selected:', value);
  };

  // Get first name from full name
  const getFirstName = (fullName: string | null | undefined) => {
    if (!fullName) return null;
    return fullName.trim().split(' ')[0];
  };

  const firstName = getFirstName(userName);
  const greeting = firstName ? `How are you feeling, ${firstName}?` : "How are you feeling?";

  return (
    <div className="w-full max-w-md mx-auto" data-testid="selector-mood">
      <h2 className="text-2xl font-bold text-center mb-2">{greeting}</h2>
      <p className="text-muted-foreground text-center mb-8">Select your current mood</p>

      <div className="flex justify-center gap-3">
        {moodOptions.map((mood) => (
          <button
            key={mood.value}
            onClick={() => handleSelect(mood.value)}
            className={`
              flex flex-col items-center gap-2 p-4 rounded-2xl transition-all
              hover-elevate active-elevate-2
              ${selected === mood.value ? 'bg-primary text-primary-foreground scale-110' : 'bg-card'}
            `}
            data-testid={`button-mood-${mood.value}`}
          >
            <span className="text-5xl">{mood.emoji}</span>
            <span className="text-xs font-medium">{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

import { useState } from "react";

const emotions = [
  "Anger",
  "Anxiety",
  "Arrogance",
  "Bitterness",
  "Blessed",
  "Confidence",
  "Depression",
  "Doubt",
  "Embarrassment",
  "Envy",
  "Greed",
  "Grief",
  "Guilt",
  "Happy",
  "Hopeless",
  "Intolerant",
  "Judgement",
  "Lonely",
  "Lost",
  "Motivated",
  "Pride",
  "Purposeless",
  "Regret",
  "Resentment",
  "Shame",
  "Spiritual doubt",
  "Temptation",
  "Tired",
  "Vanity",
  "Worry",
];

interface EmotionSelectorProps {
  onSelect?: (emotion: string) => void;
}

export default function EmotionSelector({ onSelect }: EmotionSelectorProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (emotion: string) => {
    setSelected(emotion);
    onSelect?.(emotion);
    console.log('Emotion selected:', emotion);
  };

  return (
    <div className="w-full max-w-md mx-auto" data-testid="selector-emotion">
      <h2 className="text-2xl font-bold text-center mb-2">What emotion describes it best?</h2>
      <p className="text-muted-foreground text-center mb-8">Select the emotion you're experiencing</p>

      <div className="grid grid-cols-2 gap-3">
        {emotions.map((emotion) => (
          <button
            key={emotion}
            onClick={() => handleSelect(emotion)}
            className={`
              px-4 py-3 rounded-xl text-sm font-medium transition-all
              hover-elevate active-elevate-2
              ${selected === emotion
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground'
              }
            `}
            data-testid={`button-emotion-${emotion.toLowerCase()}`}
          >
            {emotion}
          </button>
        ))}
      </div>
    </div>
  );
}
